#!/bin/sh
# Runs on every container start (serversideup/php entrypoint.d).
# Safe to repeat: migrations are incremental, the admin is created only if missing.
set -e

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
    echo "[askpias] APP_KEY is not set — generate one with: php artisan key:generate --show" >&2
    exit 1
fi

php artisan storage:link >/dev/null 2>&1 || true

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

chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

echo "[askpias] Ready."
