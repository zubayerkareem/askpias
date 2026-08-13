-- Adds a rich-text `content` column (Tiptap HTML output, via editor.getHTML())
-- to notes and case_studies, powering the public detail pages
-- (/notes/:slug, /case-studies/:slug). Stored as HTML, not Tiptap JSON, so
-- public pages can render it with dangerouslySetInnerHTML without shipping
-- the Tiptap runtime to read-only visitors.
--
-- No RLS policy changes needed: "notes public read"/"notes authenticated
-- update" and "case_studies public read"/"case_studies authenticated
-- update" (see 0001_init.sql) all use blanket using(true)/with check(true)
-- at the row level, which already covers any column — including this one —
-- on these tables.

alter table public.notes
  add column content text not null default '';

alter table public.case_studies
  add column content text not null default '';
