#!/usr/bin/env bash
#
# AskPias installer — installs the Laravel admin/API (Filament) and the TanStack site
# on one Linux server. Fully self-hosted: the only external touch points are GitHub
# (source) and the Composer/Bun package registries.
#
# Interactive:      sudo bash install.sh
# Zero questions:   sudo bash install.sh --auto   (defaults + exported env vars)
# Non-interactive:  APP_DIR=/www/wwwroot/site SITE_URL=https://site.com \
#                   API_URL=https://api.site.com DB_NAME=db DB_USER=user \
#                   ADMIN_EMAIL=you@site.com ADMIN_PASS=secret bash install.sh
#
# Safe to re-run: .env, database, uploads and the admin account are preserved.
set -Eeuo pipefail

APP_VERSION="1.0.0"
REPO_URL_DEFAULT="https://github.com/zubayerkareem/askpias.git"

# --auto: no questions, everything from defaults (or the env vars you exported).
# --frontend-only: rebuild + restart just the website (used after the browser installer).
AUTO=0
FRONTEND_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --auto|--yes|-y) AUTO=1 ;;
    --frontend-only) FRONTEND_ONLY=1 ;;
  esac
done

if [ -t 1 ]; then
  C_BLUE=$'\033[1;34m'; C_GREEN=$'\033[1;32m'; C_RED=$'\033[1;31m'; C_OFF=$'\033[0m'
else
  C_BLUE=""; C_GREEN=""; C_RED=""; C_OFF=""
fi

step() { printf '\n%s==> %s%s\n' "$C_BLUE" "$1" "$C_OFF"; }
ok()   { printf '%s  ok%s %s\n' "$C_GREEN" "$C_OFF" "$1"; }
warn() { printf '%s  !%s %s\n' "$C_RED" "$C_OFF" "$1"; }
die()  { printf '\n%sERROR:%s %s\n' "$C_RED" "$C_OFF" "$1" >&2; exit 1; }
trap 'die "command failed at line ${LINENO}"' ERR

ask() {
  local var="$1" question="$2" default="${3:-}" answer=""
  if [ -n "${!var:-}" ]; then return 0; fi
  if [ "$AUTO" -eq 1 ]; then printf -v "$var" '%s' "$default"; return 0; fi
  if [ -t 0 ]; then
    if [ -n "$default" ]; then
      read -r -p "$question [$default]: " answer || true
    else
      read -r -p "$question: " answer || true
    fi
  fi
  printf -v "$var" '%s' "${answer:-$default}"
}

random_password() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -base64 24 | tr -d '/+=' | cut -c1-16
  else
    tr -dc 'A-Za-z0-9' </dev/urandom | head -c 16
  fi
}

# ------------------------------------------------------------ frontend only ---
if [ "$FRONTEND_ONLY" -eq 1 ]; then
  APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  step "Frontend only — $APP_DIR"

  ask SITE_URL "Public site URL" "https://askpias.com"
  ask API_URL "Admin/API URL" "https://api.askpias.com"

  cd "$APP_DIR"
  printf 'VITE_API_URL=%s/api\nVITE_ADMIN_URL=%s/admin\nVITE_GTM_ID=\n' "$API_URL" "$API_URL" > .env

  if command -v bun >/dev/null 2>&1; then
    bun install --frozen-lockfile || bun install
    bun run build
  elif [ -f package-lock.json ]; then
    npm ci && npm run build
  else
    npm install && npm run build
  fi
  ok "Site built into $APP_DIR/.output"

  if [ "$(id -u)" -eq 0 ] && id -u www >/dev/null 2>&1; then
    chown -R www:www "$APP_DIR/.output" 2>/dev/null || true
  fi

  if command -v pm2 >/dev/null 2>&1; then
    if pm2 describe askpias-web >/dev/null 2>&1; then
      PORT=3000 pm2 restart askpias-web --update-env
    else
      PORT=3000 pm2 start .output/server/index.mjs --name askpias-web --update-env
    fi
    pm2 save >/dev/null
    ok "PM2 process 'askpias-web' running on 127.0.0.1:3000"
  else
    warn "pm2 not found — start it with: cd $APP_DIR && PORT=3000 node .output/server/index.mjs"
  fi

  step "Done"
  echo "  Remember: reverse-proxy $SITE_URL to http://127.0.0.1:3000 (snippet in INSTALL.md)."
  exit 0
fi

# ---------------------------------------------------------------- preflight ---
step "Checking the server"

[ "$(id -u)" -eq 0 ] || warn "Not running as root — ownership and service steps will be skipped."

php83() {
  [ -n "${1:-}" ] && [ -x "$1" ] \
    && "$1" -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' 2>/dev/null
}

PHP_BIN="${PHP_BIN:-}"
if [ -z "$PHP_BIN" ]; then
  # Prefer whichever binary is really 8.3+ — distro PHP can be 7.4 even when aaPanel has 8.3.
  for candidate in "$(command -v php || true)" /www/server/php/83/bin/php /usr/local/lsws/lsphp83/bin/php /usr/bin/php8.3 /usr/bin/php; do
    if php83 "$candidate"; then PHP_BIN="$candidate"; break; fi
  done
