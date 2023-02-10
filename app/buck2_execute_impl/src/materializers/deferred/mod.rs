/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under both the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree and the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree.
 */

mod clean_stale;
mod extension;
mod file_tree;
mod io_handler;

#[cfg(test)]
mod tests;

use std::collections::VecDeque;
use std::sync::atomic::AtomicUsize;
use std::sync::atomic::Ordering;
use std::sync::Arc;

use allocative::Allocative;
use anyhow::Context;
use async_trait::async_trait;
use buck2_common::file_ops::FileDigest;
use buck2_common::file_ops::FileMetadata;
use buck2_common::file_ops::TrackedFileDigest;
use buck2_common::result::SharedError;
use buck2_common::result::SharedResult;
use buck2_common::result::ToSharedResultExt;
use buck2_common::result::ToUnsharedResultExt;
use buck2_core::directory::unordered_entry_walk;
use buck2_core::directory::DirectoryEntry;
use buck2_core::env_helper::EnvHelper;
use buck2_core::fs::paths::RelativePathBuf;
use buck2_core::fs::project::ProjectRoot;
use buck2_core::fs::project_rel_path::ProjectRelativePath;
use buck2_core::fs::project_rel_path::ProjectRelativePathBuf;
use buck2_core::quiet_soft_error;
use buck2_events::dispatch::current_span;
use buck2_events::dispatch::get_dispatcher;
use buck2_events::dispatch::get_dispatcher_opt;
use buck2_events::dispatch::EventDispatcher;
use buck2_events::span::SpanId;
use buck2_events::trace::TraceId;
use buck2_execute::artifact_value::ArtifactValue;
use buck2_execute::directory::ActionDirectory;
use buck2_execute::directory::ActionDirectoryEntry;
use buck2_execute::directory::ActionDirectoryMember;
use buck2_execute::directory::ActionSharedDirectory;
use buck2_execute::execute::blocking::BlockingExecutor;
use buck2_execute::materialize::materializer::ArtifactNotMaterializedReason;
use buck2_execute::materialize::materializer::CasDownloadInfo;
use buck2_execute::materialize::materializer::CopiedArtifact;
use buck2_execute::materialize::materializer::DeclareMatchOutcome;
use buck2_execute::materialize::materializer::DeferredMaterializerExtensions;
use buck2_execute::materialize::materializer::HttpDownloadInfo;
use buck2_execute::materialize::materializer::MaterializationError;
use buck2_execute::materialize::materializer::Materializer;
use buck2_execute::materialize::materializer::WriteRequest;
use buck2_execute::re::manager::ReConnectionManager;
use chrono::DateTime;
use chrono::Duration;
use chrono::Utc;
use derive_more::Display;
use dupe::Clone_;
use dupe::Copy_;
use dupe::Dupe;
use dupe::Dupe_;
use dupe::OptionDupedExt;
use futures::future::BoxFuture;
use futures::future::FutureExt;
use futures::future::Shared;
use futures::future::TryFutureExt;
use futures::stream::BoxStream;
use futures::stream::FuturesOrdered;
use futures::stream::StreamExt;
use gazebo::prelude::*;
use itertools::Itertools;
use thiserror::Error;
use tokio::runtime::Handle;
use tokio::sync::mpsc;
use tokio::sync::oneshot;
use tokio::task::JoinHandle;
use tokio_stream::wrappers::IntervalStream;
use tokio_stream::wrappers::UnboundedReceiverStream;
use tracing::instrument;

use crate::materializers::deferred::extension::ExtensionCommand;
use crate::materializers::deferred::file_tree::FileTree;
use crate::materializers::deferred::io_handler::DefaultIoHandler;
use crate::materializers::deferred::io_handler::IoHandler;
use crate::materializers::immediate;
use crate::materializers::sqlite::MaterializerState;
use crate::materializers::sqlite::MaterializerStateSqliteDb;

/// Materializer implementation that defers materialization of declared
/// artifacts until they are needed (i.e. `ensure_materialized` is called).
///
/// # Important
///
/// This materializer defers both CAS fetches and local copies. Therefore, one
/// needs to be careful when choosing to call `ensure_materialized`.
/// Between `declare` and `ensure` calls, the local files could have changed.
///
/// This limits us to only "safely" using the materializer within the
/// computation of a build rule, and only to materialize inputs or outputs of
/// the rule, not random artifacts/paths. That's because:
/// - file changes before/after a build are handled by DICE, which invalidates
///   the outputs that depend on it. The materializer ends up having the wrong
///   information about these outputs. But because it's only used within the
///   build rules, the affected rule is recomputed and therefore has its
///   artifacts re-declared. So when `ensure` is called the materializer has
///   up-to-date information about the artifacts.
/// - file changes during a build are not properly supported by Buck and
///   treated as undefined behaviour, so there's no need to worry about them.
#[derive(Allocative)]
pub struct DeferredMaterializer {
    /// Sender to emit commands to the command loop. See `MaterializerCommand`.
    #[allocative(skip)]
    command_sender: MaterializerSender<DefaultIoHandler>,
    /// Handle of the command loop thread. Aborted on Drop.
    /// This thread serves as a queue for declare/ensure requests, making
    /// sure only one executes at a time and in the order they came in.
    /// TODO(rafaelc): aim to replace it with a simple mutex.
    #[allocative(skip)]
    command_thread: std::thread::JoinHandle<()>,
    /// Determines what to do on `try_materialize_final_artifact`: if true,
    /// materializes them, otherwise skips them.
    materialize_final_artifacts: bool,
    defer_write_actions: bool,

    /// To be removed, used to implement write for now.
    fs: ProjectRoot,
    io_executor: Arc<dyn BlockingExecutor>,

    /// Tracked for logging purposes.
    materializer_state_info: buck2_data::MaterializerStateInfo,
}

impl Drop for DeferredMaterializer {
    fn drop(&mut self) {
        // We don't try to stop the underlying thread, since in practice when we drop the
        // DeferredMaterializer we are about to just terminate the process.
    }
}

pub struct DeferredMaterializerConfigs {
    pub materialize_final_artifacts: bool,
    pub defer_write_actions: bool,
    pub ttl_refresh: TtlRefreshConfiguration,
}

pub struct TtlRefreshConfiguration {
    pub frequency: std::time::Duration,
    pub min_ttl: Duration,
    pub enabled: bool,
}

#[derive(Copy, Dupe, Clone)]
struct MaterializerCounters {
    sent: &'static AtomicUsize,
    received: &'static AtomicUsize,
}

impl MaterializerCounters {
    /// New counters. Note that this leaks the underlying data. See comments on MaterializerSender.
    fn leak_new() -> Self {
        Self {
            sent: Box::leak(box AtomicUsize::new(0)),
            received: Box::leak(box AtomicUsize::new(0)),
        }
    }

    fn ack_received(&self) {
        self.received.fetch_add(1, Ordering::Relaxed);
    }

    fn queue_size(&self) -> usize {
        self.sent
            .load(Ordering::Relaxed)
            .saturating_sub(self.received.load(Ordering::Relaxed))
    }
}

// NOTE: When constructing a MaterializerSender, we just leak the underlying channel. We do this
// because the materializer lives for the lifetime of the process anyway, so there's no value in
// refcounting any of this (though we make many copies of it).
#[derive(Copy_, Dupe_, Clone_)]
struct MaterializerSender<T: ?Sized + 'static> {
    sender: &'static mpsc::UnboundedSender<MaterializerCommand<T>>,
    counters: MaterializerCounters,
}

