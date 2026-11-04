# backend/AGENTS.md

The repo-wide guide is [`../AGENTS.md`](../AGENTS.md) — read it first; it covers conventions,
deploy paths, and the environment traps. This file only adds what is specific to `backend/`.

**Do not install Laravel Boost.** This stub used to instruct `composer require laravel/boost`
— the project does not use it, and adding it rewrites these instructions mid-task.

## Layout
| Area | Path |
| --- | --- |
| Routes (all public, no auth) | `routes/api.php` |
| Controllers | `app/Http/Controllers/Api/*` |
| API resources | `app/Http/Resources/*` — shapes the public JSON |
| Models | `app/Models/*` |
| Filament resources | `app/Filament/Resources/<Model>/{Schemas,Tables,Pages}` |
| Admin settings page | `app/Filament/Pages/ManageSettings.php` |
| Panel config | `app/Providers/Filament/AdminPanelProvider.php` |
| Runtime config (SMTP) | `app/Providers/AppServiceProvider.php` → `SiteSetting::applyMailConfig()` |
| Payment gateway | `app/Services/UddoktaPayService.php` |
| Mailables / views | `app/Mail/*`, `resources/views/mail/*` |
| Migrations | `database/migrations/YYYY_MM_DD_00000N_description.php` |
| Container start hook | `docker/askpias-init.sh` |

## Rules
- Thin controllers; validate inline with `$request->validate()`; errors are JSON under `api/*`
  (`bootstrap/app.php`).
- Content models carry `is_published` + `sort_order`; public queries use `published()` and
  order by `sort_order`.
- Settings are one singleton row (`SiteSetting::current()`). A new admin-editable value needs:
  migration → `$fillable` → a `ManageSettings` section → `SiteSettingController@show` only if it
  is safe to expose publicly. Secrets (`uddoktapay_api_key`, `mail_password`) stay hidden.
- Never return a paid file from a resource. `BookResource` publishes `purchasable` instead of
  `file_url`; the URL comes from `PaymentController@verify` when `status === 'paid'`.
  `NoteResource` currently violates this (tracked in `../PLAN.md`).
- Mail sends are wrapped in try/catch + `Log::warning`; the API must never fail on SMTP errors.
- Production never seeds. `docker/askpias-init.sh` seeds only when `SEED_DEMO=true` **and** the
  notes table is empty; `update.sh` never seeds.
- `APP_ENV=production` requires `User implements FilamentUser`, otherwise the panel 403s after
  login.
- Install/update steps live in `../install.sh` / `../update.sh`, never in PHP.

## Local setup
```sh
composer install
cp .env.example .env          # set DB_* and FRONTEND_URLS
php artisan key:generate
php artisan migrate --seed    # local only — resets content and the admin password
php artisan storage:link
php artisan serve
```

## Verify
```sh
php artisan migrate --force
php artisan test              # only example tests exist today
php artisan optimize:clear    # after config/env changes
php -l <new-file>.php
```
