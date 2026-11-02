#!/usr/bin/env bash
#
# Builds the distributable package: dist/askpias-<version>.zip
#
#   bash package.sh              # version from backend/.env.example (APP_VERSION)
#   VERSION=1.2.0 bash package.sh
#
# Only tracked files are included (via git archive), so .env, vendor, node_modules,
# .output, uploads and logs never end up in the package. Commit your changes first.
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

VERSION="${VERSION:-$(sed -n 's/^APP_VERSION=//p' backend/.env.example 2>/dev/null | head -n1 | tr -d '"')}"
VERSION="${VERSION:-1.0.0}"

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  printf 'Warning: uncommitted changes are NOT included in the package.\n' >&2
fi

mkdir -p dist
OUT="dist/askpias-$VERSION.zip"

git archive --format=zip --prefix="askpias-$VERSION/" -o "$OUT" HEAD

printf 'Built %s (%s)\n' "$OUT" "$(du -h "$OUT" | cut -f1)"
printf 'It extracts to askpias-%s/ with the site at the root and the admin/API in backend/.\n' "$VERSION"
