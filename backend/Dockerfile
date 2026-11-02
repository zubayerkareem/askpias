# Admin + API (Laravel 13 + Filament 5) on PHP 8.3 with nginx.
# serversideup/php ships nginx + php-fpm and the extensions Filament needs
# (intl, gd, zip, fileinfo, pdo_mysql…), so Composer runs here rather than in a
# bare composer image that has no ext-intl.

FROM serversideup/php:8.3-fpm-nginx AS runtime

USER root
WORKDIR /var/www/html

# Composer is normally present in this image; install it if a variant drops it.
RUN if ! command -v composer >/dev/null 2>&1; then \
        curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer; \
    fi

COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --no-scripts \
        --optimize-autoloader

COPY . .

RUN composer dump-autoload --no-dev --optimize --no-interaction \
    && php artisan package:discover --ansi || true

# Runs before the container starts: migrations, storage link, admin account.
COPY docker/askpias-init.sh /etc/entrypoint.d/50-askpias.sh
RUN chmod +x /etc/entrypoint.d/50-askpias.sh

RUN chown -R www-data:www-data storage bootstrap/cache

USER www-data

EXPOSE 8080
