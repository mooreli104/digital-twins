// Supabase Database Configuration
// Purpose: Initialize Supabase client for auth and data persistence

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials (use environment variables)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  supabase
};
