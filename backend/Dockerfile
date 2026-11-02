# Admin + API (Laravel 13 + Filament 5) on PHP 8.3 with nginx.
# serversideup/php ships nginx + php-fpm and the extensions Filament needs
# (intl, gd, zip, fileinfo, pdo_mysql…), so Composer runs here rather than in a
# bare composer image that has no ext-intl.

FROM serversideup/php:8.3-fpm-nginx AS runtime

USER root
WORKDIR /var/www/html

# serversideup/php does not enable intl by default and Filament requires it
# (gd is needed by the image editor, exif by uploads).
RUN if command -v install-php-extensions >/dev/null 2>&1; then \
        install-php-extensions intl gd exif; \
    else \
        apt-get update \
        && apt-get install -y --no-install-recommends \
           libicu-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
        && docker-php-ext-configure gd --with-freetype --with-jpeg \
        && docker-php-ext-install intl gd exif \
        && rm -rf /var/lib/apt/lists/*; \
    fi

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
