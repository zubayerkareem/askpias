-- Paid lead magnets: admin can require payment (via the EPS gateway) before
-- a lead magnet download unlocks. Payment requirement + price are per-note,
-- mirroring how lead_magnet_file_url already opts a note into the feature.

-- ============================================================
-- notes: payment columns (additive)
-- ============================================================
alter table public.notes
  add column lead_magnet_payment_required boolean not null default false,
  add column lead_magnet_price numeric(10, 2); -- null when payment not required

-- No RLS policy changes needed: "notes public read"/"notes authenticated
-- update" (0001_init.sql) use blanket using(true)/with check(true), which
-- already covers these new columns (same reasoning as 0002/0003).

-- ============================================================
-- lead_magnet_payments
-- ============================================================
-- One row per payment attempt against a lead_magnet_submissions row — kept
-- separate (rather than columns on the submission) because submissions are
-- immutable (0003_lead_magnet.sql) and a visitor may retry after a failed
-- or cancelled attempt, each retry getting its own merchant_transaction_id.
create table public.lead_magnet_payments (
  id                      uuid primary key default gen_random_uuid(),
  submission_id           uuid not null references public.lead_magnet_submissions(id) on delete cascade,
  note_id                 uuid not null references public.notes(id) on delete cascade,
  merchant_transaction_id text not null unique,
  eps_transaction_id      text,
  amount                  numeric(10, 2) not null,
  status                  text not null default 'pending'
                            check (status in ('pending', 'success', 'failed', 'cancelled')),
  financial_entity        text,
  error_message           text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index lead_magnet_payments_submission_id_idx
  on public.lead_magnet_payments (submission_id);

create index lead_magnet_payments_merchant_transaction_id_idx
  on public.lead_magnet_payments (merchant_transaction_id);

alter table public.lead_magnet_payments enable row level security;

-- No anon insert/update policies: every write to this table goes through
-- the server-side EPS integration using the Supabase service-role key
-- (bypasses RLS entirely), never the anon client — payment status must not
-- be forgeable by a visitor holding only the public anon key.
create policy "lead_magnet_payments authenticated read"
  on public.lead_magnet_payments for select
  to authenticated
  using (true);
