// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);

// Export a default instance for convenience
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
