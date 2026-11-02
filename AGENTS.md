# AGENTS.md — read this first

Two apps in one repo: TanStack Start site at the root, Laravel + Filament admin in `backend/`.

## Read before any task
1. `PRD.md` — what the product does and what it doesn't.
2. `STATE.md` — status enums and page flows (`leads.status`, download page, messages).
3. `SCHEMA.md` — columns before touching a model, migration, or form.
4. `TOKENS.md` — colours/type before touching any UI.
5. `STACK.md` — versions and env wiring.
6. `PLAN.md` — open items.

Then open the specific files for the area:

| Area | Entry point |
| --- | --- |
| Routes | `src/routes/**` (file-based; `routeTree.gen.ts` is generated) |
| Page chrome | `src/components/site/PageShell.tsx`, `SiteNav.tsx`, `SiteFooter.tsx` |
| API client | `src/lib/api.ts` (`API_URL`, `api.get/post`, `Collection<T>`) |
| Data hooks | `src/hooks/use-{notes,case-studies,testimonials,projects,books,site-settings,messages,payments}.ts` |
| Marketing analytics | `src/lib/analytics.ts` (`analytics.*` → `window.dataLayer`) |
| API routes | `backend/routes/api.php` |
| Controllers | `backend/app/Http/Controllers/Api/*` |
| Admin resources | `backend/app/Filament/Resources/<Model>/{Schemas,Tables,Pages}` |
| Admin settings | `backend/app/Filament/Pages/ManageSettings.php` |
| Panel config/theme | `backend/app/Providers/Filament/AdminPanelProvider.php` |
| Payment gateway | `backend/app/Services/UddoktaPayService.php` |
| Mailables | `backend/app/Mail/*` + `backend/resources/views/mail/*` |
| Install & update | `install.sh`, `update.sh`, `INSTALL.md` |
| Admin updater | `backend/app/Filament/Pages/Updates.php` + `views/filament/pages/updates.blade.php` |
| Admin account CLI | `backend/app/Console/Commands/CreateAdmin.php` |
| Env writer | `backend/scripts/set-env.php` |
| Deploy automation | `.github/workflows/deploy.yml`, `deploy/askpias-web.service` |

## Conventions observed in this codebase
### TypeScript / React
- Strict TS with extra flags: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noPropertyAccessFromIndexSignature`; env vars read as `import.meta.env["VITE_*"]`
  (`tsconfig.json`, `src/lib/api.ts`).
- Import alias `@/*` → `src/*` (`tsconfig.json`, `vite.config.ts`).
- Prettier: `printWidth: 100`, double quotes, semicolons, trailing commas (`.prettierrc`).
- ESLint bans importing `server-only` (`eslint.config.js`).
- Route files are thin: `createFileRoute` + `head()` (title/description/og/canonical) +
  component; data loads through react-query hooks, not loaders, except
  `notes/$slug.tsx` which uses loader data.
- Styling uses semantic tokens only (`bg-page`, `border-line`, `text-brand`,
  `text-muted-foreground`); never hardcode hex in components (`src/styles.css:13`).
- Cards = white sheet (`bg-page`) + `border border-line` + `rounded-xl`; no grey fills.
- Loading feedback = nprogress bar only, no skeletons (`src/components/site/RouteProgress.tsx`).
- All outbound analytics go through `analytics.*`, never `dataLayer.push` inline
  (`src/lib/analytics.ts`).
- Forms: `react-hook-form` + `zodResolver` + shadcn `Form` fields; BD phone regex
  `/^(?:\+?880|0)1[3-9]\d{8}$/` (mirrors backend validation, e.g. `ContactForm.tsx`).

### Laravel / Filament
- Thin controllers; validation inline via `$request->validate()`; JSON errors for `api/*`
  (`backend/bootstrap/app.php`).
- Every FK-free content model has `is_published` + `sort_order`; public endpoints filter
  `published()` and order by `sort_order` (`NoteController.php`).
- Admin CRUD is split into `Schemas/*Form.php` (fields), `Tables/*Table.php` (columns,
  filters, actions), and `Pages/` classes per resource.
- Settings live in one singleton row via `SiteSetting::current()`; new admin-configurable
  values need: migration → `$fillable` → `ManageSettings` section → API `show()` if public.
- Config that must take effect at runtime is applied in
  `backend/app/Providers/AppServiceProvider.php` (see `applyMailConfig`).
- Mail sends are always wrapped in try/catch + `Log::warning` so the API never fails on SMTP
  errors (`LeadController.php`, `MessageController.php`).
- Migrations: `YYYY_MM_DD_00000N_description.php`, one concern per file.
- Server install and updates live only in `install.sh` / `update.sh` at the repo root —
  don't duplicate those steps in PHP. The admin page and GitHub Actions both shell out to
  `update.sh`.
- Never run `php artisan db:seed` on a live install: seeders use `updateOrCreate` and reset
  content plus the admin password (`DatabaseSeeder.php`). `update.sh` never seeds.
- Shell scripts keep LF endings (`.gitattributes`); `.env` files exist only on servers and
  are never committed.

## Verify before finishing
- Frontend: `bunx tsc --noEmit`, `bun run lint`, `bun run build`.
- Backend: `php artisan migrate --force`, `php artisan test` (only example tests exist),
  `php artisan optimize:clear` after config/env changes.
- Scripts: `bash -n install.sh update.sh` after any edit; `php -l` on new PHP files.

## Environment traps hit before
- Frontend calls the API through `VITE_API_URL`; a stale tunnel URL there breaks every page
  silently (`.env`, `src/lib/api.ts`).
- UddoktaPay rejects return URLs whose host is not whitelisted in its dashboard; the return
  origin comes from `FRONTEND_URL` (`backend/.env:9`, `config/services.php`).
- Vite 403s unknown tunnel hosts unless listed in `server.allowedHosts` (`vite.config.ts`).
- Behind a tunnel Laravel needs `trustProxies(at: '*')` for https URLs
  (`backend/bootstrap/app.php`).
- Admin → System → Updates runs `update.sh` as the PHP user; the app directory must be owned
  by it (git + composer on that user's PATH) or the run must be done over SSH.
- `VITE_*` values are baked at build time — changing `VITE_API_URL` needs a rebuild, not a
  restart (`src/lib/api.ts`, `install.sh`, `update.sh`).
