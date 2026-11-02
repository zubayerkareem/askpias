# PLAN.md

## Upcoming work
_Empty — nothing scheduled in code._

## TODO / FIXME found in the codebase
None. `grep -r "TODO|FIXME|HACK|XXX"` across the repo (excluding `node_modules`,
`vendor`, `dist`, `.output`) returns only input placeholders and doc strings, e.g.
`placeholder('GTM-XXXXXXX')` in `backend/app/Filament/Pages/ManageSettings.php:75`
and `placeholder('01XXXXXXXXX')` in `src/components/site/ContactForm.tsx:112`.

## Open items observed while reading (not marked as TODO in code)
- No payment webhook endpoint — `backend/routes/api.php` only has `GET /api/payments/verify`.
- No `/projects` index page — only `src/routes/projects/$slug.tsx`.
- `locked` notes render an unopenable "subscribers only" block
  (`src/routes/notes/$slug.tsx:81`); no subscriber auth exists.
- FAQ copy hardcoded in `src/routes/faqs.tsx`.
- Dead dependencies: `@supabase/supabase-js`, `@tiptap/*` in `package.json`, unused in `src/`.
- Only Laravel example tests exist (`backend/tests/Feature/ExampleTest.php`); no frontend
  test runner configured.
- Seeded admin password is `password` (`backend/database/seeders/DatabaseSeeder.php`).