impl<T> MaterializerSender<T> {
    fn send(
        &self,
        command: MaterializerCommand<T>,
    ) -> Result<(), mpsc::error::SendError<MaterializerCommand<T>>> {
        let res = self.sender.send(command);
        self.counters.sent.fetch_add(1, Ordering::Relaxed);
        res
    }
}

struct MaterializerReceiver<T> {
    receiver: mpsc::UnboundedReceiver<MaterializerCommand<T>>,
    counters: MaterializerCounters,
}

struct DeferredMaterializerCommandProcessor<T> {
    io: Arc<T>,
    sqlite_db: Option<MaterializerStateSqliteDb>,
    /// The runtime the deferred materializer will spawn futures on. This is normally the runtime
    /// used by the rest of Buck.
    rt: Handle,
    defer_write_actions: bool,
    log_buffer: LogBuffer,
}

// NOTE: This doesn't derive `Error` and that's on purpose.  We don't want to make it easy (or
// possible, in fact) to add  `context` to this SharedProcessingError and lose the variant.
#[derive(Debug, Clone, Dupe)]
enum SharedMaterializingError {
    Error(SharedError),
    NotFound {
        info: Arc<CasDownloadInfo>,
        debug: Arc<str>,
    },
}

#[derive(Error, Debug)]
enum MaterializeEntryError {
    #[error(transparent)]
    Error(#[from] anyhow::Error),

    /// The artifact wasn't found. This typically means it expired in the CAS.
    #[error("Artifact not found (digest origin: {}, debug: {})", .info, .debug)]
    NotFound {
        info: Arc<CasDownloadInfo>,
        debug: Arc<str>,
    },
}

impl From<MaterializeEntryError> for SharedMaterializingError {
    fn from(e: MaterializeEntryError) -> SharedMaterializingError {
        match e {
            MaterializeEntryError::Error(e) => Self::Error(e.into()),
            MaterializeEntryError::NotFound { info, debug } => Self::NotFound { info, debug },
        }
    }
}

/// A future that is materializing on a separate task spawned by the materializer
type MaterializingFuture = Shared<BoxFuture<'static, Result<(), SharedMaterializingError>>>;
/// A future that is cleaning paths on a separate task spawned by the materializer
type CleaningFuture = Shared<BoxFuture<'static, SharedResult<()>>>;

#[derive(Clone)]
enum ProcessingFuture {
    Materializing(MaterializingFuture),
    Cleaning(CleaningFuture),
}

/// Message taken by the `DeferredMaterializer`'s command loop.
enum MaterializerCommand<T: ?Sized> {
    // [Materializer trait methods -> Command thread]
    /// Takes a list of file paths, computes the materialized file paths of all
    /// of them, and sends the result through the oneshot.
    /// See `Materializer::get_materialized_file_paths` for more information.
    GetMaterializedFilePaths(
        Vec<ProjectRelativePathBuf>,
        oneshot::Sender<Vec<Result<ProjectRelativePathBuf, ArtifactNotMaterializedReason>>>,
    ),

    /// Declares that a set of artifacts already exist
    DeclareExisting(
        Vec<(ProjectRelativePathBuf, ArtifactValue)>,
        Option<SpanId>,
        Option<TraceId>,
    ),

    /// Declares an artifact: its path, value, and how to materialize it.
    Declare(
        ProjectRelativePathBuf,
        ArtifactValue,
        Box<ArtifactMaterializationMethod>, // Boxed to avoid growing all variants
    ),

    MatchArtifacts(
        Vec<(ProjectRelativePathBuf, ArtifactValue)>,
        oneshot::Sender<bool>,
    ),

    /// Declares that given paths are no longer eligible to be materialized by this materializer.
    /// This typically should reflect a change made to the underlying filesystem, either because
    /// the file was created, or because it was removed..
    InvalidateFilePaths(Vec<ProjectRelativePathBuf>, oneshot::Sender<CleaningFuture>),

    /// Takes a list of artifact paths, and materializes all artifacts in the
    /// list that have been declared but not yet been materialized. When the
    /// materialization starts, a future is sent back through the provided
    /// Sender; this future will be resolved when the materialization
    /// concludes (whether successfuly or not).
    Ensure(
        Vec<ProjectRelativePathBuf>,
        EventDispatcher,
        oneshot::Sender<BoxStream<'static, Result<(), MaterializationError>>>,
    ),

    /// [Materialization task -> Command thread]
    /// Notifies the command thread that an artifact was materialized. It takes
    /// the artifact path and the version that was materialized, such that if
    /// a newer version was declared during materialization - which should not
    /// happen under normal conditions - we can react accordingly.
    MaterializationFinished {
        path: ProjectRelativePathBuf,
        timestamp: DateTime<Utc>,
        version: u64,
        result: Result<(), SharedMaterializingError>,
    },

    Extension(Box<dyn ExtensionCommand<T>>),
}

impl<T> std::fmt::Debug for MaterializerCommand<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MaterializerCommand::GetMaterializedFilePaths(paths, _) => {
                write!(f, "GetMaterializedFilePaths({:?}, _)", paths,)
            }
            MaterializerCommand::DeclareExisting(paths, current_span, trace_id) => {
                write!(
                    f,
                    "DeclareExisting({:?}, {:?}, {:?})",
                    paths, current_span, trace_id
                )
            }
            MaterializerCommand::Declare(path, value, method) => {
                write!(f, "Declare({:?}, {:?}, {:?})", path, value, method,)
            }
            MaterializerCommand::MatchArtifacts(paths, _) => {
                write!(f, "MatchArtifacts({:?})", paths)
            }
            MaterializerCommand::InvalidateFilePaths(paths, _) => {
                write!(f, "InvalidateFilePaths({:?})", paths)
            }
            MaterializerCommand::Ensure(paths, _, _) => write!(f, "Ensure({:?}, _)", paths,),
            MaterializerCommand::MaterializationFinished {
                path,
                timestamp,
                version,
                result,
            } => f
                .debug_struct("MaterializationFinished")
                .field("path", path)
                .field("timestamp", timestamp)
                .field("version", version)
                .field("result", result)
                .finish(),
            MaterializerCommand::Extension(ext) => write!(f, "Extension({:?})", ext),
        }
    }
}

/// Tree that stores materialization data for each artifact. Used internally by
/// the `DeferredMaterializer` to keep track of artifacts and how to
/// materialize them.
type ArtifactTree = FileTree<Box<ArtifactMaterializationData>>;

pub(crate) struct ArtifactMaterializationData {
    /// Taken from `deps` of `ArtifactValue`. Used to materialize deps of the artifact.
    deps: Option<ActionSharedDirectory>,
    stage: ArtifactMaterializationStage,
    /// The version is just an internal counter that increases every time an
    /// artifact is declared (i.e. it tells us in which order they were declared).
    version: u64,
    /// An optional future that may be processing something at the current path
    /// (for example, materializing or deleting). Any other future that needs to process
    /// this path would need to wait on the existing future to finish.
    /// TODO(scottcao): Turn this into a queue of pending futures.
    processing_fut: Option<ProcessingFuture>,
}

/// Fingerprint used to identify `ActionSharedDirectory`. We give it an explicit
/// alias because `TrackedFileDigest` can look confusing.
pub type ActionDirectoryFingerprint = TrackedFileDigest;

