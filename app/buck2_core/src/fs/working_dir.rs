/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under both the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree and the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree.
 */

use std::env;
use std::path::Path;
use std::path::PathBuf;

use crate::fs::fs_util;
use crate::fs::paths::abs_norm_path::AbsNormPath;
use crate::fs::paths::abs_norm_path::AbsNormPathBuf;
use crate::fs::paths::abs_path::AbsPathBuf;

/// Client working directory.
///
/// Can be different from process working directory if process changes the directory.
/// So relative paths should be resolved against this.
#[derive(Clone, Debug, derive_more::Display)]
#[display(fmt = "{}", path)]
pub struct WorkingDir {
    path: AbsNormPathBuf,
}

impl WorkingDir {
    pub fn unchecked_new(path: AbsNormPathBuf) -> WorkingDir {
        WorkingDir { path }
    }

    pub fn current_dir() -> anyhow::Result<WorkingDir> {
        let current_dir = env::current_dir()?;

        #[derive(Debug, thiserror::Error)]
        enum CurrentDirError {
            #[error("std::env::current_dir returns non-canonical path: `{0}` -> `{1}`")]
            NotCanonical(PathBuf, PathBuf),
        }

        // `current_dir` seems to return canonical path.
        let current_dir_canonical = fs_util::canonicalize(&current_dir)?;
        if current_dir != current_dir_canonical.as_path() {
            let error: anyhow::Error = CurrentDirError::NotCanonical(
                current_dir.clone(),
                current_dir_canonical.into_path_buf(),
            )
            .into();

            if cfg!(windows) {
                soft_error!("current_dir_not_canonical_on_windows", error)?;
            } else {
                return Err(error);
            }
        }

        Ok(WorkingDir::unchecked_new(AbsNormPathBuf::new(current_dir)?))
    }

    pub fn resolve(&self, path: &Path) -> AbsPathBuf {
        self.path.as_abs_path().join(path)
    }

    pub fn path(&self) -> &AbsNormPath {
        &self.path
    }

    pub fn into_abs_norm_path_buf(self) -> AbsNormPathBuf {
        self.path
    }
}
