// Server-only Supabase client using the service role key — bypasses RLS.
// Never import this from client components; only from createServerFn
// handlers (see src/server/eps-payment.ts). Payment state (who paid, how
// much, EPS's verified status) must not be writable by anyone holding only
// the public anon key.
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const supabaseUrl = process.env["VITE_SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — required for server-side payment writes.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
