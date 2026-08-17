-- Lead magnet feature: an optional downloadable file attached to a Note,
-- gated behind a name/email/phone capture form (soft gate — file lives in
-- the existing public `media` bucket; the app hides the download link
-- until the visitor submits the form). No bucket/RLS changes needed — see
-- 0001_init.sql's `media` policies, already public-read with no folder
-- scoping, and none is being added here.

-- ============================================================
-- notes: lead magnet columns (additive)
-- ============================================================
-- No `enabled` flag: presence of lead_magnet_file_url is the on/off
-- signal, matching how `image_url` already uses null as "unset" on this
-- same table (see 0001_init.sql).
alter table public.notes
  add column lead_magnet_file_url  text,  -- null => no lead magnet attached
  add column lead_magnet_cta_label text;  -- null => client falls back to "Download"

-- No RLS policy changes needed: "notes public read"/"notes authenticated
-- update" (0001_init.sql) use blanket using(true)/with check(true), which
-- already covers these new columns (same reasoning as 0002_content.sql).

-- ============================================================
-- lead_magnet_submissions
-- ============================================================
create table public.lead_magnet_submissions (
  id          uuid primary key default gen_random_uuid(),
  note_id     uuid not null references public.notes(id) on delete cascade,
  name        text not null check (char_length(btrim(name)) > 0),
  email       text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone       text not null check (phone ~ '^(?:\+?880|0)1[3-9]\d{8}$'),
  created_at  timestamptz not null default now()
);

create index lead_magnet_submissions_note_id_idx
  on public.lead_magnet_submissions (note_id);

alter table public.lead_magnet_submissions enable row level security;

-- Anonymous visitors may submit, but never read/update/delete — mirrors
-- "messages" exactly (0001_init.sql).
create policy "lead_magnet_submissions public insert"
  on public.lead_magnet_submissions for insert
  to anon, authenticated
  with check (true);

create policy "lead_magnet_submissions authenticated read"
  on public.lead_magnet_submissions for select
  to authenticated
  using (true);

create policy "lead_magnet_submissions authenticated delete"
  on public.lead_magnet_submissions for delete
  to authenticated
  using (true);

-- No update policy: submissions are immutable records (no "is_read" style
-- mutable field like `messages` has). Delete is included for admin spam
-- cleanup parity with every other table in this schema, even though the
-- current admin UI doesn't wire a delete button yet — trivial to add later.
