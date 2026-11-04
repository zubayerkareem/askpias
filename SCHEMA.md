# SCHEMA.md — tables as defined by migrations

17 application migrations under `backend/database/migrations/` (plus 3 unmodified Laravel
ones = 20 files). DB: MySQL `askpias` (`backend/.env:30-33`).

Two foreign keys exist, both nullable with `nullOnDelete`: `leads.note_id` and
`leads.book_id`. The only Eloquent relations in the app are `Lead::note()` and
`Lead::book()` (`backend/app/Models/Lead.php`). Everything else is FK-free content.

## Migration map

| Migration | What it does |
| --- | --- |
| `0001_01_01_000000…` / `000001…` / `000002…` | Laravel users, cache, jobs |
| `2026_02_01_000001_create_notes_table` | notes |
| `2026_02_01_000002_create_case_studies_table` | case studies |
| `2026_02_01_000003_create_testimonials_table` | testimonials |
| `2026_02_01_000004_create_messages_leads_settings_tables` | messages, leads, site settings |
| `2026_02_02_000001_add_intro_video_to_site_settings` | `intro_video_url` |
| `2026_02_03_000001_add_gtm_to_site_settings` | `gtm_container_id` |
| `2026_02_04_000001_create_projects_and_books_tables` | projects, books |
| `2026_02_05_000001_drop_category_and_comments_from_notes` | removes `category`, `comment_count` + the `(is_published, sort_order)` index from notes |
| `2026_02_06_000001_add_uddoktapay_settings` | gateway columns on settings; `status`/`invoice_id`/`amount`/`currency`/`payment_method`/`transaction_id`/`paid_at` on leads |
| `2026_02_07_000001_add_mail_and_seo_settings` | SMTP + SEO columns on settings |
| `2026_11_04_000001_create_pages_table` | pages |
| `2026_11_04_000002_seed_about_page` | inserts the `about` page row (data migration) |
| `2026_11_04_000003_add_image_url_to_projects_table` | `projects.image_url` |
| `2026_11_04_000004_add_featured_image_url_to_books_table` | `books.featured_image_url` |
| `2026_11_04_000005_update_about_call_duration` | rewrites "30-minute" → "30-90 minute" inside the `about` page blocks |
| `2026_11_04_000006_add_file_url_to_books_table` | `books.file_url` |
| `2026_11_04_000007_add_book_id_to_leads_table` | `leads.book_id` FK → books |

## `notes` — `2026_02_01_000001_create_notes_table.php` (+ drop migration)
| Column | Type / default |
| --- | --- |
| `id` | bigint PK |
| `slug` | string, unique |
| `title` | string |
| `excerpt` | text, nullable |
| `content` | longtext, nullable (admin HTML) |
| `image_url` | string, nullable |
| `featured` | bool, default false |
| `locked` | bool, default false |
| `published_at` | date, nullable |
| `sort_order` | integer, default 0 |
| `is_published` | bool, default true |
| `lead_magnet_file_url` | string, nullable |
| `lead_magnet_cta_label` | string, nullable |
| `lead_magnet_payment_required` | bool, default false |
| `lead_magnet_price` | decimal(10,2), nullable |
| `timestamps` | — |

Indexes: `published_at`; the composite `(is_published, sort_order)` index was dropped in
`2026_02_05_000001`, which also removed `category` and `comment_count`.

`NoteResource` returns `lead_magnet_file_url` on **both** index and show, regardless of
`lead_magnet_payment_required` — the paid gate is UI-only (see `PLAN.md`).

## `case_studies` — `2026_02_01_000002_create_case_studies_table.php`
`id`, `slug` (unique), `name`, `summary` (text, null), `content` (longtext, null),
`tags` (json, null), `image_url` (null), `sort_order` (int, 0), `is_published` (bool, true),
timestamps. Index `(is_published, sort_order)`.

## `testimonials` — `2026_02_01_000003_create_testimonials_table.php`
`id`, `headline`, `quote` (text), `name`, `role` (null), `company` (null),
`initials` (string(4), null), `rating` (tinyint, 5), `sort_order` (int, 0),
`is_published` (bool, true), timestamps. Index `(is_published, sort_order)`.

## `messages` — `2026_02_01_000004_create_messages_leads_settings_tables.php`
`id`, `name` (null), `phone`, `email`, `question` (text), `is_read` (bool, false),
timestamps. Index `is_read`. No relation to users or notes.

## `leads` — same migration + `2026_02_06_000001` + `2026_11_04_000007`
| Column | Type / default |
| --- | --- |
| `id` | bigint PK |
| `note_id` | FK → `notes.id`, nullable, `nullOnDelete` |
| `book_id` | FK → `books.id`, nullable, `nullOnDelete` |
| `invoice_id` | string, nullable, unique |
| `amount` | decimal(10,2), nullable |
| `currency` | string(8), nullable |
| `status` | string(20), default `'free'` |
| `payment_method` | string, nullable |
| `transaction_id` | string, nullable |
| `paid_at` | timestamp, nullable |
| `name`, `phone`, `email` | string |
| `timestamps` | — |

