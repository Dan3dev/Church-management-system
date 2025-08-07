import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create a mock client if Supabase is not configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) {
    return { user: null, error: { message: 'Supabase not configured' } };
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};