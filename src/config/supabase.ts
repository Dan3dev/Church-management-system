import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://demo-project.supabase.co' && 
  supabaseAnonKey !== 'demo-anon-key';

// Create a mock client if Supabase is not configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Demo user for when Supabase is not configured
const demoUser = {
  id: 'demo-user-id',
  email: 'admin@church.com',
  user_metadata: {
    firstName: 'Admin',
    lastName: 'User',
    role: 'Admin'
  }
};
// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  if (!supabase) {
    // Demo mode - simulate successful signup
    if (email === 'admin@church.com' && password === 'password123') {
      return { 
        data: { 
          user: { ...demoUser, ...userData },
          session: { access_token: 'demo-token', user: demoUser }
        }, 
        error: null 
      };
    }
    return { 
      data: null, 
      error: { message: 'Demo mode: Use admin@church.com / password123' } 
    };
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
    // Demo mode - simulate successful login
    if (email === 'admin@church.com' && password === 'password123') {
      return { 
        data: { 
          user: demoUser,
          session: { access_token: 'demo-token', user: demoUser }
        }, 
        error: null 
      };
    }
    return { 
      data: null, 
      error: { message: 'Demo mode: Use admin@church.com / password123' } 
    };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    // Demo mode - simulate successful logout
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) {
    // Demo mode - return demo user if logged in
    const isLoggedIn = localStorage.getItem('demo-auth') === 'true';
    return { 
      user: isLoggedIn ? demoUser : null, 
      error: null 
    };
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };