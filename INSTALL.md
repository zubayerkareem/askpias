# INSTALL.md — deployment and updates

This project is deployed with **Dokploy + Docker** (see 1). The older aaPanel/zip
installers still work and are documented in 2; they are not used in production.

Two services, one project:
- **compose service** → `db` + `api` (Laravel admin/API) → `api.askpias.com`
- **application service** → site (root `Dockerfile`) → `askpias.com`

---

## 1. Dokploy (recommended, in use)

### Files
| File | Builds |
| --- | --- |
| `docker-compose.yml` | `db` (MySQL 8.4) + `api` (Laravel). `web` is behind the `full` profile and is NOT deployed here |
| `backend/Dockerfile` | PHP 8.3 + nginx (`serversideup/php`), installs `intl gd exif`, runs Composer inside the image |
| `backend/docker/askpias-init.sh` | Start hook: migrations → demo seed (once) → admin from env → caches |
| `Dockerfile` | Site: `bun install` → `bun run build` → `node .output/server/index.mjs` on port 3000 |

### Service 1 — Compose (db + api)
1. Project → **Create Service → Compose**, source GitHub, branch `main`, compose path
   `./docker-compose.yml`.
2. Environment (Dokploy writes these into `.env`):

```env
APP_KEY=base64:...            # generate: echo "base64:$(openssl rand -base64 32)"
SITE_URL=https://askpias.com
API_URL=https://api.askpias.com
DB_DATABASE=askpias
DB_USERNAME=askpias
DB_PASSWORD=...
DB_ROOT_PASSWORD=...
ADMIN_EMAIL=admin@askpias.com
ADMIN_NAME=Pias Ahmed
ADMIN_PASSWORD=...
SEED_DEMO=true
GTM_ID=
```

3. Domains → Host `api.askpias.com`, service `api`, **port 8080**, HTTPS on.
   Never publish host ports: 3000 belongs to the Dokploy panel.
4. Deploy. The api log must show `[askpias] Running migrations…` … `[askpias] Ready.`

### Service 2 — Application (site)
1. Project → **Create Service → Application**, same repo, branch `main`.
2. Build type **Dockerfile**, Dockerfile path `Dockerfile`, context `.`.
3. Domain → Host `askpias.com`, **port 3000**, HTTPS on.
4. Deploy. Build args default to `https://api.askpias.com/api`; override with
   `VITE_API_URL` / `VITE_ADMIN_URL` if the domains differ (they are **baked at build**).

### Shared rules
- `db-data` and `uploads` volumes persist the database and `storage/app/public`.
- `APP_ENV=production` means the user model must implement `FilamentUser`
  (`backend/app/Models/User.php`) or the panel returns 403 after login.
- The site must be built with `nitro.preset = node-server` (`vite.config.ts`); the
  Cloudflare default produces a bundle that cannot run under Node (socket hangs → 502).

### Updates
Push to `main`; with **Auto Deploy** enabled each service rebuilds and restarts.
The api container re-runs migrations on every start, so schema changes ship with a push.
Content edits (notes, images, prices) need no deploy — do them in `/admin`.

---

## 2. Standalone installers (aaPanel / VPS / zip)

### Requirements
| Thing | Version |
| --- | --- |
| PHP | 8.3+ with `pdo_mysql mbstring openssl fileinfo curl tokenizer xml ctype zip json gd intl` |
| Composer | 2.2+ |
| MySQL | 5.7+ / 8.x |
| Node or Bun | Node 20+ or Bun 1.x (build + SSR) |
| git | any (not required for zip installs) |

### 2a. One command
```bash
cd /www/wwwroot/askpias && bash setup.sh     # prompts once for the MySQL root password
```

### 2b. Browser installer
`backend/public/install.php` — visit `https://<api-domain>/install.php`, enter database +
admin details, click Install. It writes `.env`, migrates, creates the admin, builds and
starts the site. Needs `shell_exec` + `proc_open` enabled, plus Node/PM2. Locks itself with
`backend/storage/installed.lock`; delete that to re-run.

### 2c. Zip package
```powershell
powershell -ExecutionPolicy Bypass -File package.ps1     # Windows → dist/askpias-1.0.0.zip
bash package.sh                                          # Linux/macOS
```
Contains tracked files **plus the prebuilt `.output`**. Extract on the server, then run
`setup.sh` or open `install.php`.

### 2d. Web server
- API site: document root `<APP_DIR>/backend/public`, PHP 8.3.
- Site: reverse proxy to `127.0.0.1:3000` (OLS `extprocessor`/`context`, nginx `proxy_pass`).
- SSL on both domains.

### 2e. Updates without Docker
```bash
cd /www/wwwroot/askpias && bash update.sh      # git pull, or downloads the GitHub archive
```
The admin has **System → Updates** which runs the same script.

---

## 3. First login
`https://api.askpias.com/admin` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Reset any time:
```bash
php artisan app:create-admin you@example.com
```

## 4. Troubleshooting
| Symptom | Cause / fix |
| --- | --- |
| 502 on the site | container down or wrong port. `docker ps`, `docker logs`. Must be port **3000** |
| 404 on the site | no Traefik router: Host must be `askpias.com` (no `https://`), service `web`/Application, port 3000 |
| 403 after admin login | `User` must implement `FilamentUser` (already fixed) or `APP_ENV` isn't production |
| Composer: `ext-intl` missing | the API image installs it; a custom image must too |
| Site shows old API URL | `VITE_*` is baked — rebuild the web service |
| UddoktaPay "return url not allowed" | `FRONTEND_URL` must be a whitelisted domain |
| `$'\r': command not found` | CRLF on a shell script — `.gitattributes` pins `*.sh` to LF |

## 5. Security checklist
- `APP_DEBUG=false`, `APP_ENV=production`
- Rotate the generated admin/DB passwords; keep `APP_KEY` stable (sessions break otherwise)
- Keep `backend/.env` off git; it lives in Dokploy's environment variables
- Rotate the UddoktaPay API key and GTM container ID from **Site settings**
