# STATE.md — real states and flows in the code

## 1. Lead lifecycle (`leads.status`)
Defined by string column default `'free'` (`backend/database/migrations/2026_02_06_000001_add_uddoktapay_settings.php`)
and only ever set in two controllers.

| State | Set where | Meaning |
| --- | --- | --- |
| `free` | `LeadController@store` | Free download captured |
| `pending` | `LeadController@checkout`, `PaymentController@verify` | Charge created / gateway says PENDING |
| `paid` | `PaymentController@verify` | Gateway returned `COMPLETED` |
| `failed` | `LeadController@checkout` (bad gateway response), `PaymentController@verify` (any other status) | Charge or verification failed |

`Lead::isPaid()` is a strict `status === 'paid'` check
(`backend/app/Models/Lead.php`). Admin filter exposes the same four values
(`backend/app/Filament/Resources/Leads/Tables/LeadsTable.php`).

Transitions enforced in `backend/app/Http/Controllers/Api/PaymentController.php`:
```
COMPLETED -> paid            (also invoice_id, payment_method, transaction_id, paid_at)
PENDING   -> pending         (never downgrades an already paid lead)
anything  -> failed          (never downgrades an already paid lead)
```

## 2. Payment-return page states (`src/routes/notes/download.tsx`)
Selected in this order:
1. `cancelled` — `result === "cancel"` or no `invoice_id` (no API call).
2. `confirming` — query pending.
3. `paid` — `data.status === "paid"` (fires `analytics.purchase`).
4. `pending` — shows "Check again" (`verify.refetch()`).
5. `failed` — fallback, shows invoice id + email.
Search params validated: `slug`, `invoice_id`, `result` only.

## 3. Gateway/config error states
- Not configured → `503` "Payments are not configured yet" (`LeadController@checkout`).
- Note is free → `422` "This download is free." (`LeadController@checkout`).
- Gateway returned no `payment_url` → `502` + lead marked `failed` (`LeadController@checkout`).
- Unknown invoice/lead → `404` (`PaymentController@verify`).
- Missing `invoice_id` → `422` (`PaymentController@verify`).
- Gateway unreachable/timeout → `['status' => false]` with message
  (`UddoktaPayService::post`, connect 8s / total 15s).
- Base URL normalised: trailing `/api` stripped before appending `api/checkout-v2`
  (`backend/app/Services/UddoktaPayService.php:68-72`).

## 4. Message state
- `is_read` boolean, default false (`backend/database/migrations/2026_02_01_000004_create_messages_leads_settings_tables.php`).
- Toggled by a table row action; filter `Read / Unread`
  (`backend/app/Filament/Resources/Messages/Tables/MessagesTable.php`).
- No reply state, no archiving — only read/unread + delete.

## 5. Content publishing state
- `notes`: `is_published` (default true), `featured` (default false), `locked` (default false),
  `published_at` date, `sort_order` (`2026_02_01_000001_create_notes_table.php`).
- Public API returns **published only**, ordered `sort_order` then `published_at` desc
  (`backend/app/Http/Controllers/Api/NoteController.php`).
- `case_studies`, `projects`, `books`, `testimonials` all carry `is_published` +
  `sort_order` (`2026_02_01_000002_*`, `2026_02_04_000001_*`, `2026_02_01_000003_*`).
- `books` adds `is_featured` (`2026_02_04_000001_create_projects_and_books_tables.php`).

## 6. Theme state
- Class `dark` on `<html>`, persisted in `localStorage['askpias-theme']`.
- Inline init script defaults to **light** when nothing is stored
  (`src/hooks/use-theme.ts`), though `src/styles.css:127` labels the dark block
  "the default look" — code behaviour wins: light is the fallback.

## 7. Admin auth flow
- Filament panel id `admin`, path `/admin`, `->login()` enabled, session middleware stack,
  `Authenticate` on the panel (`backend/app/Providers/Filament/AdminPanelProvider.php`).
- Single seeded user, password hashed with `Hash::make('password')`
  (`backend/database/seeders/DatabaseSeeder.php`) — must be changed manually.
- Frontend `/admin` route just does `window.location.replace(VITE_ADMIN_URL)`
  (`src/routes/admin.tsx`).

## 8. Mail delivery state
- If `mail_host` is blank → nothing is changed, Laravel's default mailer is used;
  `.env` currently has `MAIL_MAILER=log` (`backend/.env`).
- If `mail_host` set → `SiteSetting::applyMailConfig()` rewrites
  `mail.default=smtp`, host/port/username/password/encryption/from at boot
  (`backend/app/Models/SiteSetting.php`, `backend/app/Providers/AppServiceProvider.php`).
- Mail failures are caught and logged, never surfaced to the API
  (`LeadController`, `PaymentController`, `MessageController`).

## 9. Update flow (`update.sh`, `backend/app/Filament/Pages/Updates.php`)
No database state — the run log is the state (`backend/storage/logs/update.log`).

| State | Signal |
| --- | --- |
| Never run | no `update.log`; page shows "Never" |
| Succeeded | `update.sh` exit 0 → log written, "Application updated" notification |
| Failed | non-zero exit → stdout+stderr in the log, "Update failed" notification |
| Blocked by local changes | `git pull --ff-only` fails → script exits with the `FORCE=1` hint |
| Not runnable | `update.sh` missing (e.g. a zip deploy) → danger notification, no process started |

Step order in `update.sh`: fetch/pull → composer → `migrate --force` → `optimize:clear` →
`optimize` → frontend install+build → PM2/systemd restart → ownership fix.
Touched: code, `vendor/`, schema, caches, `.output`, the Node process.
Untouched: `backend/.env`, database rows, `backend/storage/app/public` uploads.
