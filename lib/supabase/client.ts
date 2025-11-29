// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
  }
  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
