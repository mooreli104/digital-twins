// Supabase Database Configuration
// Purpose: Initialize Supabase client for auth and data persistence

import { createClient } from '@supabase/supabase-js';

// Supabase credentials (use environment variables)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// TODO: Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export {supabase}
