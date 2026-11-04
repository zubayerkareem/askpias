# Pias Ahmed — Marketing Site

Marketing/lead-gen site for Pias Ahmed, brand builder & marketing consultant.

- **Frontend** — TanStack Start + TypeScript + React + Tailwind CSS (repo root)
- **Backend / admin** — Laravel 13 + Filament 5 (`/backend`), MySQL

All content (notes, case studies, testimonials, projects, books, pages, site settings) is
managed in the Filament admin panel and served to the frontend over a JSON API.

> **Installing or updating on a server?** See [INSTALL.md](./INSTALL.md).
> Production deploys on **Dokploy + Docker**: a Compose service (`db` + `api`) and an
> Application service for the site (§1). The shell installers (`install.sh`, `setup.sh`,
> `update.sh`) and the zip/browser wizard remain as fallbacks (§2).

---

## Requirements

- PHP 8.3+ and Composer (Laragon provides both)
- MySQL 8+
- Bun 1.x

## 1. Backend

```sh
cd backend
composer install
cp .env.example .env          # then set DB_* / FRONTEND_URLS
php artisan key:generate
php artisan migrate --seed    # creates the schema + demo content + admin user
php artisan storage:link      # public image uploads
php artisan serve             # http://127.0.0.1:8000
```

Admin panel: **http://127.0.0.1:8000/admin**

| Field | Value |
| --- | --- |
| Email | `admin@askpias.com` |
| Password | `password` |

> Change the password immediately after the first login:
> `php artisan tinker` → `App\Models\User::first()->update(['password' => Hash::make('new-password')]);`

`php artisan db:seed` is **local-only**: the seeders use `updateOrCreate`, so they overwrite
seeded content *and* reset the admin password to `password`. Never run it on a live install —
`update.sh` and the Docker entrypoint never seed an existing database.

### Admin sections

| Section | What it manages |
| --- | --- |
| Content → Notes | Blog notes: title, slug, excerpt, rich-text body (images + YouTube), cover image, featured/locked, publish date, sort order, optional lead magnet (free or paid) |
| Content → Case studies | Client case studies: name, slug, summary, body, cover image, tags, sort order |
| Content → Testimonials | Client quotes shown on the homepage slider |
| Content → Projects | "What I'm building" items: name, kicker, summary, rich description, icon, tags, external link |
| Content → Books | Ebooks: title, subtitle, cover + featured image, price, features list, uploaded file, buy/sample URLs, featured flag |
| Content → Pages | Block-built pages (currently `about`): hero, story, practice, stats, CTA blocks |
| Inbox → Messages | "Ask me anything" form submissions (unread badge, mark read) |
| Inbox → Leads | Lead-magnet and ebook checkouts with status, invoice, amount and source |
| Site settings | Homepage (hero portrait, case-studies iframe, intro video), Analytics (GTM), Payments (UddoktaPay), Email (SMTP), SEO (site URL, robots.txt, sitemap), Contact (email, tagline) |

### API

Public. Reads are open; writes are rate-limited (10/min) except payment verification (30/min).

```txt
GET  /api/notes                  GET  /api/notes/{slug}
GET  /api/case-studies           GET  /api/case-studies/{slug}
GET  /api/testimonials           GET  /api/settings
GET  /api/projects               GET  /api/projects/{slug}
GET  /api/books                  GET  /api/books/{slug}
GET  /api/pages/{slug}           GET  /api/payments/verify?invoice_id=…
POST /api/messages               POST /api/leads
POST /api/leads/checkout         POST /api/books/checkout
```

Collections come back as `{ "data": [...] }`, single records as `{ "data": {...} }`.

CORS allows the origins listed in `FRONTEND_URLS` (comma separated).

## 2. Frontend

```sh
bun install
bun run dev        # http://localhost:8080
```

`.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_ADMIN_URL=http://127.0.0.1:8000/admin
```

`/admin` on the frontend redirects to the Laravel panel.

### Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview the production build |
| `bun run lint` | Lint with ESLint |
| `bun run format` | Format with Prettier |

---

## Analytics (Google Tag Manager)

Set the container in **Admin → Site settings → Analytics** (`GTM-XXXXXXX`), or via
`VITE_GTM_ID` in the frontend `.env`. When set, the site loads
`googletagmanager.com/gtm.js` and exposes a `window.dataLayer` for every tag
(Meta Pixel, Meta CAPI, GA4, Google Ads…).

Events pushed by the site:

| Event | When | Key parameters |
| --- | --- | --- |
| `page_view` | Every route change | `page_path`, `page_location`, `page_title` |
| `generate_lead` | Ask-me-anything form or lead-magnet form submitted | `form_name`, `currency`, `value`, `item_id`, `item_name` |
| `view_item` | Note / case study detail opened | `ecommerce.items[]` |
| `select_item` | A post clicked in a list | `item_list_name`, `ecommerce.items[]` |
| `begin_checkout` | Ebook CTA clicked | `ecommerce.value`, `ecommerce.items[]` |
| `purchase` | Payment verified on the notes/books return page | `transaction_id`, `ecommerce.value`, `items` |
| `cta_click` | Hero, product cards, ebook secondary CTA | `cta_label`, `cta_location` |

