#!/usr/bin/env bash
#
# AskPias updater — pulls the newest code from GitHub and rebuilds both apps.
#
#   bash update.sh                 # pull, rebuild backend + frontend, restart
#   FORCE=1 bash update.sh         # discard local changes (git reset --hard origin/<branch>)
#   SKIP_FRONTEND=1 bash update.sh # backend only
#   SKIP_BACKEND=1 bash update.sh  # frontend only
#
# Used by: SSH, the admin Updates page and .github/workflows/deploy.yml.
# Exits non-zero on failure, so the caller can show the real reason.
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$APP_DIR/backend/.env"

BRANCH="${BRANCH:-}"
if [ -z "$BRANCH" ] && [ -f "$ENV_FILE" ]; then
  BRANCH="$(grep -m1 '^APP_BRANCH=' "$ENV_FILE" | cut -d= -f2- | tr -d '"' || true)"
fi
BRANCH="${BRANCH:-main}"
FORCE="${FORCE:-0}"
SKIP_FRONTEND="${SKIP_FRONTEND:-0}"
SKIP_BACKEND="${SKIP_BACKEND:-0}"
WEB_USER="${WEB_USER:-www}"

if [ -t 1 ]; then
  C_BLUE=$'\033[1;34m'; C_GREEN=$'\033[1;32m'; C_RED=$'\033[1;31m'; C_OFF=$'\033[0m'
else
  C_BLUE=""; C_GREEN=""; C_RED=""; C_OFF=""
fi

step() { printf '\n%s==> %s%s\n' "$C_BLUE" "$1" "$C_OFF"; }
ok()   { printf '%s  ok%s %s\n' "$C_GREEN" "$C_OFF" "$1"; }
die()  { printf '\n%sERROR:%s %s\n' "$C_RED" "$C_OFF" "$1" >&2; exit 1; }
trap 'die "command failed at line ${LINENO}"' ERR

php83() {
  [ -n "${1:-}" ] && [ -x "$1" ] \
    && "$1" -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' 2>/dev/null
}

PHP_BIN="${PHP_BIN:-}"
if [ -z "$PHP_BIN" ]; then
  for candidate in "$(command -v php || true)" /www/server/php/83/bin/php /usr/local/lsws/lsphp83/bin/php /usr/bin/php8.3 /usr/bin/php; do
    if php83 "$candidate"; then PHP_BIN="$candidate"; break; fi
  done
fi
[ -n "${PHP_BIN:-}" ] && [ -x "$PHP_BIN" ] \
  || die "PHP 8.3+ not found. Set PHP_BIN=/path/to/php83."

COMPOSER_BIN="${COMPOSER_BIN:-}"
if [ -z "$COMPOSER_BIN" ]; then
  for candidate in "$(command -v composer || true)" /usr/local/bin/composer /usr/bin/composer; do
    if [ -n "$candidate" ] && [ -f "$candidate" ]; then COMPOSER_BIN="$candidate"; break; fi
  done
fi

[ -d "$APP_DIR/.git" ] || die "No git checkout at $APP_DIR — updates need a clone, not a zip."

# -------------------------------------------------------------------- code ---
step "Pulling $BRANCH"
cd "$APP_DIR"
command -v git >/dev/null 2>&1 || die "git is not available to this user."
git fetch --prune origin "$BRANCH"

if [ "$FORCE" = "1" ]; then
  git reset --hard "origin/$BRANCH"
else
  if ! git pull --ff-only origin "$BRANCH"; then
    die "The pull was blocked (local changes or diverged history). Commit them, or rerun with FORCE=1."
  fi
fi
ok "$(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

# ----------------------------------------------------------------- backend ---
if [ "$SKIP_BACKEND" != "1" ]; then
  step "Backend"
  cd "$APP_DIR/backend"

  [ -n "$COMPOSER_BIN" ] || die "Composer not found. Set COMPOSER_BIN=/path/to/composer."
  "$PHP_BIN" "$COMPOSER_BIN" install --no-dev --optimize-autoloader --no-interaction

  "$PHP_BIN" artisan migrate --force
  "$PHP_BIN" artisan storage:link >/dev/null 2>&1 || true
  "$PHP_BIN" artisan optimize:clear >/dev/null
  "$PHP_BIN" artisan optimize
  ok "Backend updated"
fi

# ---------------------------------------------------------------- frontend ---
if [ "$SKIP_FRONTEND" != "1" ]; then
  step "Frontend"
  cd "$APP_DIR"

  if command -v bun >/dev/null 2>&1; then
    bun install --frozen-lockfile || bun install
    bun run build
  elif [ -f package-lock.json ]; then
    npm ci && npm run build
  else
    npm install && npm run build
  fi
  ok "Site built"

  if command -v pm2 >/dev/null 2>&1 && pm2 describe askpias-web >/dev/null 2>&1; then
    PORT=3000 pm2 restart askpias-web --update-env >/dev/null
    ok "PM2 process restarted"
  elif systemctl list-unit-files 2>/dev/null | grep -q '^askpias-web.service'; then
    systemctl restart askpias-web
    ok "askpias-web service restarted"
  else
    printf '%s  !%s Restart the Node process yourself: pm2 restart askpias-web (or systemctl restart askpias-web)\n' "$C_RED" "$C_OFF"
  fi
fi

# --------------------------------------------------------------- ownership ---
if [ "$(id -u)" -eq 0 ] && id -u "$WEB_USER" >/dev/null 2>&1; then
  chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR/backend/storage" "$APP_DIR/backend/bootstrap/cache" 2>/dev/null || true
  [ -d "$APP_DIR/.output" ] && chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR/.output" 2>/dev/null || true
fi

step "Done"
printf 'Updated to %s on %s\n' "$(git -C "$APP_DIR" rev-parse --short HEAD)" "$(date '+%d %b %Y %H:%M')"
