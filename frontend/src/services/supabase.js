// Supabase Client Configuration
// Purpose: Initialize Supabase for authentication and direct queries
//
// Note: Most data flow goes through Node.js backend
// This is primarily for auth and occasional direct queries

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// TODO: Initialize Supabase client
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signIn(email, password) {
  // TODO: Implement Supabase auth sign in
}

export async function signUp(email, password) {
  // TODO: Implement Supabase auth sign up
}

export async function signOut() {
  // TODO: Implement Supabase auth sign out
}

export async function getCurrentUser() {
  // TODO: Get current authenticated user
}