/// Metadata used to identify an artifact entry without all of its content. Stored on materialized
/// artifacts to check matching artifact optimizations. For `ActionSharedDirectory`, we use its fingerprint,
/// For everything else (files, symlinks, and external symlinks), we use `ActionDirectoryMember`
/// as is because it already holds the metadata we need.
#[derive(Clone, Dupe, Debug, PartialEq, Eq)]
pub struct ArtifactMetadata(pub ActionDirectoryEntry<ActionDirectoryFingerprint>);

impl From<ActionDirectoryEntry<ActionSharedDirectory>> for ArtifactMetadata {
    fn from(entry: ActionDirectoryEntry<ActionSharedDirectory>) -> Self {
        let new_entry: ActionDirectoryEntry<ActionDirectoryFingerprint> = match entry {
            DirectoryEntry::Dir(dir) => DirectoryEntry::Dir(dir.fingerprint().dupe()),
            DirectoryEntry::Leaf(leaf) => DirectoryEntry::Leaf(leaf),
        };
        Self(new_entry)
    }
}

enum ArtifactMaterializationStage {
    /// The artifact was declared, but the materialization hasn't started yet.
    /// If it did start but end with an error, it returns to this stage.
    /// When the the artifact was declared, we spawn a deletion future to delete
    /// all existing paths that conflict with the output paths.
    Declared {
        /// Taken from `entry` of `ArtifactValue`. Used to materialize the actual artifact.
        entry: ActionDirectoryEntry<ActionSharedDirectory>,
        method: Arc<ArtifactMaterializationMethod>,
    },
    /// This artifact was materialized
    Materialized {
        /// Once the artifact is materialized, we don't need the full entry anymore.
        /// We can throw away most of the entry and just keep some metadata used to
        /// check if materialized artifact matches declared artifact.
        metadata: ArtifactMetadata,
        /// Used to clean older artifacts from buck-out.
        last_access_time: DateTime<Utc>,
        /// Artifact declared by running daemon.
        /// Should not be deleted without invalidating DICE nodes, which currently
        /// means killing the daemon.
        active: bool,
    },
}

/// Different ways to materialize the files of an artifact. Some artifacts need
/// to be fetched from the CAS, others copied locally.
#[derive(Debug, Display)]
enum ArtifactMaterializationMethod {
    /// The files must be copied from a local path.
    ///
    /// The first argument is a map `[dest => src]`, meaning that a file at
    /// `{artifact_path}/{dest}/{p}` needs to be copied from `{src}/{p}`.
    ///
    /// The second argument is the raw list of copied artifacts, as received
    /// in `declare_copy`.
    #[display(fmt = "local copy")]
    LocalCopy(FileTree<ProjectRelativePathBuf>, Vec<CopiedArtifact>),

    #[display(fmt = "write")]
    Write(Arc<WriteFile>),

    /// The files must be fetched from the CAS.
    #[display(fmt = "cas download (action: {})", .info)]
    CasDownload {
        /// The digest of the action that produced this output
        info: Arc<CasDownloadInfo>,
    },

    /// The file must be fetched over HTTP.
    #[display(fmt = "http download ({})", info)]
    HttpDownload { info: HttpDownloadInfo },

    #[cfg(test)]
    Test,
}

trait MaterializationMethodToProto {
    fn to_proto(&self) -> buck2_data::MaterializationMethod;
}

impl MaterializationMethodToProto for ArtifactMaterializationMethod {
    fn to_proto(&self) -> buck2_data::MaterializationMethod {
        match self {
            ArtifactMaterializationMethod::LocalCopy { .. } => {
                buck2_data::MaterializationMethod::LocalCopy
            }
            ArtifactMaterializationMethod::CasDownload { .. } => {
                buck2_data::MaterializationMethod::CasDownload
            }
            ArtifactMaterializationMethod::Write { .. } => buck2_data::MaterializationMethod::Write,
            ArtifactMaterializationMethod::HttpDownload { .. } => {
                buck2_data::MaterializationMethod::HttpDownload
            }
            #[cfg(test)]
            ArtifactMaterializationMethod::Test => unimplemented!(),
        }
    }
}

#[async_trait]
impl Materializer for DeferredMaterializer {
    fn name(&self) -> &str {
        "deferred"
    }

    async fn declare_existing(
        &self,
        artifacts: Vec<(ProjectRelativePathBuf, ArtifactValue)>,
    ) -> anyhow::Result<()> {
        let cmd = MaterializerCommand::DeclareExisting(
            artifacts,
            current_span(),
            get_dispatcher_opt().map(|d| d.trace_id().dupe()),
        );
        self.command_sender.send(cmd)?;
        Ok(())
    }

    async fn declare_copy_impl(
        &self,
        path: ProjectRelativePathBuf,
        value: ArtifactValue,
        srcs: Vec<CopiedArtifact>,
    ) -> anyhow::Result<()> {
        // TODO(rafaelc): get rid of this tree; it'd save a lot of memory.
        let mut srcs_tree = FileTree::new();
        for copied_artifact in srcs.iter() {
            let dest = copied_artifact.dest.strip_prefix(&path)?;

            {
                let mut walk = unordered_entry_walk(copied_artifact.dest_entry.as_ref());
                while let Some((path, entry)) = walk.next() {
                    if let DirectoryEntry::Leaf(ActionDirectoryMember::File(..)) = entry {
                        let path = path.get();
                        let dest_iter = dest.iter().chain(path.iter()).map(|f| f.to_owned());
                        let src = if path.as_str().is_empty() {
                            copied_artifact.src.clone()
                        } else {
                            copied_artifact.src.join(&path)
                        };
                        srcs_tree.insert(dest_iter, src);
                    }
                }
            }
        }
        let cmd = MaterializerCommand::Declare(
            path,
            value,
            box ArtifactMaterializationMethod::LocalCopy(srcs_tree, srcs),
        );
        self.command_sender.send(cmd)?;
        Ok(())
    }

    async fn declare_cas_many_impl<'a, 'b>(
        &self,
        info: Arc<CasDownloadInfo>,
        artifacts: Vec<(ProjectRelativePathBuf, ArtifactValue)>,
    ) -> anyhow::Result<()> {
        for (path, value) in artifacts {
            let cmd = MaterializerCommand::Declare(
                path,
                value,
                box ArtifactMaterializationMethod::CasDownload { info: info.dupe() },
            );
            self.command_sender.send(cmd)?;
        }
        Ok(())
    }

    async fn declare_http(
        &self,
        path: ProjectRelativePathBuf,
        info: HttpDownloadInfo,
    ) -> anyhow::Result<()> {
        let cmd = MaterializerCommand::Declare(
            path,
            ArtifactValue::file(info.metadata.dupe()),
            box ArtifactMaterializationMethod::HttpDownload { info },
        );
        self.command_sender.send(cmd)?;

        Ok(())
    }

