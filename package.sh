#!/usr/bin/env bash
#
# Builds the distributable package: dist/askpias-<version>.zip (or .tar.gz without zip).
#
#   bash package.sh              # builds the site first, so the package is install-ready
#   bash package.sh --no-site    # code only (the installer will build on the server)
#   VERSION=1.2.0 bash package.sh
#
# Only tracked files go in — .env, vendor, node_modules, uploads and logs are excluded.
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

VERSION="${VERSION:-$(sed -n 's/^APP_VERSION=//p' backend/.env.example 2>/dev/null | head -n1 | tr -d '"')}"
VERSION="${VERSION:-1.0.0}"

WITH_SITE=1
for arg in "$@"; do
  case "$arg" in
    --no-site) WITH_SITE=0 ;;
  esac
done

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  printf 'Note: uncommitted changes are not included (package is built from HEAD).\n' >&2
fi

STAGE_PARENT="$(mktemp -d)"
STAGE="$STAGE_PARENT/askpias-$VERSION"
mkdir -p "$STAGE"

git archive HEAD | tar -x -C "$STAGE"
printf '   code   → askpias-%s/\n' "$VERSION"

if [ "$WITH_SITE" -eq 1 ]; then
  if command -v bun >/dev/null 2>&1; then
    [ -d node_modules ] || bun install --frozen-lockfile
    bun run build
  elif command -v npm >/dev/null 2>&1; then
    [ -d node_modules ] || npm install
    npm run build
  else
    printf 'No bun/npm found — shipping without the prebuilt site.\n' >&2
    WITH_SITE=0
  fi

  if [ "$WITH_SITE" -eq 1 ] && [ -d "$ROOT/.output" ]; then
    cp -a "$ROOT/.output" "$STAGE/.output"
    printf '   site   → askpias-%s/.output (prebuilt)\n' "$VERSION"
  fi
fi

mkdir -p "$ROOT/dist"

if command -v zip >/dev/null 2>&1; then
  ( cd "$STAGE_PARENT" && zip -qr "$ROOT/dist/askpias-$VERSION.zip" "askpias-$VERSION" )
  OUT="dist/askpias-$VERSION.zip"
elif command -v powershell.exe >/dev/null 2>&1 && command -v cygpath >/dev/null 2>&1; then
  # Windows (Git Bash): build a real .zip with PowerShell
  ZIP_WIN="$(cygpath -w "$ROOT/dist/askpias-$VERSION.zip")"
  powershell.exe -NoProfile -NonInteractive -Command \
    "Compress-Archive -Path '$(cygpath -w "$STAGE")' -DestinationPath '$ZIP_WIN' -Force" >/dev/null
  OUT="dist/askpias-$VERSION.zip"
else
  ( cd "$STAGE_PARENT" && tar -czf "$ROOT/dist/askpias-$VERSION.tar.gz" "askpias-$VERSION" )
  OUT="dist/askpias-$VERSION.tar.gz"
fi

rm -f "$ROOT/dist/askpias-$VERSION.tar.gz" "$ROOT/dist/askpias-$VERSION.zip.old" 2>/dev/null || true

rm -rf "$STAGE_PARENT"

printf 'Built %s (%s)\n' "$OUT" "$(du -h "$OUT" | cut -f1)"
printf 'Install: extract on the server, then open https://<api-domain>/install.php\n'
