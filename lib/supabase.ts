import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser Supabase client for the reaction wall (/reservada).
 *
 * It is `null` when the two `NEXT_PUBLIC_SUPABASE_*` env vars are missing, so the UI can
 * degrade gracefully (buttons disabled, counts dashed) and `next dev`/`next build` never
 * crash on a machine without a Supabase project configured. The anon key is public by
 * design — writes are only possible through the `increment_reaction` RPC, guarded by RLS.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
