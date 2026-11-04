#!/bin/sh
# Runs on every container start (serversideup/php entrypoint.d).
# Safe to repeat: migrations are incremental, the admin is created only if missing.
set -e

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
    echo "[askpias] APP_KEY is not set — generate one with: php artisan key:generate --show" >&2
    exit 1
fi

# storage/app/public is a mounted volume, so fix ownership before anything writes to it.
mkdir -p storage/app/public
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R ug+rwX storage bootstrap/cache 2>/dev/null || true

# The volume hides the image's storage directory, but the symlink lives in public/.
# Recreate it instead of trusting whatever state the image was left in.
if [ -d public/storage ] && [ ! -L public/storage ]; then
    rm -rf public/storage
fi
if ln -sfn ../storage/app/public public/storage; then
    chown -h www-data:www-data public/storage 2>/dev/null || true
else
    echo "[askpias] Could not create public/storage — uploads will be served by Laravel." >&2
fi

echo "[askpias] Running migrations…"
php artisan migrate --force --no-interaction

if [ "${SEED_DEMO:-false}" = "true" ]; then
    count=$(php artisan tinker --execute='echo \App\Models\Note::query()->count();' 2>/dev/null | tail -n1 | tr -dc '0-9' || true)
    if [ "${count:-0}" = "0" ]; then
        echo "[askpias] Seeding demo content…"
        php artisan db:seed --force --no-interaction
    fi
fi

if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
    echo "[askpias] Ensuring admin ${ADMIN_EMAIL}…"
    php artisan app:create-admin "${ADMIN_EMAIL}" \
        --name="${ADMIN_NAME:-Admin}" \
        --password="${ADMIN_PASSWORD}"
fi

php artisan optimize --no-interaction || true

echo "[askpias] Ready."
