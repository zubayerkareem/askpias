# INSTALL.md — installation and updates

One package installs **both** apps: the Filament admin/API (`backend/`) and the TanStack
site (repo root). Everything runs on your own server — no SaaS, no external dashboard.
The only network dependencies are GitHub (source) and the Composer/Bun package registries.

## What gets installed
- Laravel 13 API at `/api` and Filament admin at `/admin`
- The site, built to `.output` and served by a Node process (Nitro SSR) on `127.0.0.1:3000`
- MySQL schema, optional demo content, and one admin account

## Requirements
| Thing | Version |
| --- | --- |
| PHP | 8.3+ with `pdo_mysql mbstring openssl fileinfo curl tokenizer xml ctype zip json gd` |
| Composer | 2.x |
| MySQL | 5.7+ / 8.x |
| Node or Bun | Node 20+ or Bun 1.x (build + SSR) |
| git | any |
| RAM | 2 GB recommended (PHP + Node + MySQL) |

## 1. Quick install
**One command** (detects PHP 8.3 and the web-server user, installs Node/PM2 if missing,
asks only for the MySQL root password):
```bash
cd /www/wwwroot/askpias && bash setup.sh
```

Or run the installer directly:
```bash
sudo git clone https://github.com/zubayerkareem/askpias.git /www/wwwroot/askpias.com
cd /www/wwwroot/askpias.com
sudo bash install.sh
```

The installer asks for the install directory, site/API URLs, database, admin account and
whether to seed demo content. It then: installs PHP dependencies, writes `backend/.env`,
creates the database and admin user, runs migrations, builds the site and starts it under
PM2. Re-running it is safe — `.env`, the database, uploads and the admin account are kept.

**Zero questions** — accepts every default (URLs `askpias.com` / `api.askpias.com`, install
dir `/www/wwwroot/askpias.com`, random DB + admin passwords):
```bash
MYSQL_ROOT_PASS='your-mysql-root-password' bash install.sh --auto
```

**Non-interactive** (CI or a repeat install):
```bash
APP_DIR=/www/wwwroot/askpias.com \
SITE_URL=https://askpias.com API_URL=https://api.askpias.com \
DB_NAME=askpias DB_USER=askpias DB_PASS='strong-pass' MYSQL_ROOT_PASS='root-pass' \
ADMIN_EMAIL=you@askpias.com ADMIN_PASS='admin-pass' \
bash install.sh
```
Every prompt can be pre-set as an environment variable; `SKIP_FRONTEND=yes` installs only
the backend, `SEED_DEMO=no` skips demo content.

## 1b. Browser installer (optional)
A single-file wizard ships at `backend/public/install.php`. Point the API site's document
root at `backend/public`, then open `https://api.example.com/install.php`:

1. It lists requirements — PHP 8.3, extensions, writable `storage/` + `bootstrap/cache`,
   and a PHP 8.3 CLI binary (the wizard shells out to `artisan`).
2. Fill in site/API URLs, the database (add the MySQL root password and it creates the
   database + user for you), and the admin account.
3. It writes `.env`, generates the app key, runs migrations, optionally seeds demo content,
   creates the admin, links uploads and caches the config.
4. The last screen prints the only thing a browser can't do — the Node build:
   ```bash
   cd /www/wwwroot/askpias && bash install.sh --frontend-only
   ```

The wizard locks itself with `backend/storage/installed.lock` (delete it to run again) and
should be removed from the server once you're done: `rm backend/public/install.php`.

## 1c. Zip installation (no git on the server)
Windows:
```powershell
powershell -ExecutionPolicy Bypass -File package.ps1        # → dist/askpias-1.0.0.zip
```
Linux/macOS:
```bash
bash package.sh                 # → dist/askpias-<version>.zip (or .tar.gz)
VERSION=1.1.0 bash package.sh   # pick a version
```
The package contains only tracked files **plus the prebuilt site** (`.output`), so the
server never has to run a Node build. `.env`, `vendor/`, `node_modules/` and uploads are
excluded. It extracts to `askpias-<version>/` with the site at the root and the admin/API
inside `backend/`.

On the server (upload the zip with aaPanel → Files, or `scp`):
```bash
cd /www/wwwroot
unzip askpias-1.0.0.zip
mv askpias-1.0.0 askpias
```
Then either the browser wizard (`https://<api-domain>/install.php` — see 1b) or:
```bash
cd /www/wwwroot/askpias && bash setup.sh
```

The browser wizard now installs **both** apps: database + admin, then it writes the site's
`.env`, builds it if `.output` is missing, and starts the Node process on `127.0.0.1:3000`.
It needs Node 20+/PM2 installed and `shell_exec` + `proc_open` enabled in that site's PHP.

