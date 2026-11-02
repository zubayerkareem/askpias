# Pias Ahmed — Marketing Site

Marketing/lead-gen site for Pias Ahmed, brand builder & marketing consultant.

- **Frontend** — TanStack Start + TypeScript + React + Tailwind CSS (repo root)
- **Backend / admin** — Laravel 13 + Filament 5 (`/backend`), MySQL

All content (notes, case studies, testimonials, site settings) is managed in the
Filament admin panel and served to the frontend over a JSON API.

> **Installing or updating on a server?** See [INSTALL.md](./INSTALL.md) — one-command
> install (`install.sh`), aaPanel/OpenLiteSpeed setup, and the GitHub update flow
> (`update.sh`, admin **System → Updates**, GitHub Actions).

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

Re-seed at any time with `php artisan db:seed` (idempotent — it updates by slug).

### Admin sections

| Section | What it manages |
| --- | --- |
| Content → Notes | Blog notes: title, slug, category, excerpt, rich-text body, cover image, featured/members-only, publish date, sort order, optional lead magnet |
| Content → Case studies | Client case studies: name, slug, summary, body, cover image, tags, sort order |
| Content → Testimonials | Client quotes shown on the homepage slider |
| Content → Projects | "What I'm building" items: name, kicker, summary, rich description, icon, tags, external link |
| Content → Books | Ebooks: title, subtitle, cover, price, features list, buy/sample URLs, featured flag |
| Inbox → Messages | "Ask me anything" form submissions (unread badge, mark read) |
| Inbox → Leads | Lead-magnet downloads with the source note |
| Site settings | Hero portrait, intro video, GTM container, contact email, tagline |

### API

Public, read-only except the two form endpoints.

```txt
GET  /api/notes                  GET  /api/notes/{slug}
GET  /api/case-studies           GET  /api/case-studies/{slug}
GET  /api/testimonials           GET  /api/settings
GET  /api/projects               GET  /api/projects/{slug}
GET  /api/books                  GET  /api/books/{slug}
POST /api/messages               POST /api/leads      (throttled: 10/min)
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
| `purchase` | Ready for a payment gateway | `transaction_id`, `ecommerce.value`, `items` |
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
| Contact form / “Ask me anything” | The visitor — “We received your message, we'll be in touch” |
| Contact form / “Ask me anything” | You (contact email) — full message details |

With no SMTP configured, Laravel's `log` mailer is used, so nothing breaks.

## SEO

- `GET /robots.txt` — served from **Site settings → SEO → robots.txt** (a
  `Sitemap:` line is appended automatically).
- `GET /sitemap.xml` — generated from your content (pages, notes, case studies,
  books, projects). Toggle with **Serve sitemap.xml**; the base URL comes from
  **Site URL**.

## Pages

`/about`, `/contact` (with form), `/booking`, `/faqs`, `/case-studies`, `/notes`,
`/books`, `/projects/{slug}`. FAQ is still available at `/faqs` but no longer in the
header.

---

## Payments (UddoktaPay, self-hosted)

Paid lead magnets are sold through your own UddoktaPay installation.

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

`FRONTEND_URL` in `backend/.env` sets the return/cancel URL origin. Leads and their
status (`free` / `pending` / `paid` / `failed`, amount, invoice, transaction id) are in
**Inbox → Leads**.

> The sandbox values (`https://sandbox.uddoktapay.com` + the public sandbox key) are only
> for testing. Replace them with your self-hosted URL and key before going live.

---

## Public preview via Cloudflare Tunnel

Two quick tunnels are used while the apps run locally:

```sh
cloudflared tunnel --url http://localhost:8080   # site
cloudflared tunnel --url http://127.0.0.1:8000   # API + admin
```

When the tunnel URLs change, update:

- frontend `.env` → `VITE_API_URL=https://<backend>.trycloudflare.com/api`, `VITE_ADMIN_URL=https://<backend>.trycloudflare.com/admin` (restart `bun run dev`)
- backend `.env` → `APP_URL=https://<backend>.trycloudflare.com` and add the site origin to `FRONTEND_URLS`, then `php artisan config:clear`

`vite.config.ts` allows `*.trycloudflare.com` hosts for the dev server, and
Laravel trusts forwarded headers so URLs are generated as `https`.

Quick tunnels are temporary (random URL, no uptime guarantee). For a stable
domain use a named tunnel: `cloudflared tunnel login`, `cloudflared tunnel create askpias`,
then route a hostname to `http://localhost:8080` / `http://127.0.0.1:8000`.

> The admin panel is publicly reachable while the backend tunnel is up — change the
> seeded password before sharing the link.

---

## Notes for production

- Set `APP_ENV=production` and `APP_DEBUG=false` in `backend/.env`.
- Point the web server document root at `backend/public` (Laragon: add a virtual
  host, or `php artisan serve` behind a reverse proxy).
- Run `php artisan optimize` (config/route/view cache) and schedule
  `php artisan queue:work` if you add queued jobs.
- Uploads are stored on the `public` disk; keep `storage/` writable and run
  `php artisan storage:link` on deploy.