    async fn declare_write<'a>(
        &self,
        gen: Box<dyn FnOnce() -> anyhow::Result<Vec<WriteRequest>> + Send + 'a>,
    ) -> anyhow::Result<Vec<ArtifactValue>> {
        if !self.defer_write_actions {
            return immediate::write_to_disk(&self.fs, self.io_executor.as_ref(), gen).await;
        }

        let contents = gen()?;

        let mut paths = Vec::with_capacity(contents.len());
        let mut values = Vec::with_capacity(contents.len());
        let mut methods = Vec::with_capacity(contents.len());

        for WriteRequest {
            path,
            content,
            is_executable,
        } in contents
        {
            let digest = FileDigest::from_bytes_sha1(&content);

            let meta = FileMetadata {
                digest: TrackedFileDigest::new(digest),
                is_executable,
            };

            // NOTE: The zstd crate doesn't release extra capacity of its encoding buffer so it's
            // important to do so here (or the compressed Vec is the same capacity as the input!).
            let compressed_data = zstd::bulk::compress(&content, 0)
                .with_context(|| format!("Error compressing {} bytes", content.len()))?
                .into_boxed_slice();

            paths.push(path);
            values.push(ArtifactValue::file(meta));
            methods.push(ArtifactMaterializationMethod::Write(Arc::new(WriteFile {
                compressed_data,
                decompressed_size: content.len(),
                is_executable,
            })));
        }

        for (path, (value, method)) in std::iter::zip(
            paths.into_iter(),
            std::iter::zip(values.iter(), methods.into_iter()),
        ) {
            self.command_sender.send(MaterializerCommand::Declare(
                path,
                value.dupe(),
                box method,
            ))?;
        }

        Ok(values)
    }

    async fn declare_match(
        &self,
        artifacts: Vec<(ProjectRelativePathBuf, ArtifactValue)>,
    ) -> anyhow::Result<DeclareMatchOutcome> {
        let (sender, recv) = oneshot::channel();

        self.command_sender
            .send(MaterializerCommand::MatchArtifacts(artifacts, sender))?;

        let is_match = recv
            .await
            .context("Recv'ing match future from command thread.")?;

        Ok(is_match.into())
    }

    async fn invalidate_many(&self, paths: Vec<ProjectRelativePathBuf>) -> anyhow::Result<()> {
        let (sender, recv) = oneshot::channel();

        self.command_sender
            .send(MaterializerCommand::InvalidateFilePaths(paths, sender))?;

        // Wait on future to finish before invalidation can continue.
        let invalidate_fut = recv.await?;
        invalidate_fut.await.unshared_error()
    }

    async fn materialize_many(
        &self,
        artifact_paths: Vec<ProjectRelativePathBuf>,
    ) -> anyhow::Result<BoxStream<'static, Result<(), MaterializationError>>> {
        let event_dispatcher = get_dispatcher();

        // TODO: display [materializing] in superconsole
        let (sender, recv) = oneshot::channel();
        self.command_sender
            .send(MaterializerCommand::Ensure(
                artifact_paths,
                event_dispatcher,
                sender,
            ))
            .context("Sending Ensure() command.")?;
        let materialization_fut = recv
            .await
            .context("Recv'ing materialization future from command thread.")?;
        Ok(materialization_fut)
    }

    async fn try_materialize_final_artifact(
        &self,
        artifact_path: ProjectRelativePathBuf,
    ) -> anyhow::Result<bool> {
        if self.materialize_final_artifacts {
            self.ensure_materialized(vec![artifact_path]).await?;
            Ok(true)
        } else {
            Ok(false)
        }
    }

    async fn get_materialized_file_paths(
        &self,
        paths: Vec<ProjectRelativePathBuf>,
    ) -> anyhow::Result<Vec<Result<ProjectRelativePathBuf, ArtifactNotMaterializedReason>>> {
        if paths.is_empty() {
            return Ok(Vec::new());
        }
        let (sender, recv) = oneshot::channel();
        self.command_sender
            .send(MaterializerCommand::GetMaterializedFilePaths(paths, sender))?;
        Ok(recv.await?)
    }

    fn as_deferred_materializer_extension(&self) -> Option<&dyn DeferredMaterializerExtensions> {
        Some(self as _)
    }

    fn log_materializer_state(&self, events: &EventDispatcher) {
        events.instant_event(self.materializer_state_info.clone())
    }
}

impl DeferredMaterializer {
    /// Spawns two threads (`materialization_loop` and `command_loop`).
    /// Creates and returns a new `DeferredMaterializer` that aborts those
    /// threads when dropped.
    pub fn new(
        fs: ProjectRoot,
        buck_out_path: ProjectRelativePathBuf,
        re_client_manager: Arc<ReConnectionManager>,
        io_executor: Arc<dyn BlockingExecutor>,
        configs: DeferredMaterializerConfigs,
        sqlite_db: Option<MaterializerStateSqliteDb>,
        sqlite_state: Option<MaterializerState>,
    ) -> anyhow::Result<Self> {
        let (command_sender, command_receiver) = mpsc::unbounded_channel();

        let counters = MaterializerCounters::leak_new();

        let command_sender = MaterializerSender {
            sender: Box::leak(box command_sender),
            counters,
        };

        let command_receiver = MaterializerReceiver {
            receiver: command_receiver,
            counters,
        };

        let command_processor = DeferredMaterializerCommandProcessor {
            io: Arc::new(DefaultIoHandler {
                fs: fs.dupe(),
                buck_out_path,
                re_client_manager,
                io_executor: io_executor.dupe(),
            }),
            sqlite_db,
            rt: Handle::current(),
            defer_write_actions: configs.defer_write_actions,
            log_buffer: LogBuffer::new(25),
        };

        let num_entries_from_sqlite = sqlite_state.as_ref().map_or(0, |s| s.len()) as u64;
        let materializer_state_info = buck2_data::MaterializerStateInfo {
            num_entries_from_sqlite,
        };

        let mut tree = ArtifactTree::new();
        if let Some(sqlite_state) = sqlite_state {
            for (path, (metadata, last_access_time)) in sqlite_state.into_iter() {
                tree.insert(
                    path.iter().map(|f| f.to_owned()),
                    box ArtifactMaterializationData {
                        deps: None,
                        stage: ArtifactMaterializationStage::Materialized {
                            metadata,
                            last_access_time,
                            active: false,
                        },
                        version: 0u64, // Any state restored from disk always gets set to version 0
                        processing_fut: None,
                    },
                );
            }
        }

        let command_thread = std::thread::Builder::new()
            .name("buck2-dm".to_owned())
            .spawn({
                move || {
                    let rt = tokio::runtime::Builder::new_current_thread()
                        .enable_all()
                        .build()
                        .unwrap();

                    rt.block_on(command_processor.run(
                        command_receiver,
                        command_sender,
                        tree,
                        configs.ttl_refresh,
                    ));
                }
            })
            .context("Cannot start materializer thread")?;

        Ok(Self {
            command_thread,
            command_sender,
            materialize_final_artifacts: configs.materialize_final_artifacts,
            defer_write_actions: configs.defer_write_actions,
            fs,
            io_executor,
            materializer_state_info,
        })
    }
}

/// Simple ring buffer for tracking recent commands, to be shown on materializer error
#[derive(Clone)]
struct LogBuffer {
    inner: VecDeque<String>,
}

impl LogBuffer {
    pub fn new(capacity: usize) -> Self {
        Self {
            inner: VecDeque::with_capacity(capacity),
        }
    }

    pub fn push(&mut self, item: String) {
        if self.inner.len() == self.inner.capacity() {
            self.inner.pop_front();
            self.inner.push_back(item);
        } else {
            self.inner.push_back(item);
        }
    }
}

impl std::fmt::Display for LogBuffer {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.inner.iter().join("\n"))
    }
}

