import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anonymous key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the URL is valid
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Invalid or missing Supabase credentials. Please check your .env file.');
}

// Remove trailing slash and /auth/v1/callback if they exist
const cleanUrl = supabaseUrl ? supabaseUrl.replace(/\/+$/, '').replace('/auth/v1/callback', '') : '';

// Create and export the Supabase client
export const supabase = createClient(cleanUrl, supabaseAnonKey);
