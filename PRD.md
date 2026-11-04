# PRD — AskPias (as built)

Personal brand site for Pias Ahmed plus a Laravel/Filament admin. Two deployables:
TanStack Start frontend at repo root, Laravel API + admin in `backend/`.

## Users
- **Visitor** — reads notes/case studies, downloads lead magnets, buys ebooks, asks questions,
  books calls. No accounts, no login for visitors (`backend/routes/api.php` has no auth routes).
- **Admin (Pias)** — one Filament user created by the seeder
  (`backend/database/seeders/DatabaseSeeder.php`: `admin@askpias.com`).
- **Payment gateway** — UddoktaPay self-hosted, called server-side
  (`backend/app/Services/UddoktaPayService.php`).

## Public routes (file → route)
| Route | File |
| --- | --- |
| `/` | `src/routes/index.tsx` |
| `/about` (DB-driven blocks, hardcoded fallback) | `src/routes/about.tsx` |
| `/contact` | `src/routes/contact.tsx` |
| `/case-studies`, `/case-studies/{slug}` | `src/routes/case-studies/index.tsx`, `$slug.tsx` |
| `/notes`, `/notes/{slug}` | `src/routes/notes/index.tsx`, `notes/$slug.tsx` |
| `/notes/download` (lead-magnet payment return) | `src/routes/notes/download.tsx` |
| `/books`, `/books/{slug}` | `src/routes/books/index.tsx`, `books/$slug.tsx` |
| `/books/download` (ebook payment return) | `src/routes/books/download.tsx` |
| `/projects/{slug}` (no index route) | `src/routes/projects/$slug.tsx` |
| `/booking` | `src/routes/booking.tsx` |
| `/faqs` | `src/routes/faqs.tsx` (not in header nav — `src/components/site/SiteNav.tsx`) |
| `/admin` (redirects to Filament) | `src/routes/admin.tsx` |
| `/robots.txt`, `/sitemap.xml` | `src/routes/robots[.]txt.ts`, `sitemap[.]xml.ts` |

Detail routes (`/about`, `/books/{slug}`, `/case-studies/{slug}`, `/notes/{slug}`,
`/projects/{slug}`) preload through a route `loader` + `queryClient.ensureQueryData`;
index and form pages use react-query hooks. Both download pages are `noindex`.

Homepage composition: Hero → Building → Ebook → BlogSection → Testimonials → Booking →
AskAnything → footer + `Toaster` (`src/routes/index.tsx`). Nav: About, Case Studies, Notes,
Books, Contact + "Book a call" (`SiteNav.tsx`).

## Features found in code
- **Content types**: notes, case studies, testimonials, projects, books, pages; all authored in
  Filament (`backend/app/Filament/Resources/`), read by the site through the public API.
- **Pages**: `pages.blocks` is a Filament Builder of `hero`, `story`, `practice`, `stats`, `cta`
  blocks rendered by `src/components/site/PageBlocks.tsx` (`src/hooks/use-pages.ts` types).
  `/about` is the only page; its row ships in a migration, with `src/routes/about.tsx`
  falling back to hardcoded copy if the API has no row.
- **Notes**: rich HTML body, cover image, featured flag, `locked` (shows a static
  "subscribers only" block — `src/routes/notes/$slug.tsx:81`), lead-magnet attachment, and a
  reading time in minutes (`src/lib/reading-time.ts`, 200 wpm).
- **Related posts**: keyword-scored, top 3 (`src/lib/related-notes.ts`, used in
  `notes/$slug.tsx:43`).
- **Lead magnets**: free capture (`POST /api/leads`) or paid via UddoktaPay
  (`POST /api/leads/checkout`), download gated behind `/notes/download?invoice_id=`
  (`backend/routes/api.php`, `src/routes/notes/download.tsx`). Payment is verified on the
  return page only; there is no webhook.
- **Ebook sales**: `POST /api/books/checkout` creates a `pending` lead with `book_id`, charges
  UddoktaPay and redirects to `/books/download?slug=`. `BookPurchase.tsx` is the dialog form;
  the return page verifies the invoice and shows the `download_url` from the public disk.
  A book is only purchasable when `file_url` is set and `price > 0` (`BookResource.purchasable`).
- **Contact / ask forms**: `POST /api/messages`, throttled 10/min, BD phone regex
  (`backend/app/Http/Controllers/Api/MessageController.php`, `routes/api.php`).