impl<T: IoHandler> DeferredMaterializerCommandProcessor<T> {
    /// Loop that runs for as long as the materializer is alive.
    ///
    /// It takes commands via the `Materializer` trait methods.
    async fn run(
        mut self,
        commands: MaterializerReceiver<T>,
        command_sender: MaterializerSender<T>,
        mut tree: ArtifactTree,
        ttl_refresh: TtlRefreshConfiguration,
    ) {
        enum Op<T> {
            Command(MaterializerCommand<T>),
            RefreshTtls,
        }

        let MaterializerReceiver { receiver, counters } = commands;

        // Each Declare bumps the version, so that if an artifact is declared
        // a second time mid materialization of its previous version, we don't
        // incorrectly assume we materialized the latest version. We start with
        // 1 with because any disk state restored will start with version 0.
        let mut next_version = 1u64;

        let refresh_stream = if ttl_refresh.enabled {
            IntervalStream::new(tokio::time::interval_at(
                tokio::time::Instant::now() + ttl_refresh.frequency,
                ttl_refresh.frequency,
            ))
            .left_stream()
        } else {
            futures::stream::empty().right_stream()
        };

        let mut stream = futures::stream::select(
            UnboundedReceiverStream::new(receiver).map(Op::Command),
            refresh_stream.map(|_instant| Op::RefreshTtls),
        );

        let mut current_ttl_refresh: Option<JoinHandle<()>> = None;

        while let Some(op) = stream.next().await {
            match op {
                Op::Command(command) => {
                    self.log_buffer.push(format!("{:?}", command));
                    match command {
                        // Entry point for `get_materialized_file_paths` calls
                        MaterializerCommand::GetMaterializedFilePaths(paths, result_sender) => {
                            let result = paths.into_map(|p| tree.file_contents_path(p));
                            result_sender.send(result).ok();
                        }
                        MaterializerCommand::DeclareExisting(artifacts, ..) => {
                            for (path, artifact) in artifacts {
                                self.declare_existing(&mut tree, path, artifact, next_version);
                                next_version += 1;
                            }
                        }
                        // Entry point for `declare_{copy|cas}` calls
                        MaterializerCommand::Declare(path, value, method) => {
                            self.declare(
                                &mut tree,
                                path,
                                value,
                                method,
                                next_version,
                                &command_sender,
                            );
                            next_version += 1;
                        }
                        MaterializerCommand::MatchArtifacts(paths, sender) => {
                            let all_matches = paths
                                .into_iter()
                                .all(|(path, value)| self.match_artifact(&mut tree, path, value));
                            sender.send(all_matches).ok();
                        }
                        MaterializerCommand::InvalidateFilePaths(paths, sender) => {
                            tracing::trace!(
                                paths = ?paths,
                                "invalidate paths",
                            );

                            let existing_futs = tree.invalidate_paths_and_collect_futures(
                                paths,
                                self.sqlite_db.as_mut(),
                            );

                            // TODO: This proably shouldn't return a CleanFuture
                            sender
                                .send(
                                    async move {
                                        join_all_existing_futs(existing_futs).await.shared_error()
                                    }
                                    .boxed()
                                    .shared(),
                                )
                                .ok();
                        }
                        // Entry point for `ensure_materialized` calls
                        MaterializerCommand::Ensure(paths, event_dispatcher, fut_sender) => {
                            fut_sender
                                .send(self.materialize_many_artifacts(
                                    &mut tree,
                                    paths,
                                    event_dispatcher,
                                    &command_sender,
                                ))
                                .ok();
                        }
                        // Materialization of artifact succeeded
                        MaterializerCommand::MaterializationFinished {
                            path,
                            timestamp,
                            version,
                            result,
                        } => {
                            tree.materialization_finished(
                                path,
                                timestamp,
                                version,
                                result,
                                &self.io,
                                // materialization_finished transitions the entry to Declared stage on errors,
                                // in which case the version of the newly declared artifact should be bumped.
                                // Let materialization_finished always consume a version in case the entry
                                // gets redeclared.
                                next_version,
                                self.sqlite_db.as_mut(),
                                &self.rt,
                            );
                            next_version += 1;
                        }
                        MaterializerCommand::Extension(ext) => ext.execute(&mut tree, &mut self),
                    }

                    counters.ack_received();
                }
                Op::RefreshTtls => {
                    // It'd be neat to just implement this in the refresh_stream itself and simply
                    // have this loop implicitly drive it, but we can't do that as the stream's
                    // and_then callback would have to capture `&tree`. So, instead, we store the
                    // JoinHandle and just avoid scheduling more than one, though this means we'll
                    // just miss ticks if we do take longer than a tick to run.

                    let curr = match current_ttl_refresh.take() {
                        Some(mut curr) => match futures::poll!(&mut curr) {
                            std::task::Poll::Ready(..) => None,
                            std::task::Poll::Pending => Some(curr),
                        },
                        None => None,
                    };

                    current_ttl_refresh = match curr {
                        Some(task) => Some(task),
                        None => self
                            .io
                            .create_ttl_refresh(&tree, ttl_refresh.min_ttl)
                            .map(|fut| {
                                self.rt.spawn(async move {
                                    match fut.await {
                                        Ok(()) => {
                                            tracing::info!("Scheduled TTL refresh succeeded");
                                        }
                                        Err(e) => {
                                            tracing::warn!("Scheduled TTL refresh failed: {:#}", e);
                                        }
                                    }
                                })
                            }),
                    };
                }
            }
        }
    }

    fn materialize_many_artifacts(
        &mut self,
        tree: &mut ArtifactTree,
        paths: Vec<ProjectRelativePathBuf>,
        event_dispatcher: EventDispatcher,
        command_sender: &MaterializerSender<T>,
    ) -> BoxStream<'static, Result<(), MaterializationError>> {
        let tasks = paths.into_iter().filter_map(|path| {
            self.materialize_artifact(tree, path.as_ref(), event_dispatcher.dupe(), command_sender)
                .map(move |fut| {
                    fut.map_err(move |e| match e {
                        SharedMaterializingError::Error(source) => MaterializationError::Error {
                            path,
                            source: source.into(),
                        },
                        SharedMaterializingError::NotFound { info, debug } => {
                            MaterializationError::NotFound { path, info, debug }
                        }
                    })
                })
        });