fi
[ -n "${PHP_BIN:-}" ] && [ -x "$PHP_BIN" ] \
  || die "PHP 8.3+ not found. Set PHP_BIN=/path/to/php83 (aaPanel: /www/server/php/83/bin/php)."
"$PHP_BIN" -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' \
  || die "PHP 8.3+ is required, found $("$PHP_BIN" -r 'echo PHP_VERSION;')."
ok "PHP $("$PHP_BIN" -r 'echo PHP_VERSION;') at $PHP_BIN"

missing=""
for ext in pdo_mysql mbstring openssl fileinfo curl tokenizer xml ctype zip json gd; do
  "$PHP_BIN" -r "exit(extension_loaded('$ext') ? 0 : 1);" || missing="$missing $ext"
done

if [ -n "$missing" ]; then
  warn "Missing PHP extensions:$missing"
  printf '  Binary:  %s\n' "$PHP_BIN"
  printf '  Loaded:  %s\n' "$("$PHP_BIN" --ini | awk -F': ' '/Loaded Configuration/ {print $2}')"
  printf '  Panels often enable extensions for FPM only — the CLI reads its own ini.\n'
  printf '  Fix: enable them in aaPanel (PHP 8.3 -> Extensions) and restart PHP,\n'
  printf '  or add "extension=<name>.so" to the ini above, then rerun install.sh.\n'
  die "Enable the extensions listed above and rerun install.sh."
fi
ok "PHP extensions present"

COMPOSER_BIN="${COMPOSER_BIN:-}"
if [ -z "$COMPOSER_BIN" ]; then
  for candidate in "$(command -v composer || true)" /usr/local/bin/composer /usr/bin/composer; do
    if [ -n "$candidate" ] && [ -f "$candidate" ]; then COMPOSER_BIN="$candidate"; break; fi
  done
fi
[ -n "$COMPOSER_BIN" ] || die "Composer not found. Install it or set COMPOSER_BIN=/path/to/composer.phar."
ok "Composer at $COMPOSER_BIN"

command -v git >/dev/null 2>&1 || die "git is required."
ok "git available"

# -------------------------------------------------------------- questions ----
step "Installation settings"

ask APP_DIR "Install directory" "/www/wwwroot/askpias.com"
ask REPO_URL "Git repository" "$REPO_URL_DEFAULT"
ask SITE_URL "Public site URL" "https://askpias.com"
ask API_URL "Admin/API URL" "https://api.askpias.com"
ask BRANCH "Git branch" "main"
ask DB_HOST "Database host" "127.0.0.1"
ask DB_NAME "Database name" "askpias"
ask DB_USER "Database user" "askpias"
ask DB_PASS "Database password" "$(random_password)"
ask MYSQL_ROOT_PASS "MySQL root password (blank = create the DB yourself)" ""
ask ADMIN_EMAIL "Admin email" "admin@askpias.com"
ask ADMIN_NAME "Admin name" "Pias Ahmed"
ask ADMIN_PASS "Admin password" "$(random_password)"
ask SEED_DEMO "Seed demo content (yes/no)" "yes"
ask SKIP_FRONTEND "Skip building the site (yes/no)" "no"
ask WEB_USER "Web server user" "www"

# ------------------------------------------------------------------- files ---
step "Application files"

mkdir -p "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch origin "$BRANCH"
  git -C "$APP_DIR" checkout "$BRANCH" >/dev/null 2>&1 || true
  git -C "$APP_DIR" pull --ff-only origin "$BRANCH"
  ok "Updated the existing checkout"
elif [ -f "$APP_DIR/backend/artisan" ]; then
  ok "Using the app already in $APP_DIR"
else
  # aaPanel/cPanel pre-create the folder with default files. Move those aside, then clone.
  BACKUP_DIR="${APP_DIR%/}-default-files"
  moved=0
  for f in index.html 404.html index.php default.php .user.ini .htaccess; do
    if [ -e "$APP_DIR/$f" ]; then
      mkdir -p "$BACKUP_DIR"
      mv "$APP_DIR/$f" "$BACKUP_DIR/"
      moved=1
    fi
  done

  if [ "$moved" -eq 1 ]; then
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
    ok "Cloned into $APP_DIR (panel default files moved to $BACKUP_DIR)"
  else
    die "$APP_DIR is not empty and does not contain the app — pick an empty directory."
  fi
fi

# ---------------------------------------------------------------- backend ----
step "Backend dependencies"
cd "$APP_DIR/backend"
"$PHP_BIN" "$COMPOSER_BIN" install --no-dev --optimize-autoloader --no-interaction

step "Backend configuration"
[ -f .env ] || cp .env.example .env

