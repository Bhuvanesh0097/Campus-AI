import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isConfigured = () => {
    return supabaseUrl && supabaseUrl.length > 10 && supabaseUrl.startsWith('http');
};

// Only create the client if configured, otherwise create a mock
let _supabase = null;

export const getSupabase = () => {
    if (!_supabase && isConfigured()) {
        _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return _supabase;
};

// For backwards compatibility — returns null if not configured
export const supabase = isConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null;