        tasks.collect::<FuturesOrdered<_>>().boxed()
    }

    fn declare_existing<'a>(
        &mut self,
        tree: &'a mut ArtifactTree,
        path: ProjectRelativePathBuf,
        value: ArtifactValue,
        version: u64,
    ) {
        let metadata = ArtifactMetadata::from(value.entry().dupe());

        tree.insert(
            path.iter().map(|f| f.to_owned()),
            box ArtifactMaterializationData {
                deps: value.deps().duped(),
                stage: ArtifactMaterializationStage::Materialized {
                    metadata: metadata.dupe(),
                    last_access_time: Utc::now(),
                    active: true,
                },
                version,
                processing_fut: None,
            },
        );

        if let Some(sqlite_db) = self.sqlite_db.as_mut() {
            if let Err(e) = sqlite_db
                .materializer_state_table()
                .insert(path, metadata, Utc::now())
            {
                quiet_soft_error!(
                    "materializer_declare_existing_error",
                    e.context(self.log_buffer.clone())
                )
                .unwrap();
            }
        }
    }

    fn declare<'a>(
        &mut self,
        tree: &'a mut ArtifactTree,
        path: ProjectRelativePathBuf,
        value: ArtifactValue,
        method: Box<ArtifactMaterializationMethod>,
        version: u64,
        command_sender: &MaterializerSender<T>,
    ) {
        // Check if artifact to be declared is same as artifact that's already materialized.
        if let Some(data) = tree.prefix_get_mut(&mut path.iter()) {
            match &data.stage {
                ArtifactMaterializationStage::Materialized {
                    metadata,
                    last_access_time,
                    ..
                } => {
                    // For checking if artifact is already materialized, we just
                    // need to check that the entry matches. If the deps are different
                    // we can just update them but keep the artifact as materialized.
                    let new_metadata: ArtifactMetadata = value.entry().dupe().into();

                    // NOTE: This is for testing performance when hitting mismatches with disk
                    // state. Unwrapping isn't ideal, but we can't report errors here.
                    static FORCE_DECLARE_MISMATCH: EnvHelper<bool> =
                        EnvHelper::new("BUCK2_TEST_FORCE_DECLARE_MISMATCH");
                    let force_mismatch = FORCE_DECLARE_MISMATCH
                        .get()
                        .unwrap()
                        .copied()
                        .unwrap_or_default();

                    if metadata == &new_metadata && !force_mismatch {
                        // In this case, the entry declared matches the already materialized
                        // entry on disk, so just update the deps field but leave
                        // the artifact as materialized.
                        tracing::trace!(
                            path = %path,
                            "already materialized, updating deps only",
                        );
                        let deps = value.deps().duped();
                        data.stage = ArtifactMaterializationStage::Materialized {
                            metadata: metadata.dupe(),
                            last_access_time: *last_access_time,
                            active: true,
                        };
                        data.deps = deps;

                        return;
                    }
                }
                _ => {}
            }
        }

        // We don't have a matching artifact. Declare it.
        tracing::trace!(
            path = %path,
            method = %method,
            value = %value.entry(),
            version = version,
            "declare artifact",
        );

        // Always invalidate materializer state before actual deleting from filesystem
        // so there will never be a moment where artifact is deleted but materializer
        // thinks it still exists.
        let existing_futs =
            tree.invalidate_paths_and_collect_futures(vec![path.clone()], self.sqlite_db.as_mut());

        let method = Arc::from(method);

        // Dispatch Write actions eagerly if possible. We can do this if no cleanup is required. We
        // also check that there are no deps, though for writes there should never be deps.

        let can_use_write_fast_path = existing_futs.is_empty() && value.deps().is_none();

        let processing_fut = match &*method {
            ArtifactMaterializationMethod::Write(write) if can_use_write_fast_path => {
                let materialize =
                    self.io
                        .write(path.clone(), write.dupe(), version, *command_sender);
                ProcessingFuture::Materializing(materialize.shared())
            }
            _ => ProcessingFuture::Cleaning(clean_output_paths(
                &self.io,
                path.clone(),
                existing_futs,
                &self.rt,
            )),
        };

        let data = box ArtifactMaterializationData {
            deps: value.deps().duped(),
            stage: ArtifactMaterializationStage::Declared {
                entry: value.entry().dupe(),
                method,
            },
            version,
            processing_fut: Some(processing_fut),
        };
        tree.insert(path.iter().map(|f| f.to_owned()), data);
    }

    /// Check if artifact to be declared is same as artifact that's already materialized.
    #[instrument(level = "debug", skip(self, tree), fields(path = %path, value = %value.entry()))]
    fn match_artifact(
        &self,
        tree: &mut ArtifactTree,
        path: ProjectRelativePathBuf,
        value: ArtifactValue,
    ) -> bool {
        let mut path_iter = path.iter();
        let data = match tree.prefix_get_mut(&mut path_iter) {
            Some(data) => data,
            None => {
                tracing::trace!("overlapping below");
                return false;
            }
        };

        // Something was declared above our path.
        if path_iter.next().is_some() {
            tracing::trace!("overlapping above");
            return false;
        }

        let is_match = match &data.stage {
            ArtifactMaterializationStage::Materialized { metadata, .. } => {
                let new_metadata: ArtifactMetadata = value.entry().dupe().into();
                let is_match = *metadata == new_metadata;
                tracing::trace!("materialized: found {}, is_match: {}", metadata.0, is_match);
                is_match
            }
            ArtifactMaterializationStage::Declared { entry, .. } => {
                // NOTE: In theory, if something was declared here, we should probably be able to
                // just re-declare over it?
                let is_match = value.entry() == entry;
                tracing::trace!("declared: found {}, is_match: {}", entry, is_match);
                is_match
            }
        };

        // In practice, having a matching artifact with different deps isn't actually *possible*
        // right now, because the deps are derived from the artifact value and we'll always have
        // declared them before. But, if we have a local action cache and persist that as well as
        // materializer state across restarts, then eventually we could have a match with something
        // that hasn't had its deps populated yet (sicne the materializer state does not know about
        // deps).
        if is_match {
            if let Some(deps) = value.deps() {
                data.deps = Some(deps.dupe())
            }
        }

        is_match
    }

    #[instrument(level = "debug", skip(self, tree, command_sender), fields(path = %path))]
    fn materialize_artifact(
        &mut self,
        tree: &mut ArtifactTree,
        mut path: &ProjectRelativePath,
        event_dispatcher: EventDispatcher,
        command_sender: &MaterializerSender<T>,
    ) -> Option<MaterializingFuture> {
        // Get the data about the artifact, or return early if materializing/materialized
        let mut path_iter = path.iter();
        let data = match tree.prefix_get_mut(&mut path_iter) {
            // Never declared, nothing to do
            None => {
                tracing::debug!("not known");
                return None;
            }
            Some(data) => data,
        };

        // Rewind the `path` up to the entry we *actually* found.
        for _ in path_iter {
            path = path
                .parent()
                .expect("Path iterator cannot cause us to rewind past the last parent");
        }

        let cleaning_fut = match &data.processing_fut {
            Some(ProcessingFuture::Cleaning(f)) => Some(f.clone()),
            Some(ProcessingFuture::Materializing(f)) => {
                tracing::debug!("join existing future");
                return Some(f.clone());
            }
            None => None,
        };

        let deps = data.deps.dupe();
        let check_deps = deps.is_some();
        let entry_and_method = match &mut data.stage {
            ArtifactMaterializationStage::Declared { entry, method } => {
                Some((entry.dupe(), method.dupe()))
            }
            ArtifactMaterializationStage::Materialized {
                ref mut last_access_time,
                ..
            } => match check_deps {
                true => None,
                false => {
                    // TODO (torozco): Why is it legal for something to be Materialized + Cleaning?
                    tracing::debug!(path = %path, "nothing to materialize, updating access time");
                    let timestamp = Utc::now();
                    *last_access_time = timestamp;

                    // NOTE (T142264535): We mostly expect that artifacts are always declared
                    // before they are materialized, but there's one case where that doesn't
                    // happen. In particular, when incremental actions execute, they will trigger
                    // materialization of outputs from a previous run. The artifact isn't really
                    // "active" (it's not an output that we'll use), but we do warn here (when we
                    // probably shouldn't).
                    //
                    // if !active {
                    //     tracing::warn!(path = %path, "Expected artifact to be marked active by declare")
                    // }

                    if let Some(sqlite_db) = self.sqlite_db.as_mut() {
                        if let Err(e) = sqlite_db
                            .materializer_state_table()
                            .update_access_time(path.to_buf(), timestamp)
                        {
                            quiet_soft_error!(
                                "materializer_materialize_error",
                                e.context(self.log_buffer.clone())
                            )
                            .unwrap();
                        }
                    }

                    return None;
                }
            },
        };

        let version = data.version;

        tracing::debug!(
            has_entry_and_method = entry_and_method.is_some(),
            method = ?entry_and_method.as_ref().map(|(_, m)| m),
            has_deps = deps.is_some(),
            version = version,
            cleaning = cleaning_fut.is_some(),
            "materialize artifact"
        );

        // If the artifact copies from other artifacts, we must materialize them first
        let deps_tasks = match entry_and_method.as_ref() {
            Some((_, m)) => match m.as_ref() {
                ArtifactMaterializationMethod::CasDownload { .. }
                | ArtifactMaterializationMethod::HttpDownload { .. }
                | ArtifactMaterializationMethod::Write { .. } => Vec::new(),
                ArtifactMaterializationMethod::LocalCopy(_, copied_artifacts) => copied_artifacts
                    .iter()
                    .filter_map(|a| {
                        self.materialize_artifact(
                            tree,
                            a.src.as_ref(),
                            event_dispatcher.dupe(),
                            command_sender,
                        )
                    })
                    .collect::<Vec<_>>(),
                #[cfg(test)]
                ArtifactMaterializationMethod::Test => Vec::new(),
            },
            _ => Vec::new(),
        };

        // The artifact might have symlinks pointing to other artifacts. We must
        // materialize them as well, to avoid dangling synlinks.
        let link_deps_tasks = match deps.as_ref() {
            None => Vec::new(),
            Some(deps) => tree
                .find_artifacts(deps)
                .into_iter()
                .filter_map(|p| {
                    self.materialize_artifact(
                        tree,
                        p.as_ref(),
                        event_dispatcher.dupe(),
                        command_sender,
                    )
                })
                .collect::<Vec<_>>(),
        };

        // Create a task to await deps and materialize ourselves
        let path_buf = path.to_buf();
        let path_buf_dup = path_buf.clone();
        let io = self.io.dupe();
        let command_sender = *command_sender;
        let task = self
            .rt
            .spawn(async move {
                // Materialize the deps and this entry. This *must* happen in a try block because we
                // need to notity the materializer regardless of whether this succeeds or fails.

                let timestamp = Utc::now();
                let res: Result<(), SharedMaterializingError> = try {
                    // If there is an existing future trying to delete conflicting paths, we must wait for it
                    // to finish before we can start materialization.
                    if let Some(cleaning_fut) = cleaning_fut {
                        cleaning_fut
                        .await
                        .with_context(|| format!(
                            "Error waiting for a previous future to finish cleaning output path {}",
                            &path_buf
                        ))
                        .map_err(|e| SharedMaterializingError::Error(e.into()))?;
                    };

                    // In case this is a local copy, we first need to materialize the
                    // artifacts we are copying from, before we can copy them.
                    for t in deps_tasks {
                        t.await?;
                    }

                    if let Some((entry, method)) = entry_and_method {
                        let materialize = || {
                            io.materialize_entry(
                                path_buf.clone(),
                                method,
                                entry.dupe(),
                                event_dispatcher.dupe(),
                            )
                        };

                        // Windows symlinks need to be specified whether it is to a file or target. We rely on the
                        // target file existing to determine this. Ensure symlink targets exist before the entry
                        // is materialized for Windows. For non-Windows, do everything concurrently.
                        if cfg!(windows) {
                            for t in link_deps_tasks {
                                t.await?;
                            }
                            materialize().await?;
                        } else {
                            materialize().await?;
                            for t in link_deps_tasks {
                                t.await?;
                            }
                        }
                    } else {
                        for t in link_deps_tasks {
                            t.await?;
                        }
                    }
                };

                // Materialization finished, notify the command thread
                let _ignored = command_sender.send(MaterializerCommand::MaterializationFinished {
                    path: path_buf_dup,
                    timestamp,
                    version,
                    result: res.dupe(),
                });

                res
            })
            .map(|r| match r {
                Ok(r) => r,
                Err(e) => Err(SharedMaterializingError::Error(e.into())), // Turn the JoinError into a SharedError.
            })
            .boxed()
            .shared();

        let data = tree.prefix_get_mut(&mut path.iter()).unwrap();
        data.processing_fut = Some(ProcessingFuture::Materializing(task.clone()));

        Some(task)
    }
}

