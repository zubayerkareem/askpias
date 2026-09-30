-- Switch paid lead magnets from the EPS gateway to UddoktaPay.
-- merchant_transaction_id stays as our own per-attempt reference (sent to
-- UddoktaPay in the charge metadata); the EPS-specific columns are replaced
-- with what UddoktaPay's verify-payment API returns.

alter table public.lead_magnet_payments
  drop column eps_transaction_id,
  drop column financial_entity,
  add column invoice_id             text unique, -- UddoktaPay invoice_id, set on verify
  add column payment_method         text,        -- bkash / nagad / rocket / upay / bank
  add column sender_number          text,
  add column gateway_transaction_id text;