Updates work without git too: `bash update.sh` detects there is no checkout and downloads
the latest archive from GitHub (`ARCHIVE_URL`, defaults to the `main` tarball), syncing it
over the app while keeping `.env`, uploads and logs.

## 2. Finish the web server (aaPanel + OpenLiteSpeed)
1. **API site** — create a PHP site for `api.example.com`:
   - Document root: `<APP_DIR>/backend/public` (not the project root)
   - PHP version: 8.3 (lsphp)
   - Enable SSL, set `max_execution_time` to 120
2. **Public site** — create a site for `example.com`, then proxy it to the Node process.
   In OLS, add to the vhost config:
   ```apacheconf
   extprocessor askpias-node {
     type              proxy
     address           127.0.0.1:3000
     maxConns          100
     qsKeepAliveTimeout 60
     respBuffer        0
   }

   context / {
     type      proxy
     handler   askpias-node
   }
   ```
   nginx equivalent (cPanel/nginx panels):
   ```nginx
   location / {
     proxy_pass http://127.0.0.1:3000;
     proxy_http_version 1.1;
     proxy_set_header Host $host;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
3. Enable SSL for both domains. Laravel already trusts proxies
   (`backend/bootstrap/app.php`), so https URLs generate correctly behind the proxy.
4. Optional cron: `* * * * * cd <APP_DIR>/backend && php artisan schedule:run >> /dev/null 2>&1`

No PM2? Install the unit instead:
```bash
cp <APP_DIR>/deploy/askpias-web.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now askpias-web
```

## 3. First login
`https://api.example.com/admin` with the email/password the installer printed.
Change it any time:
```bash
cd <APP_DIR>/backend && php artisan app:create-admin you@example.com
```

## 4. Updating from GitHub
Three equivalent paths — all run the same `update.sh`.

**A. From the admin panel** — *System → Updates → Run update now*. Shows the live output
and the last run log. The command executes as the PHP user, so it needs ownership of the
app directory and `git`/`composer` on that user's PATH.

**B. Over SSH**
```bash
cd /www/wwwroot/askpias.com && bash update.sh
```
Flags: `FORCE=1` (discard local changes, `git reset --hard origin/<branch>`),
`SKIP_FRONTEND=1`, `SKIP_BACKEND=1`, `BRANCH=release`.

**C. Automatically on push** — `.github/workflows/deploy.yml` runs `update.sh` over SSH
when `main` changes. Add repository secrets:
`SSH_HOST`, `SSH_USER`, `SSH_KEY` (private key), `APP_DIR`.

### What an update does
`git pull` → `composer install --no-dev` → `php artisan migrate --force` →
`optimize:clear` + `optimize` → install + build the frontend → restart the Node process →
fix ownership.

It **does not** touch `backend/.env`, the database rows, or uploaded files in
`backend/storage/app/public`. It never seeds. Migrations are additive, so a rollback is
`git reset --hard <previous-sha>` followed by the same script.

## 5. Troubleshooting
| Symptom | Cause / fix |
| --- | --- |
| `bash: $'\r': command not found` | CRLF line endings. `.gitattributes` pins `*.sh` to LF; if the file was edited on Windows, run `sed -i 's/\r$//' install.sh update.sh` |
| 500 right after install | `php artisan optimize:clear`, check `backend/storage/logs/laravel.log`, and that `storage/` + `bootstrap/cache` are owned by the web user |
| PHP changes don't appear | OPcache with `validate_timestamps=0` — restart lsphp/OLS |
| Site still calls the old API URL | `VITE_*` is baked at build time — rerun the frontend build, not just a restart |
| Uploaded images 404 | `php artisan storage:link`; widen `open_basedir` to include `storage/` and `vendor/`; OLS must follow symlinks |
| UddoktaPay: "return url not allowed" | `FRONTEND_URL` must be a domain whitelisted in the UddoktaPay dashboard |
| Admin update button fails with permission error | Run `bash update.sh` once over SSH as the file owner, then `chown -R www:www <APP_DIR>` |
| Emails not sending | Site settings → Email (SMTP); without it Laravel uses the `log` mailer |

## 6. Security checklist
- `APP_DEBUG=false`, `APP_ENV=production` (the installer sets both)
- Change the seeded admin password; the installer already asks for one
- Keep `backend/.env` at `600`, owned by the web user
- Consider basic-auth or an IP allow-list in front of `/admin`
- Rotate the UddoktaPay API key and GTM container ID from **Site settings**