Index `created_at`. Status values used in code: `free`, `pending`, `paid`, `failed`
(`LeadController`, `PaymentController`, `LeadsTable`). A lead belongs to **either** a note
(lead magnet) or a book — both columns are nullable and only one is set per lead.

## `site_settings` — singleton row (`SiteSetting::current()` → `firstOrCreate(['id' => 1])`)
Base (`2026_02_01_000004_*`): `id`, `hero_image_url`, `case_studies_iframe_url`,
`contact_email`, `tagline`, timestamps.
Added: `intro_video_url` (`2026_02_02_*`), `gtm_container_id` (`2026_02_03_*`),
`uddoktapay_base_url`, `uddoktapay_api_key`, `uddoktapay_currency` default `BDT`
(`2026_02_06_*`), `mail_host`, `mail_port`, `mail_username`, `mail_password`,
`mail_encryption`, `mail_from_address`, `mail_from_name`, `seo_site_url`, `robots_txt`,
`sitemap_enabled` default true (`2026_02_07_000001_add_mail_and_seo_settings.php`).

Model hides `uddoktapay_api_key` and `mail_password` from serialisation
(`backend/app/Models/SiteSetting.php`); API exposes only hero image, iframe URL, intro video,
GTM id, contact email, tagline, `seo_site_url`, `robots_txt`, `sitemap_enabled`
(`backend/app/Http/Controllers/Api/SiteSettingController.php`).

## `projects` — `2026_02_04_000001_create_projects_and_books_tables.php`
`id`, `slug` (unique), `name`, `kicker` (null), `summary` (string 500, null),
`description` (longtext, null), `icon` (string, default `code`),
`image_url` (null, added `2026_11_04_000003_add_image_url_to_projects_table.php`),
`tags` (json, null), `url` (null), `cta_label` (null), `is_published` (bool, true),
`sort_order` (int, 0), timestamps. Index `(is_published, sort_order)`.

`image_url` is the admin-uploaded project logo (`public` disk, `projects/`); the homepage
"What I'm building" cards and the project page show it instead of the `icon` fallback.

## `books` — same migration
`id`, `slug` (unique), `title`, `subtitle` (string 500, null), `description` (longtext, null),
`badge` (null), `cover_image_url` (null),
`featured_image_url` (null, added `2026_11_04_000004_add_featured_image_url_to_books_table.php`),
`file_url` (null, added `2026_11_04_000006_add_file_url_to_books_table.php`),
`price` (decimal(10,2), null), `currency` (string 8, default `BDT`), `features` (json, null),
`buy_url` (null), `sample_url` (null), `is_featured` (bool, false), `is_published` (bool, true),
`sort_order` (int, 0), timestamps. Index `(is_published, sort_order)`.

`cover_image_url` is the books-page thumbnail and detail cover; `featured_image_url` is used by
the homepage ebook block and falls back to the cover when empty. `file_url` is the uploaded
ebook, never returned by the public API — `BookResource` exposes a computed
`purchasable` flag (`file_url` set AND `price > 0`) instead. The URL is handed out only after
a paid UddoktaPay lead.

## `pages` — `2026_11_04_000001_create_pages_table.php`
| Column | Type / default |
| --- | --- |
| `id` | bigint PK |
| `slug` | string, unique — must match a frontend route (e.g. `about`) |
| `title` | string (used as the page title / OG title) |
| `meta_description` | text, nullable |
| `blocks` | json, nullable — ordered list of `{type, data}` |
| `is_published` | bool, default true |
| `timestamps` | — |

Block types built in `PageForm` and rendered by `src/components/site/PageBlocks.tsx`:

| `type` | `data` keys |
| --- | --- |
| `hero` | `label`, `heading`*, `body` |
| `story` | `heading`*, `body` (rich HTML), `image`, `caption_name`, `caption_location`, `facts[{value,label}]` |
| `practice` | `heading`*, `items[{image,title*,body}]` |
| `stats` | `items[{value*,label*}]` |
| `cta` | `heading`*, `body`, `primary_label`, `primary_url`, `secondary_label`, `secondary_url` |

Uploaded block images live on the `public` disk under `pages/`. `PageResource` resolves
relative image paths to storage URLs and coerces `facts`/`items` to arrays. Only
`GET /api/pages/{slug}` exists (no index); `src/routes/about.tsx` loads `about` through a
route loader and falls back to hardcoded copy when the row is missing.

The `about` row is inserted by the **migration** `2026_11_04_000002_seed_about_page.php`
(production never seeds), and `2026_11_04_000005_update_about_call_duration.php` edits its
blocks in place.

## Framework tables (unmodified Laravel)
- `users` (`name`, `email` unique, `password`, `remember_token`), `password_reset_tokens`,
  `sessions` — `0001_01_01_000000_create_users_table.php`.
- `cache` / `cache_locks` — `0001_01_01_000001_create_cache_table.php`.
- `jobs` / `job_batches` / `failed_jobs` — `0001_01_01_000002_create_jobs_table.php`.

## Seeded data
`DatabaseSeeder`: admin user, site settings (contact `pias@askpias.com`, tagline),
4 notes, 3 case studies, 3 testimonials; then `ProjectSeeder` (3 projects) and
`BookSeeder` (1 book) (`backend/database/seeders/`). The `about` page does **not** come from
a seeder — it ships in a migration.
