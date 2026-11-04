# PLAN.md

## Upcoming work
_Empty — nothing scheduled in code._

## TODO / FIXME found in the codebase
None. `grep -r "TODO|FIXME|HACK|XXX"` across the repo (excluding `node_modules`,
`vendor`, `dist`, `.output`) returns only input placeholders and doc strings, e.g.
`placeholder('GTM-XXXXXXX')` in `backend/app/Filament/Pages/ManageSettings.php:75`
and `placeholder('01XXXXXXXXX')` in `src/components/site/ContactForm.tsx:112`.

## Open items verified against the code

### Security / correctness
- **Paid lead-magnet files are public.** `NoteResource` returns `lead_magnet_file_url` on
  both `index` and `show` regardless of `lead_magnet_payment_required`, so the paid gate is
  UI-only and anyone can read the file URL from the JSON. `BookResource` already does this
  correctly (omits `file_url`, exposes `purchasable`); mirror that pattern.
- **No payment webhook.** Only `GET /api/payments/verify` exists, so a visitor who closes the
  return page leaves their lead `pending` and never receives the email until the page is
  reopened. `UddoktaPayService` has no webhook method or route.
- **`locked` notes are unreachable.** `src/routes/notes/$slug.tsx:81` renders a
  "subscribers only" block and there is no subscriber auth, so the content can never be read.
- **Seeded admin password** is `password`, and `db:seed` resets it — safe only because
  production never seeds (`askpias-init.sh` seeds only into an empty `notes` table).

### Missing features / content
- No `/projects` index page — only `src/routes/projects/$slug.tsx`.
- FAQ copy is hardcoded in `src/routes/faqs.tsx` and not editable from admin.
- No newsletter/subscriber model; no public accounts.
- `pages` exposes only `show` and only `about` is wired to a route; a new page slug needs a new
  frontend route (or a `$slug.tsx` catch-all) before it can be published.
- Booking (Cal.com) is not persisted: no `bookings` table.

### Performance / payload
- List endpoints return full article bodies: `NoteResource` includes `content` on `index`, so
  `/api/notes` ships every note's HTML to the notes page and related-post scoring.

### Test coverage
- Only Laravel example tests exist (`backend/tests/Feature/ExampleTest.php`); no frontend test
  runner in `package.json`.
- Nothing covers the payment state machine (`free → pending → paid/failed`), which is the
  riskiest flow in the app.

### Housekeeping
- Dead dependencies: `@supabase/supabase-js` and `@tiptap/*` are in `package.json` but have no
  imports anywhere in `src/`.
- `site_settings` is a singleton row (`SiteSetting::current()` forces `id = 1`), so per-page or
  multi-tenant settings would need a schema change.
- The Docker site image defaults `VITE_API_URL` to `https://api.askpias.com/api` (`Dockerfile`);
  another domain needs build args (they are baked at build time).