Helpers live in `src/lib/analytics.ts` (`analytics.lead()`, `analytics.viewItem()`,
`analytics.beginCheckout()`…), and the container injection is
`src/components/site/TagManager.tsx`. Use these events as GTM trigger conditions —
e.g. a Meta "Lead" tag firing on `generate_lead`, or a CAPI tag sending the same.

---

## Blog editor

The note/case-study body uses Filament's rich editor with:

- inline image uploads (public disk, images only, 5 MB max),
- a **YouTube** toolbar button (paste a URL — the site renders a responsive player),
- headings, lists, quotes, tables, alignment, links, horizontal rules, undo/redo.

The note detail page also shows a reading time (200 words/min), and a paragraph containing
only a YouTube link is rendered as a responsive embed.

---

## Pages (block editor)

**Content → Pages** builds a page from ordered blocks instead of one rich-text field. Each page
has a slug that must match a frontend route, plus a title and meta description used for SEO.

| Block | Fields |
| --- | --- |
| Page header (`hero`) | kicker label, heading, body |
| Story | heading, rich body, portrait, caption name/location, highlight facts (`value` + `label`) |
| What I do (`practice`) | heading, cards (image, title, body) |
| Stats | value + label pairs |
| Call to action | heading, body, primary/secondary button label + URL |

`about` is the only page wired up today: its content is inserted by a migration, and
`src/routes/about.tsx` falls back to built-in copy if the API returns nothing. Uploaded block
images are stored on the `public` disk under `pages/`.

---

## Email (SMTP)

Configure in **Admin → Site settings → Email (SMTP)**: host, port, encryption
(TLS/SSL), username, password, and the from address/name. Settings are applied at
runtime, so no `.env` change or restart is needed.

Emails sent automatically:

| Trigger | Recipient |
| --- | --- |
| Free lead-magnet download | The visitor — “Your download is ready” with the file link |
| Paid lead-magnet (payment verified) | The visitor — download link |
| Paid ebook (payment verified) | The visitor — the uploaded book file link |
| Contact form / “Ask me anything” | The visitor — “We received your message, we'll be in touch” |
| Contact form / “Ask me anything” | You (contact email) — full message details |

With no SMTP configured, Laravel's `log` mailer is used, so nothing breaks.

## SEO

- `GET /robots.txt` — served from **Site settings → SEO → robots.txt** (a
  `Sitemap:` line is appended automatically).
- `GET /sitemap.xml` — generated from the static routes plus notes, case studies, books and
  project details. Toggle with **Serve sitemap.xml**; the base URL comes from **Site URL**.

## Site pages

`/about`, `/contact` (with form), `/booking`, `/faqs`, `/case-studies`,
`/case-studies/{slug}`, `/notes`, `/notes/{slug}`, `/books`, `/books/{slug}`,
`/projects/{slug}`. FAQ is still available at `/faqs` but no longer in the header.
`/notes/download` and `/books/download` are payment-return pages (`noindex`).

---

## Payments (UddoktaPay, self-hosted)

Lead magnets and ebooks are sold through your own UddoktaPay installation.

**Admin → Site settings → Payments**

| Field | Notes |
| --- | --- |
| UddoktaPay URL | Your self-hosted install, e.g. `https://pay.your-domain.com` |
| API key | From UddoktaPay → API Settings (`RT-UDDOKTAPAY-API-KEY`) |
| Currency | Defaults to `BDT` |

Make a lead magnet paid in **Content → Notes → Lead magnet**: set a file URL, turn on
“Requires payment” and enter the price.

**Flow**

1. Visitor clicks the paid CTA on the note → `POST /api/leads/checkout`
2. The API creates a `pending` lead and calls `{base}/api/checkout-v2`
3. Visitor pays on UddoktaPay (bKash / Nagad / Rocket / bank) and returns to
   `/notes/download?invoice_id=…`
4. That page calls `GET /api/payments/verify`, which verifies the invoice with
   `{base}/api/verify-payment`, marks the lead `paid` and returns the download URL.

### Ebooks

Make a book purchasable in **Content → Books**: upload the file to **File** and set a
**Price**. The public API then returns `purchasable: true` and the book page shows the
"Buy the book" dialog (`src/components/site/BookPurchase.tsx`).

1. Visitor submits name/phone/email → `POST /api/books/checkout`
2. The API creates a `pending` lead with `book_id` and redirects to UddoktaPay
3. Return → `/books/download?slug=…&invoice_id=…`
4. `GET /api/payments/verify` returns the uploaded file's `download_url` and emails the link.

A book without a file or with no price falls back to its `buy_url` link instead of the dialog.
Verification is pull-only: there is no webhook, so a lead stays `pending` until a return page
verifies it.

`FRONTEND_URL` in `backend/.env` sets the return/cancel URL origin. Leads and their
status (`free` / `pending` / `paid` / `failed`, amount, invoice, transaction id) are in
**Inbox → Leads**.

> The sandbox values (`https://sandbox.uddoktapay.com` + the public sandbox key) are only
> for testing. Replace them with your self-hosted URL and key before going live.

---

## Notes for production

- Set `APP_ENV=production` and `APP_DEBUG=false` in `backend/.env`.
- Point the web server document root at `backend/public` (Laragon: add a virtual
  host, or `php artisan serve` behind a reverse proxy).
- Run `php artisan optimize` (config/route/view cache) and schedule
  `php artisan queue:work` if you add queued jobs.
- Uploads are stored on the `public` disk; keep `storage/` writable and run
  `php artisan storage:link` on deploy.