"$PHP_BIN" scripts/set-env.php .env \
  "APP_NAME=AskPias" \
  "APP_ENV=production" \
  "APP_DEBUG=false" \
  "APP_URL=$API_URL" \
  "APP_VERSION=$APP_VERSION" \
  "APP_BRANCH=$BRANCH" \
  "FRONTEND_URL=$SITE_URL" \
  "FRONTEND_URLS=$SITE_URL" \
  "DB_CONNECTION=mysql" \
  "DB_HOST=$DB_HOST" \
  "DB_PORT=3306" \
  "DB_DATABASE=$DB_NAME" \
  "DB_USERNAME=$DB_USER" \
  "DB_PASSWORD=$DB_PASS" \
  "MAIL_MAILER=log"

if grep -q '^APP_KEY=$' .env; then
  "$PHP_BIN" artisan key:generate --force
  ok "Application key generated"
else
  ok "Application key kept"
fi

if [ -n "$MYSQL_ROOT_PASS" ]; then
  MYSQL_BIN="$(command -v mysql || true)"
  [ -n "$MYSQL_BIN" ] || MYSQL_BIN="/www/server/mysql/bin/mysql"
  if [ -x "$MYSQL_BIN" ]; then
    "$MYSQL_BIN" -h "$DB_HOST" -u root -p"$MYSQL_ROOT_PASS" -e "
      CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
      GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
      FLUSH PRIVILEGES;" && ok "Database $DB_NAME and user $DB_USER ready"
  else
    warn "mysql client not found — create the database manually."
  fi
else
  warn "No MySQL root password given — make sure $DB_NAME exists and $DB_USER can use it."
fi

step "Database schema"
"$PHP_BIN" artisan migrate --force

if [ "$SEED_DEMO" = "yes" ]; then
  NOTE_COUNT="$("$PHP_BIN" artisan tinker --execute='echo \App\Models\Note::query()->count();' 2>/dev/null | tail -n1 | tr -dc '0-9' || true)"
  if [ "${NOTE_COUNT:-0}" = "0" ]; then
    "$PHP_BIN" artisan db:seed --force
    ok "Demo content seeded"
  else
    ok "Content already present — demo seeding skipped"
  fi
fi

step "Admin account"
"$PHP_BIN" artisan app:create-admin "$ADMIN_EMAIL" --name="$ADMIN_NAME" --password="$ADMIN_PASS"

"$PHP_BIN" artisan storage:link >/dev/null 2>&1 || true
"$PHP_BIN" artisan optimize:clear >/dev/null
"$PHP_BIN" artisan optimize

# --------------------------------------------------------------- frontend ----
if [ "$SKIP_FRONTEND" != "yes" ]; then
  step "Site build"
  cd "$APP_DIR"

  cat > .env <<EOF
VITE_API_URL=$API_URL/api
VITE_ADMIN_URL=$API_URL/admin
VITE_GTM_ID=
EOF

  if command -v bun >/dev/null 2>&1; then
    bun install --frozen-lockfile || bun install
    bun run build
  elif [ -f package-lock.json ]; then
    npm ci && npm run build
  else
    npm install && npm run build
  fi
  ok "Site built into $APP_DIR/.output"

  if command -v pm2 >/dev/null 2>&1; then
    step "Node service"
    if pm2 describe askpias-web >/dev/null 2>&1; then
      PORT=3000 pm2 restart askpias-web --update-env
    else
      PORT=3000 pm2 start .output/server/index.mjs --name askpias-web --update-env
    fi
    pm2 save >/dev/null
    ok "PM2 process 'askpias-web' running on 127.0.0.1:3000"
  else
    warn "pm2 not found — start the site with: cd $APP_DIR && PORT=3000 node .output/server/index.mjs"
    warn "or install the systemd unit from deploy/askpias-web.service"
  fi
fi

# -------------------------------------------------------------- ownership ----
if [ "$(id -u)" -eq 0 ] && id -u "$WEB_USER" >/dev/null 2>&1; then
  chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR/backend/storage" "$APP_DIR/backend/bootstrap/cache"
  [ -d "$APP_DIR/.output" ] && chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR/.output"
  ok "storage/, bootstrap/cache and .output owned by $WEB_USER"
fi

# ------------------------------------------------------------------ done -----
step "Installed"

cat <<EOF

  Public site      $SITE_URL
  Admin panel      $API_URL/admin
  API              $API_URL/api
  Web root         $APP_DIR/backend/public   <- set this as the PHP site's document root
  Admin login      $ADMIN_EMAIL
  Admin password   $ADMIN_PASS

  Finish on the server:
    1. aaPanel: PHP site for the API, document root $APP_DIR/backend/public, PHP 8.3 (lsphp).
    2. Public site: reverse-proxy to 127.0.0.1:3000 (OLS/nginx snippet in INSTALL.md).
    3. Enable SSL for both domains.
    4. Change the admin password at any time:
         cd $APP_DIR/backend && $PHP_BIN artisan app:create-admin $ADMIN_EMAIL

  Update later (from GitHub):
    bash $APP_DIR/update.sh          # or Admin -> System -> Updates

EOF
