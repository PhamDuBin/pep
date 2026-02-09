// =============================================================================
// SUPABASE CLIENT
// =============================================================================
// Supabase client instance for authentication and database operations

import { createClient } from '@supabase/supabase-js';
import { environment } from '@/environments/environment';

// Create Supabase client
export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
