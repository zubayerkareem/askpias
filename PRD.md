# PRD — AskPias (as built)

Personal brand site for Pias Ahmed plus a Laravel/Filament admin. Two deployables:
TanStack Start frontend at repo root, Laravel API + admin in `backend/`.

## Users
- **Visitor** — reads notes/case studies, downloads lead magnets, asks questions, books calls.
  No accounts, no login for visitors (`backend/routes/api.php` has no auth routes).
- **Admin (Pias)** — one Filament user created by the seeder
  (`backend/database/seeders/DatabaseSeeder.php`: `admin@askpias.com`).
- **Payment gateway** — UddoktaPay self-hosted, called server-side
  (`backend/app/Services/UddoktaPayService.php`).

## Public routes (file → route)
| Route | File |
| --- | --- |
| `/` | `src/routes/index.tsx` |
| `/about` | `src/routes/about.tsx` |
| `/contact` | `src/routes/contact.tsx` |
| `/case-studies`, `/case-studies/{slug}` | `src/routes/case-studies/index.tsx`, `$slug.tsx` |
| `/notes`, `/notes/{slug}` | `src/routes/notes/index.tsx`, `notes/$slug.tsx` |
| `/notes/download` (payment return) | `src/routes/notes/download.tsx` |
| `/books`, `/books/{slug}` | `src/routes/books/index.tsx`, `books/$slug.tsx` |
| `/projects/{slug}` (no index route) | `src/routes/projects/$slug.tsx` |
| `/booking` | `src/routes/booking.tsx` |
| `/faqs` | `src/routes/faqs.tsx` (not in header nav — `src/components/site/SiteNav.tsx`) |
| `/admin` (redirects to Filament) | `src/routes/admin.tsx` |
| `/robots.txt`, `/sitemap.xml` | `src/routes/robots[.]txt.ts`, `sitemap[.]xml.ts` |

Homepage composition: Hero → Building → Ebook → BlogSection → Testimonials → Booking →
AskAnything → footer (`src/routes/index.tsx`).

## Features found in code
- **Content types**: notes, case studies, testimonials, projects, books; all authored in
  Filament (`backend/app/Filament/Resources/`), read by the site through the public API.
- **Notes**: rich HTML body, cover image, featured flag, `locked` (shows a static
  "subscribers only" block — `src/routes/notes/$slug.tsx:81`), lead-magnet attachment.
- **Related posts**: keyword-scored, top 3 (`src/lib/related-notes.ts`, used in
  `notes/$slug.tsx:43`).
- **Lead magnets**: free capture (`POST /api/leads`) or paid via UddoktaPay
  (`POST /api/leads/checkout`), download gated behind `/notes/download?invoice_id=`
  (`backend/routes/api.php`, `src/routes/notes/download.tsx`).
- **Contact / ask forms**: `POST /api/messages`, throttled 10/min, BD phone regex
  (`backend/app/Http/Controllers/Api/MessageController.php`, `routes/api.php`).
- **Booking**: Cal.com inline embed, not persisted in the database
  (`src/components/site/CalBooking.tsx`).
- **Emails**: lead-magnet-ready, contact auto-reply, admin notification
  (`backend/app/Mail/`), SMTP configured from admin and applied at boot
  (`backend/app/Providers/AppServiceProvider.php`, `SiteSetting::applyMailConfig`).
- **SEO**: sitemap generated from API content; robots.txt served from settings
  (`src/routes/sitemap[.]xml.ts`, `robots[.]txt.ts`, `backend/app/Filament/Pages/ManageSettings.php`).
- **Analytics**: GTM dataLayer helpers — `page_view`, `view_item`, `select_item`,
  `begin_checkout`, `purchase`, `generate_lead`, `cta_click` (`src/lib/analytics.ts`).
- **Install & updates**: `install.sh` provisions a server (dependencies, DB, admin account,
  build, PM2) and `update.sh` pulls from GitHub and rebuilds both apps; the admin has
  **System → Updates** (`backend/app/Filament/Pages/Updates.php`) and
  `.github/workflows/deploy.yml` runs the same script on push.
- **Theme**: light/dark toggle, class on `<html>`, key `askpias-theme`
  (`src/hooks/use-theme.ts`, `src/components/site/ThemeToggle.tsx`).

## Admin panel (Filament v5, path `/admin`)
Resources: Notes, CaseStudies, Testimonials, Projects, Books, Messages, Leads
(`backend/app/Filament/Resources/*`). Custom Dashboard + ContentStats + LatestMessages
widgets (`backend/app/Providers/Filament/AdminPanelProvider.php`). Site settings page holds
homepage media, GTM, UddoktaPay, SMTP, SEO, contact (`ManageSettings.php`).

## Known gaps (observed in code, not speculation)
- No test coverage beyond Laravel's example tests (`backend/tests/Feature/ExampleTest.php`);
  no JS test runner in `package.json`.
- `@supabase/supabase-js` and `@tiptap/*` are dependencies but not imported anywhere in
  `src/` (grep for `supabase|@tiptap` returns only `notes-data.ts` type hits).
- No payment webhook route — verification is pull-only via `GET /api/payments/verify`
  (`backend/routes/api.php`); `UddoktaPayService` has no webhook method.
- Booking is not stored: no `bookings` table in `backend/database/migrations/`.
- FAQ copy is hardcoded in `src/routes/faqs.tsx` and not editable from admin.
- `locked` notes have no unlock path (no subscriber auth), so locked content is unreachable.
- No newsletter/subscriber model; no public accounts.
- `site_settings` is a singleton row (`SiteSetting::current()` forces `id = 1`).
- `/projects` has no index page; only detail pages exist.
- Provisioning needs shell access — there is no browser-based installer, because the Node
  SSR build cannot run from PHP (`install.sh`, `INSTALL.md`).
- The admin "Run update" button depends on the PHP user owning the app directory with
  `git`/`composer` on its PATH; otherwise updates must run over SSH (`Updates.php`).