- **Booking**: Cal.com inline embed, not persisted in the database
  (`src/components/site/CalBooking.tsx`, `Booking.tsx`).
- **Emails**: lead-magnet-ready (free and post-payment, note or book), contact auto-reply,
  admin notification (`backend/app/Mail/`), SMTP configured from admin and applied at boot
  (`backend/app/Providers/AppServiceProvider.php`, `SiteSetting::applyMailConfig`).
- **Rich content helpers** (`src/lib/video.ts`): a paragraph containing only a YouTube link is
  replaced by a responsive `youtube-nocookie.com` iframe; `<h1>` in admin HTML is demoted to
  `<h2>`; tables are wrapped in `.article-table` for mobile scrolling.
- **SEO**: sitemap generated from static pages plus notes, case studies, books and project
  details (`src/routes/sitemap[.]xml.ts`); robots.txt served from settings with the sitemap
  line appended (`robots[.]txt.ts`, `ManageSettings.php`). `/about` uses the API title and meta
  description.
- **Analytics**: GTM dataLayer helpers — `page_view`, `view_item`, `select_item`,
  `begin_checkout`, `purchase`, `generate_lead`, `cta_click` (`src/lib/analytics.ts`).
  `purchase` fires on both payment-return pages; `begin_checkout` fires from the book dialog
  and ebook CTAs.
- **Install & updates**: production runs on **Dokploy + Docker** — a Compose service
  (`db` + `api`) and an Application service for the site (`docker-compose.yml`,
  `Dockerfile`, `backend/Dockerfile`); the api container migrates and creates the admin on
  start (`backend/docker/askpias-init.sh`). Standalone fallbacks: `install.sh` / `setup.sh`
  and the browser wizard `backend/public/install.php`. A push to `main` redeploys both.
- **Theme**: light/dark toggle, class on `<html>`, key `askpias-theme`
  (`src/hooks/use-theme.ts`, `src/components/site/ThemeToggle.tsx`). Light is the fallback.
- **Rendering**: SSR entry is `src/server.ts`, which wraps h3's swallowed 500s into the static
  `src/lib/error-page.ts` HTML (`src/lib/error-capture.ts` collects the original error).

## Admin panel (Filament v5, path `/admin`)
Resources: Notes, CaseStudies, Testimonials, Projects, Books, Pages, Messages, Leads
(`backend/app/Filament/Resources/*`). Custom Dashboard + ContentStats + LatestMessages
widgets (`backend/app/Providers/Filament/AdminPanelProvider.php`).

Site settings (`ManageSettings.php`) sections: **Homepage** (hero image, case-studies iframe,
intro video), **Analytics** (GTM container), **Payments** (UddoktaPay base URL, API key,
currency), **Email (SMTP)** (host/port/encryption/user/password/from), **SEO** (site URL,
robots.txt, sitemap toggle), **Contact** (email, tagline).

## Known gaps (observed in code, not speculation)
- **Paid lead magnets leak**: `NoteResource` returns `lead_magnet_file_url` on index and show
  even when `lead_magnet_payment_required` is true, so the "pay" gate is UI-only. Books do
  this correctly (`BookResource` omits `file_url`).
- No test coverage beyond Laravel's example tests (`backend/tests/Feature/ExampleTest.php`);
  no JS test runner in `package.json`.
- `@supabase/supabase-js` and `@tiptap/*` are dependencies but not imported anywhere in
  `src/` (grep for `supabase|@tiptap` returns no matches).
- No payment webhook route — verification is pull-only via `GET /api/payments/verify`
  (`backend/routes/api.php`); `UddoktaPayService` has no webhook method. A visitor who closes
  the return page leaves the lead `pending` until they reopen it.
- Booking is not stored: no `bookings` table in `backend/database/migrations/`.
- FAQ copy is hardcoded in `src/routes/faqs.tsx` and not editable from admin.
- `locked` notes have no unlock path (no subscriber auth), so locked content is unreachable.
- No newsletter/subscriber model; no public accounts.
- `site_settings` is a singleton row (`SiteSetting::current()` forces `id = 1`).
- `/projects` has no index page; only detail pages exist.
- `pages` has only `show` — no index; only the `about` slug is wired to a route.
- List endpoints return full bodies (`NoteResource` includes `content` on index), so the
  notes/case-study lists ship whole articles.
- The Docker site image defaults `VITE_API_URL` to `https://api.askpias.com/api`
  (`Dockerfile`); a different domain needs build args.
