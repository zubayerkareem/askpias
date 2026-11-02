# STACK.md — exact versions in this repo

## Runtimes (measured on this machine)
| Thing | Version | Command |
| --- | --- | --- |
| PHP | 8.3.30 (ZTS, OPcache) | `php -v` |
| Laravel | 13.39.0 | `php artisan --version` |
| Node | v24.11.1 | `node -v` |
| Bun | 1.3.14 | `bun --version` |

## Frontend dependencies (declared in `package.json`, resolved via `bun.lock` / `bun pm ls`)
| Package | Declared | Resolved |
| --- | --- | --- |
| `react`, `react-dom` | `^19.2.0` | 19.2.8 |
| `@tanstack/react-router` | `^1.170.18` | 1.170.18 |
| `@tanstack/react-start` | `^1.168.32` | 1.168.32 |
| `@tanstack/react-query` | `^5.101.1` | 5.101.4 |
| `vite` | `^8.2.0` | 8.2.0 |
| `tailwindcss`, `@tailwindcss/vite` | `^4.2.1` | 4.3.3 |
| `typescript` | `^5.8.3` | 5.9.3 |
| `zod` | `^3.24.2` | 3.25.76 |
| `lucide-react` | `^0.575.0` | 0.575.0 |
| `react-hook-form` | `^7.71.2` | — |
| `@hookform/resolvers` | `^5.2.2` | — |
| `embla-carousel-react` / `-autoplay` | `^8.6.0` | 8.6.0 |
| `nprogress` | `^0.2.0` | — |
| `sonner` | `^2.0.7` | — |
| `@tiptap/react` + starter-kit + image + placeholder | `3.29.2` | 3.29.2 (not imported in `src/`) |
| `@supabase/supabase-js` | `^2.112.3` | (not imported in `src/`) |
| `recharts` | `^2.15.4` | — |
| `react-day-picker` | `^9.14.0` | — |
| `@radix-ui/*` (25 packages) | see `package.json` | — |

Dev tooling: `eslint ^9.32.0`, `typescript-eslint ^8.56.1`, `prettier ^3.7.3`,
`nitro 3.0.260603-beta`, `@lovable.dev/vite-tanstack-config 2.9.1`,
`@vitejs/plugin-react ^5.2.0` (`package.json`).

Scripts (`package.json`): `dev` = `vite dev`, `build` = `vite build`,
`lint` = `eslint .`, `format` = `prettier --write .`. No test script.

Build config: `@lovable.dev/vite-tanstack-config` wrapper; SSR entry overridden to
`src/server.ts`; dev `allowedHosts` includes `*.trycloudflare.com`, `*.ngrok-free.app`
(`vite.config.ts`). Nitro's default build target is Cloudflare per that config's comments.

## Backend (declared in `backend/composer.json`, resolved from `backend/composer.lock`)
| Package | Constraint | Installed |
| --- | --- | --- |
| `php` | `^8.3` | 8.3.30 |
| `laravel/framework` | `^13.17` | v13.39.0 |
| `filament/filament` | `^5.0` | v5.11.0 |
| `livewire/livewire` (transitive) | — | v4.4.8 |
| `laravel/tinker` | `^3.0` | v3.0.2 |
| `blade-ui-kit/blade-heroicons` (transitive) | — | 2.7.0 |
| `phpunit/phpunit` (dev) | `^12.5.12` | 12.5.42 |
| `laravel/pint` (dev) | `^1.27` | v1.32.1 |
| `laravel/pail` (dev) | `^1.2.5` | — |
| `nunomaduro/collision` (dev) | `^8.6` | — |

## Data & services
- DB: MySQL, `DB_CONNECTION=mysql`, host `127.0.0.1:3306`, database `askpias`, user `root`
  (`backend/.env:30-35`).
- Mail: `MAIL_MAILER=log` by default; runtime SMTP override from admin settings
  (`backend/.env:57`, `backend/app/Models/SiteSetting.php`).
- CORS: `FRONTEND_URLS` env, comma-separated, default `http://localhost:8080,http://127.0.0.1:8080`
  (`backend/config/cors.php`).
- Payment return origin: `FRONTEND_URL` → `services.uddoktapay.frontend_url`
  (`backend/config/services.php`, `backend/.env:9` = `https://askpias.com`).
- Frontend API base: `VITE_API_URL` default `http://127.0.0.1:8000/api`; admin URL
  `VITE_ADMIN_URL` default `http://127.0.0.1:8000/admin` (`.env`, `src/lib/api.ts`,
  `src/routes/admin.tsx`).
- Notable Laravel setup: `trustProxies(at: '*')` and JSON errors for `api/*`
  (`backend/bootstrap/app.php`).

## Deployment (Docker + Dokploy — the production path)
- **Dokploy project with two services**: a **Compose** service (`db` + `api`) and an
  **Application** service for the site (root `Dockerfile`). `docker-compose.yml`, the two
  Dockerfiles and `backend/docker/askpias-init.sh` are the source of truth; see `INSTALL.md`.
- **API image**: `serversideup/php:8.3-fpm-nginx`, installs `intl gd exif`, Composer runs
  inside the image (the bare `composer` image has no `ext-intl`). nginx listens on **8080**.
- **Site image**: `node:22-alpine`, `bun install` → `bun run build` → `node
  .output/server/index.mjs` on **3000**. `VITE_*` are build args, baked at build time.
- **Nitro preset must be `node-server`** (`vite.config.ts`); the default `cloudflare-module`
  bundle exits immediately under Node → 502.
- `APP_ENV=production` requires `User extends Authenticatable implements FilamentUser`
  (`canAccessPanel`), otherwise the panel 403s after login.
- Volumes: `db-data` (MySQL), `uploads` (`backend/storage/app/public`).
- Updates: push to `main` → Dokploy rebuilds → the api entrypoint re-runs migrations.

## Deployment (standalone installers — fallback)
- **Installer / updater**: `install.sh`, `setup.sh`, `update.sh` at the repo root (bash);
  `package.sh` / `package.ps1` build the distributable zip (prebuilt `.output`).
- Admin UI for updates: `backend/app/Filament/Pages/Updates.php`.
- Browser wizard: `backend/public/install.php`.
- **Frontend runtime**: Node 20+ serving `.output/server/index.mjs` on `127.0.0.1:3000`
  via PM2 (`askpias-web`) or `deploy/askpias-web.service`; OLS/nginx reverse-proxies to it.
- **Backend runtime**: PHP 8.3 (lsphp) with the document root set to `backend/public`.
- **New env keys**: `APP_VERSION` (admin Updates page) and `APP_BRANCH` (branch `update.sh`
  pulls), both read in `backend/config/app.php`.
- **Automation**: `.github/workflows/deploy.yml` → SSH → `bash update.sh`.
- **Script hygiene**: `.gitattributes` pins `*.sh` to LF.
