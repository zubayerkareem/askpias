-- askpias.com backend schema
-- Run this once in the Supabase SQL editor for a fresh project.

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ============================================================
-- Shared updated_at trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- notes
-- ============================================================
create table public.notes (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  excerpt        text not null,
  category       text not null,
  image_url      text,                     -- null => client falls back to dummyImage(slug)
  featured       boolean not null default false,
  locked         boolean not null default false,
  comment_count  integer not null default 0,
  published_at   date not null default current_date,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function set_updated_at();

alter table public.notes enable row level security;

create policy "notes public read"
  on public.notes for select
  to anon, authenticated
  using (true);

create policy "notes authenticated write"
  on public.notes for insert
  to authenticated
  with check (true);

create policy "notes authenticated update"
  on public.notes for update
  to authenticated
  using (true) with check (true);

create policy "notes authenticated delete"
  on public.notes for delete
  to authenticated
  using (true);

-- ============================================================
-- case_studies
-- ============================================================
create table public.case_studies (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  summary     text not null,
  tags        text[] not null default '{}',
  image_url   text,                        -- null => client falls back to dummyImage(slug)
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger case_studies_set_updated_at
  before update on public.case_studies
  for each row execute function set_updated_at();

alter table public.case_studies enable row level security;

create policy "case_studies public read"
  on public.case_studies for select
  to anon, authenticated
  using (true);

create policy "case_studies authenticated write"
  on public.case_studies for insert
  to authenticated
  with check (true);

create policy "case_studies authenticated update"
  on public.case_studies for update
  to authenticated
  using (true) with check (true);

create policy "case_studies authenticated delete"
  on public.case_studies for delete
  to authenticated
  using (true);

-- ============================================================
-- messages ("Ask me anything" submissions)
-- ============================================================
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  question    text not null check (char_length(btrim(question)) > 0),
  phone       text not null check (phone ~ '^(?:\+?880|0)1[3-9]\d{8}$'),
  email       text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Anonymous visitors may submit, but never read/update/delete.
create policy "messages public insert"
  on public.messages for insert
  to anon, authenticated
  with check (true);

create policy "messages authenticated read"
  on public.messages for select
  to authenticated
  using (true);

create policy "messages authenticated update"
  on public.messages for update
  to authenticated
  using (true) with check (true);

create policy "messages authenticated delete"
  on public.messages for delete
  to authenticated
  using (true);

-- ============================================================
-- site_settings (singleton row: hero image + case-studies iframe)
-- ============================================================
create table public.site_settings (
  id                        smallint primary key default 1 check (id = 1), -- enforces a single row
  hero_image_url            text,
  case_studies_iframe_url   text,
  updated_at                timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function set_updated_at();

alter table public.site_settings enable row level security;

create policy "site_settings public read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings authenticated update"
  on public.site_settings for update
  to authenticated
  using (true) with check (true);

-- No public/authenticated insert or delete policy: the single row is
-- created once by the seed below and only ever UPDATEd afterwards.

-- ============================================================
-- Storage bucket for hero photo / note & case-study cover images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "media authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "media authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- Recommended object-path convention (enforced by app code, not by policy):
--   media/hero/<timestamp>-<filename>
--   media/notes/<slug>-<timestamp>-<filename>
--   media/case-studies/<slug>-<timestamp>-<filename>

-- ============================================================
-- Seed data — migrates the 6 hardcoded notes + 4 hardcoded case studies
-- so the live site doesn't go blank on cutover. image_url left NULL on
-- purpose: the client falls back to dummyImage(slug), matching today's
-- picsum placeholder behavior exactly.
-- ============================================================
insert into public.notes
  (slug, title, excerpt, category, featured, locked, comment_count, published_at, sort_order)
values
  ('ads-budget-questions',
   '5 questions you must answer before spending on ads',
   'Most businesses start with ads while the real problem sits in the offer and the message. Answer these five questions and you''ll waste far less budget.',
   'Strategy', true, false, 8, '2026-07-12', 0),
  ('traffic-no-buyers',
   'Traffic is coming to your landing page but nobody buys — why?',
   'Low conversion is rarely a design problem. It''s usually a lack of clarity and trust. Explained with real examples.',
   'Conversion', false, false, 5, '2026-06-28', 10),
  ('roas-framework',
   'A practical framework for increasing ROAS on Meta Ads',
   'Creative testing, audience structure and budget scaling — the three-step system I use with every client.',
   'Performance marketing', true, false, 4, '2026-06-14', 20),
  ('positioning-not-logo',
   'Brand positioning is not your logo',
   'Positioning is the space you own in your customer''s mind. A simple explanation with real brand examples.',
   'Branding', false, true, 0, '2026-05-30', 30),
  ('existing-customers',
   'Your existing customers are more profitable than new ones',
   'How to design a repeat purchase system and which metrics actually deserve your attention.',
   'Retention', false, false, 3, '2026-05-18', 40),
  ('systems-not-tricks',
   'Drop the marketing tricks, build a system',
   'Hacks give you temporary spikes. Systems give you predictable growth. Here''s the difference.',
   'Systems', false, false, 6, '2026-05-02', 50);

insert into public.case_studies (slug, name, summary, tags, sort_order)
values
  ('zarin-lifestyle', 'Zarin Lifestyle',
   'Meta Ads spend kept climbing while sales stayed flat. We redid the audience research, repositioned the offer and completely rebuilt the landing page and checkout funnel.',
   array['E-commerce','Fashion','Meta Ads'], 0),
  ('dhaka-dental-studio', 'Dhaka Dental Studio',
   'Leads were coming in but rarely converted into appointments. We built a full lead system with call scripts, follow-up automation and local search campaigns.',
   array['Service','Healthcare','Lead Generation'], 10),
  ('ledgerly', 'Ledgerly',
   'Brand positioning was unclear. We rebuilt the messaging framework, launched a content funnel and Google Ads, and optimised the trial-to-paid journey.',
   array['B2B','SaaS','Brand Positioning'], 20),
  ('green-basket', 'Green Basket',
   'Repeat purchases were low. We increased customer lifetime value with a retention system, bundle offers and retargeting sequences.',
   array['Retail','FMCG','Retention'], 30);

insert into public.site_settings (id, hero_image_url, case_studies_iframe_url)
values (
  1,
  null, -- null => client keeps rendering the existing static /pias-islam.jpg until admin uploads one
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2409934066138901%2F&show_text=false&width=476&t=0'
)
on conflict (id) do nothing;
