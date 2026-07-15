import { createClient } from '@supabase/supabase-js';

// During Next.js build phase, environment variables might not be populated yet.
// To prevent build-time crashes, we provide safe placeholder fallbacks.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1YW1mZnF5enBpdm5wbnFtaHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDkwNTcsImV4cCI6MjA5OTYyNTA1N30.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});