impl ArtifactTree {
    /// Given a path that's (possibly) not yet materialized, returns the path
    /// `contents_path` where its contents can be found. Returns Err if the
    /// contents cannot be found (ex. if it requires HTTP or CAS download)
    ///
    /// Note that the returned `contents_path` could be the same as `path`.
    #[instrument(level = "trace", skip(self), fields(path = %path))]
    fn file_contents_path(
        &self,
        path: ProjectRelativePathBuf,
    ) -> Result<ProjectRelativePathBuf, ArtifactNotMaterializedReason> {
        let mut path_iter = path.iter();
        let materialization_data = match self.prefix_get(&mut path_iter) {
            // Not in tree. Assume it's a source file that doesn't require materialization from materializer.
            None => return Ok(path),
            Some(data) => data,
        };
        let (entry, method) = match &materialization_data.stage {
            ArtifactMaterializationStage::Materialized { .. } => {
                return Ok(path);
            }
            ArtifactMaterializationStage::Declared { entry, method } => {
                (entry.dupe(), method.dupe())
            }
        };
        match method.as_ref() {
            ArtifactMaterializationMethod::CasDownload { info } => {
                let path_iter = path_iter.peekable();

                let root_entry = entry.dupe();
                let mut entry = Some(entry.as_ref().map_dir(|d| d as &dyn ActionDirectory));

                // Check if the path we are asking for exists in this entry.
                for name in path_iter {
                    entry = match entry {
                        Some(DirectoryEntry::Dir(d)) => d.get(name),
                        _ => break,
                    }
                }

                match entry {
                    Some(entry) => Err(ArtifactNotMaterializedReason::RequiresCasDownload {
                        path,
                        // TODO (@torozco): A nicer API to get an Immutable directory here.
                        entry: entry
                            .map_dir(|d| d.to_builder().fingerprint())
                            .map_leaf(|l| l.dupe()),
                        info: info.dupe(),
                    }),
                    None => Err(
                        ArtifactNotMaterializedReason::DeferredMaterializerCorruption {
                            path,
                            entry: root_entry,
                            info: info.dupe(),
                        },
                    ),
                }
            }
            ArtifactMaterializationMethod::HttpDownload { .. }
            | ArtifactMaterializationMethod::Write { .. } => {
                // TODO: Do the write directly to RE instead of materializing locally?
                Err(ArtifactNotMaterializedReason::RequiresMaterialization { path })
            }
            // TODO: also record and check materialized_files for LocalCopy
            ArtifactMaterializationMethod::LocalCopy(srcs, _) => {
                match srcs.prefix_get(&mut path_iter) {
                    None => Ok(path),
                    Some(src_path) => match path_iter.next() {
                        None => self.file_contents_path(src_path.clone()),
                        // This is not supposed to be reachable, and if it's, there
                        // is a bug somewhere else. Panic to prevent the bug from
                        // propagating.
                        Some(part) => panic!(
                            "While getting materialized path of {:?}: path {:?} is a file, so subpath {:?} doesn't exist within.",
                            path, src_path, part,
                        ),
                    },
                }
            }
            #[cfg(test)]
            ArtifactMaterializationMethod::Test => unimplemented!(),
        }
    }

