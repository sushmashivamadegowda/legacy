import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if variables are missing OR still placeholders
const isConfigured = supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your_supabase') &&
    !supabaseAnonKey.includes('your_supabase');

if (!isConfigured) {
    console.warn('Supabase credentials missing or invalid. Please update your .env file with real values from the Supabase Dashboard.')
}

// Only create the client if we have real credentials
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: { message: "Supabase not configured" } }),
            signUp: async () => ({ error: { message: "Supabase not configured" } }),
            signOut: async () => ({ error: null })
        }
    };
