/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under both the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree and the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree.
 */

use allocative::Allocative;
use buck2_util::arc_str::ArcS;
use derive_more::Display;
use dupe::Dupe;

use crate::cells::cell_path::CellPath;
use crate::package::package_relative_path::PackageRelativePath;
use crate::package::PackageLabel;

/// Represents a resolvable path corresponding to some path that is part of a
/// 'Package'. The 'BuckPath' refers to only paths in the repo source, not
/// outputs of a 'Package'.
#[derive(
    Clone,
    Debug,
    derive_more::Display,
    Hash,
    Eq,
    PartialEq,
    Ord,
    PartialOrd,
    Allocative
)]
#[display(fmt = "{}", "self.as_ref()")]
pub struct BuckPath {
    pkg: PackageLabel,
    path: ArcS<PackageRelativePath>,
}

impl BuckPath {
    #[inline]
    pub fn new(pkg: PackageLabel, path: ArcS<PackageRelativePath>) -> Self {
        BuckPath { pkg, path }
    }

    /// This is slow, but OK to use in tests.
    pub fn testing_new(pkg: PackageLabel, path: impl AsRef<PackageRelativePath>) -> Self {
        BuckPath::new(pkg, ArcS::from(path.as_ref()))
    }

    #[inline]
    pub fn package(&self) -> PackageLabel {
        self.pkg.dupe()
    }

    #[inline]
    pub fn path(&self) -> &PackageRelativePath {
        &self.path
    }

    #[inline]
    pub fn to_cell_path(&self) -> CellPath {
        self.as_ref().to_cell_path()
    }

    #[inline]
    pub fn as_ref(&self) -> BuckPathRef {
        BuckPathRef {
            pkg: self.pkg.dupe(),
            path: &self.path,
        }
    }
}

#[derive(Display, Debug, Eq, Hash, PartialEq, Clone, Dupe)]
#[display(fmt = "{}/{}", pkg, "path.as_str()")]
pub struct BuckPathRef<'a> {
    pkg: PackageLabel,
    path: &'a ArcS<PackageRelativePath>,
}

impl<'a> BuckPathRef<'a> {
    #[inline]
    pub fn new(pkg: PackageLabel, path: &'a ArcS<PackageRelativePath>) -> BuckPathRef<'a> {
        BuckPathRef { pkg, path }
    }

    #[inline]
    pub fn package(&self) -> PackageLabel {
        self.pkg.dupe()
    }

    #[inline]
    pub fn path(&self) -> &PackageRelativePath {
        self.path
    }

    #[inline]
    pub fn to_cell_path(&self) -> CellPath {
        self.pkg
            .as_cell_path()
            .join(self.path.as_forward_rel_path())
    }

    #[inline]
    pub fn to_buck_path(&self) -> BuckPath {
        BuckPath {
            pkg: self.pkg.dupe(),
            path: self.path.dupe(),
        }
    }
}