    #[instrument(level = "debug", skip(self, result, io, sqlite_db), fields(path = %artifact_path, version = %version))]
    fn materialization_finished<T: IoHandler>(
        &mut self,
        artifact_path: ProjectRelativePathBuf,
        timestamp: DateTime<Utc>,
        version: u64,
        result: Result<(), SharedMaterializingError>,
        io: &Arc<T>,
        next_version: u64,
        sqlite_db: Option<&mut MaterializerStateSqliteDb>,
        rt: &Handle,
    ) {
        match self.prefix_get_mut(&mut artifact_path.iter()) {
            Some(mut info) => {
                if info.version > version {
                    tracing::debug!("version conflict");
                    return;
                }

                // We can only unset the future if version matches.
                // Otherwise, we may be unsetting a different future from a newer version.
                info.processing_fut = None;

                if result.is_err() {
                    tracing::debug!("materialization failed, redeclaring artifact");
                    // Bump the version here because the artifact is redeclared.
                    info.version = next_version;
                    // Even though materialization failed, something may have still materialized at artifact_path,
                    // so we need to delete anything at artifact_path before we ever retry materializing it.
                    // TODO(scottcao): Once command processor accepts an ArtifactTree instead of initializing one,
                    // add a test case to ensure this behavior.
                    info.processing_fut = Some(ProcessingFuture::Cleaning(clean_output_paths(
                        io,
                        artifact_path.clone(),
                        Vec::new(),
                        rt,
                    )));
                } else {
                    tracing::debug!(has_deps = info.deps.is_some(), "transition to Materialized");
                    let entry = match &info.stage {
                        ArtifactMaterializationStage::Materialized { .. } => {
                            tracing::debug!("artifact is somehow already marked materialized");
                            return;
                        }
                        ArtifactMaterializationStage::Declared {
                            entry,
                            method: _method,
                        } => entry.dupe(),
                    };
                    let metadata = ArtifactMetadata::from(entry);

                    // NOTE: We only insert this artifact if there isn't an in-progress cleanup
                    // future on this path.
                    if let Some(sqlite_db) = sqlite_db {
                        if let Err(e) = sqlite_db.materializer_state_table().insert(
                            artifact_path,
                            metadata.dupe(),
                            timestamp,
                        ) {
                            // TODO (torozco): Soft-erroring here is not appropriate. We should
                            // exit the process at this point. Let's check we don't unexpectedly hit
                            // this first.
                            quiet_soft_error!("materializer_finished_error", e).unwrap();
                        }
                    }

                    info.stage = ArtifactMaterializationStage::Materialized {
                        metadata,
                        last_access_time: timestamp,
                        active: true,
                    };
                }
            }
            None => {
                // NOTE: This can happen if a path got invalidted while it was being materialized.
                tracing::debug!("materialization_finished but path is vacant!")
            }
        }
    }

    /// Removes paths from tree and returns a pair of two vecs.
    /// First vec is a list of paths removed. Second vec is a list of
    /// pairs of removed paths to futures that haven't finished.
    fn invalidate_paths_and_collect_futures(
        &mut self,
        paths: Vec<ProjectRelativePathBuf>,
        sqlite_db: Option<&mut MaterializerStateSqliteDb>,
    ) -> Vec<(ProjectRelativePathBuf, ProcessingFuture)> {
        let mut invalidated_paths = Vec::new();
        let mut futs = Vec::new();

        for path in paths {
            for (path, data) in self.remove_path(&path) {
                if let Some(processing_fut) = data.processing_fut {
                    futs.push((path.clone(), processing_fut));
                }
                invalidated_paths.push(path);
            }
        }

        // We can invalidate the paths here even if materializations are currently running on
        // the underlying nodes, because when materialization finishes we'll check the version
        // number.
        if let Some(sqlite_db) = sqlite_db {
            if let Err(e) = sqlite_db
                .materializer_state_table()
                .delete(invalidated_paths)
            {
                quiet_soft_error!("materializer_invalidate_error", e).unwrap();
            }
        }

        futs
    }
}

impl<V: 'static> FileTree<V> {
    /// Finds all the paths in `deps` that are artifacts in `self`
    fn find_artifacts<D>(&self, deps: &D) -> Vec<ProjectRelativePathBuf>
    where
        D: ActionDirectory + ?Sized,
    {
        fn walk_deps<V, D>(
            tree: &FileTree<V>,
            entry: DirectoryEntry<&D, &ActionDirectoryMember>,
            path: &mut RelativePathBuf,
            found_artifacts: &mut Vec<ProjectRelativePathBuf>,
        ) where
            D: ActionDirectory + ?Sized,
        {
            match tree {
                FileTree::Data(_) => {
                    found_artifacts.push(ProjectRelativePathBuf::unchecked_new(path.to_string()));
                }
                FileTree::Tree(tree_children) => {
                    // Not an artifact, but if entry is a directory we can search deeper within
                    if let DirectoryEntry::Dir(d) = entry {
                        for (name, child) in d.entries() {
                            if let Some(subtree) = tree_children.get(name) {
                                path.push(name);
                                walk_deps(subtree, child, path, found_artifacts);
                                path.pop();
                            }
                        }
                    }
                }
            }
        }

        let mut artifacts = Vec::new();
        walk_deps(
            self,
            DirectoryEntry::Dir(deps),
            &mut RelativePathBuf::new(),
            &mut artifacts,
        );
        artifacts
    }

    /// Removes path from FileTree. Returns an iterator of pairs of path and entry removed
    /// from the tree.
    fn remove_path(
        &mut self,
        path: &ProjectRelativePath,
    ) -> Box<dyn Iterator<Item = (ProjectRelativePathBuf, V)>> {
        let mut path_iter = path.iter();
        let removed = self.remove(&mut path_iter);

        let mut path = path;
        // Rewind the `path` up to the entry we *actually* found.
        for _ in path_iter {
            path = path
                .parent()
                .expect("Path iterator cannot cause us to rewind past the last parent");
        }
        let path = path.to_owned();

        match removed {
            Some(tree) => box tree
                .into_iter_with_paths()
                .map(move |(k, v)| ((path).join(k), v)),
            None => box std::iter::empty(),
        }
    }
}

/// Wait on all futures in `futs` to finish. Return Error for first future that failed
/// in the Vec.
async fn join_all_existing_futs(
    existing_futs: Vec<(ProjectRelativePathBuf, ProcessingFuture)>,
) -> SharedResult<()> {
    // We can await inside a loop here because all ProcessingFuture's are spawned.
    for (path, fut) in existing_futs.into_iter() {
        match fut {
            ProcessingFuture::Materializing(f) => {
                // We don't care about errors from previous materializations.
                // We are trying to delete anything that has been materialized,
                // so these errors can be ignored.
                f.await.ok();
            }
            ProcessingFuture::Cleaning(f) => {
                f.await.with_context(|| {
                    format!(
                        "Error waiting for a previous future to finish cleaning output path {}",
                        path
                    )
                })?;
            }
        };
    }

    Ok(())
}

/// Spawns a future to clean output paths while waiting for any
/// pending future to finish.
fn clean_output_paths<T: IoHandler>(
    io: &Arc<T>,
    path: ProjectRelativePathBuf,
    existing_futs: Vec<(ProjectRelativePathBuf, ProcessingFuture)>,
    rt: &Handle,
) -> CleaningFuture {
    if existing_futs.is_empty() {
        return io.clean_output_paths(vec![path]).shared();
    }

    rt.spawn({
        let io = io.dupe();
        async move {
            join_all_existing_futs(existing_futs).await?;
            io.clean_output_paths(vec![path]).await
        }
    })
    .map(|r| match r {
        Ok(r) => r,
        Err(e) => Err(e.into()), // Turn the JoinError into a SharedError.
    })
    .boxed()
    .shared()
}

#[derive(Debug)]
pub struct WriteFile {
    compressed_data: Box<[u8]>,
    decompressed_size: usize,
    is_executable: bool,
}