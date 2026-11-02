# SCHEMA.md — tables as defined by migrations

13 migrations in `backend/database/migrations/`. DB: MySQL `askpias` (`backend/.env:30-33`).
No foreign keys exist except `leads.note_id` — the only Eloquent relation in the app is
`Lead::note()` (`backend/app/Models/Lead.php:32`).

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

Indexes: `published_at`; the composite `(is_published, sort_order)` index was **dropped**
in `2026_02_05_000001_drop_category_and_comments_from_notes.php`, which also removed
`category` and `comment_count`.

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

## `leads` — same migration + `2026_02_06_000001_add_uddoktapay_settings.php`
| Column | Type / default |
| --- | --- |
| `id` | bigint PK |
| `note_id` | FK → `notes.id`, nullable, `nullOnDelete` |
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
(`LeadController`, `PaymentController`, `LeadsTable`).

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
`description` (longtext, null), `icon` (string, default `code`), `tags` (json, null),
`url` (null), `cta_label` (null), `is_published` (bool, true), `sort_order` (int, 0),
timestamps. Index `(is_published, sort_order)`.

## `books` — same migration
`id`, `slug` (unique), `title`, `subtitle` (string 500, null), `description` (longtext, null),
`badge` (null), `cover_image_url` (null), `price` (decimal(10,2), null),
`currency` (string 8, default `BDT`), `features` (json, null), `buy_url` (null),
`sample_url` (null), `is_featured` (bool, false), `is_published` (bool, true),
`sort_order` (int, 0), timestamps. Index `(is_published, sort_order)`.

## Framework tables (unmodified Laravel)
- `users` (`name`, `email` unique, `password`, `remember_token`), `password_reset_tokens`,
  `sessions` — `0001_01_01_000000_create_users_table.php`.
- `cache` / `cache_locks` — `0001_01_01_000001_create_cache_table.php` (contents not inspected).
- `jobs` / `job_batches` / `failed_jobs` — `0001_01_01_000002_create_jobs_table.php`
  (contents not inspected).

## Seeded data
`DatabaseSeeder`: admin user, site settings (contact `pias@askpias.com`, tagline),
4 notes, 3 case studies, 3 testimonials; then `ProjectSeeder` (3 projects) and
`BookSeeder` (1 book) (`backend/database/seeders/`).
