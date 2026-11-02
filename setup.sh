#!/usr/bin/env bash
#
# One-command setup for aaPanel / cPanel / any Ubuntu box.
#
#   cd /www/wwwroot/askpias && bash setup.sh
#
# It detects the PHP 8.3 binary and the web-server user, fixes ownership, installs
# Node 20+ and PM2 when missing, then runs install.sh --auto (database, admin,
# migrations, demo content, frontend build, service start). One prompt: the MySQL
# root password.
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

C_BLUE=$'\033[1;34m'; C_GREEN=$'\033[1;32m'; C_RED=$'\033[1;31m'; C_OFF=$'\033[0m'
step() { printf '\n%s==> %s%s\n' "$C_BLUE" "$1" "$C_OFF"; }
ok()   { printf '%s  ok%s %s\n' "$C_GREEN" "$C_OFF" "$1"; }
warn() { printf '%s  !%s %s\n' "$C_RED" "$C_OFF" "$1"; }
die()  { printf '\n%sERROR:%s %s\n' "$C_RED" "$C_OFF" "$1" >&2; exit 1; }
trap 'die "command failed at line ${LINENO}"' ERR

[ "$(id -u)" -eq 0 ] || die "Run this as root: sudo bash setup.sh"

# ---------------------------------------------------------------- php 8.3 ---
step "PHP 8.3"
PHP_BIN=""
for candidate in /www/server/php/83/bin/php /usr/local/lsws/lsphp83/bin/php /usr/bin/php8.3; do
  if [ -x "$candidate" ] && "$candidate" -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' 2>/dev/null; then
    PHP_BIN="$candidate"; break
  fi
done
if [ -z "$PHP_BIN" ]; then
  candidate="$(command -v php || true)"
  if [ -n "$candidate" ] && "$candidate" -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' 2>/dev/null; then
    PHP_BIN="$candidate"
  fi
fi
[ -n "$PHP_BIN" ] || die "PHP 8.3 not found. Install it from aaPanel → App Store → PHP 8.3."
ok "$("$PHP_BIN" -r 'echo PHP_VERSION;') at $PHP_BIN"

# ------------------------------------------------------------ web user ------
step "Web server user"
WEB_USER="${WEB_USER:-$(ps -eo user=,comm= | awk '$2 ~ /^(lsphp|litespeed|php-fpm|php)/ {print $1; exit}')}"
WEB_USER="${WEB_USER:-www}"
if ! id -u "$WEB_USER" >/dev/null 2>&1; then
  WEB_USER=www
fi
if ! id -u "$WEB_USER" >/dev/null 2>&1; then
  WEB_USER=nobody
fi
ok "files will be owned by $WEB_USER"

# ------------------------------------------------------------------ node ----
step "Node.js 20+ and PM2"
NODE_OK=0
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -v | tr -d 'v' | cut -d. -f1)"
  [ "${NODE_MAJOR:-0}" -ge 20 ] && NODE_OK=1
fi
if [ "$NODE_OK" -eq 0 ]; then
  warn "Installing Node.js 22 (needed to build the site)…"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs >/dev/null
fi
command -v node >/dev/null 2>&1 || die "Node.js install failed."
ok "node $(node -v)"

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2 >/dev/null 2>&1 || warn "Could not install PM2 globally."
fi
ok "pm2 $(command -v pm2 >/dev/null 2>&1 && pm2 -v || echo 'not available')"

# --------------------------------------------------------------- composer ---
step "Composer"
COMPOSER_BIN="${COMPOSER_BIN:-$(command -v composer || true)}"
composer_ok=0
if [ -n "$COMPOSER_BIN" ] && [ -f "$COMPOSER_BIN" ]; then
  COMPOSER_VERSION="$("$PHP_BIN" "$COMPOSER_BIN" --version --no-ansi 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1 || true)"
  case "$COMPOSER_VERSION" in
    2.[2-9]*|2.[1-9][0-9]*|[3-9].*) composer_ok=1 ;;
  esac
fi
if [ "$composer_ok" -eq 0 ]; then
  warn "Installing Composer 2 (the distro package is too old for this lock file)…"
  curl -sS https://getcomposer.org/installer | "$PHP_BIN" -- --install-dir=/usr/local/bin --filename=composer >/dev/null
  COMPOSER_BIN=/usr/local/bin/composer
fi
[ -n "$COMPOSER_BIN" ] && [ -f "$COMPOSER_BIN" ] || die "Composer install failed."
export COMPOSER_BIN
ok "composer $("$PHP_BIN" "$COMPOSER_BIN" --version --no-ansi 2>/dev/null | head -n1)"

# ---------------------------------------------------------------- database --
step "MySQL"
if [ -z "${MYSQL_ROOT_PASS:-}" ] && [ -t 0 ]; then
  printf '  MySQL root password (aaPanel → Database; blank to skip DB creation): '
  read -r -s MYSQL_ROOT_PASS || true
  printf '\n'
fi
export MYSQL_ROOT_PASS="${MYSQL_ROOT_PASS:-}"
if [ -z "$MYSQL_ROOT_PASS" ]; then
  warn "No root password given — the database and user will NOT be created."
  warn "If the database does not exist yet, rerun with: MYSQL_ROOT_PASS='…' bash setup.sh"
fi

# ------------------------------------------------------------------ install --
step "Installing AskPias"
chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR" 2>/dev/null || true

APP_DIR="$APP_DIR" \
WEB_USER="$WEB_USER" \
PHP_BIN="$PHP_BIN" \
COMPOSER_BIN="$COMPOSER_BIN" \
MYSQL_ROOT_PASS="$MYSQL_ROOT_PASS" \
  bash "$APP_DIR/install.sh" --auto

# --------------------------------------------------------------- ownership ---
# Things installed as root above must be writable by the web user afterwards,
# otherwise Admin → Updates cannot pull, run composer or rebuild.
chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR" 2>/dev/null || true

if command -v runuser >/dev/null 2>&1; then
  runuser -u "$WEB_USER" -- git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true
fi
ok "ownership and git config set for $WEB_USER"

# ------------------------------------------------------------------- pm2 -----
cd "$APP_DIR"
if command -v pm2 >/dev/null 2>&1 && [ -d "$APP_DIR/.output" ]; then
  if pm2 describe askpias-web >/dev/null 2>&1; then
    PORT=3000 pm2 restart askpias-web --update-env >/dev/null
  else
    PORT=3000 pm2 start .output/server/index.mjs --name askpias-web --update-env >/dev/null
  fi
  pm2 save >/dev/null 2>&1 || true
  ok "site running on 127.0.0.1:3000"
fi

# ------------------------------------------------------------------ done ----
step "Done"
cat <<EOF

  Admin panel   https://api.askpias.com/admin
  Website       https://askpias.com   (proxy to 127.0.0.1:3000)

  If the site does not load yet, the only panel step left:
    aaPanel → Website → askpias.com → Settings → Reverse proxy → 127.0.0.1:3000

  Update later:  cd $APP_DIR && bash update.sh

EOF
