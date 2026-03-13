/**
 * lib/supabase.ts
 * Singleton Supabase JS client for the Next.js frontend.
 * Uses only the public NEXT_PUBLIC_ keys — safe to expose in the browser.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
