# Admin + API (Laravel 13 + Filament 5) on PHP 8.3 with nginx.
# serversideup/php ships nginx + php-fpm + the common Laravel extensions.

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --optimize-autoloader

FROM serversideup/php:8.3-fpm-nginx AS runtime

USER root
WORKDIR /var/www/html

COPY --from=vendor /app/vendor ./vendor
COPY . .

RUN composer dump-autoload --no-dev --optimize --no-interaction || true

# Runs before the container starts: migrations, storage link, admin account.
COPY docker/askpias-init.sh /etc/entrypoint.d/50-askpias.sh
RUN chmod +x /etc/entrypoint.d/50-askpias.sh

RUN chown -R www-data:www-data storage bootstrap/cache

USER www-data

EXPOSE 8080
