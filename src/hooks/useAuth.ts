import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        if (supabase) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session:', error);
          }
          setUser(session?.user ?? null);
        } else {
          // Check for demo user in localStorage
          const demoUser = localStorage.getItem('demoUser');
          if (demoUser) {
            setUser(JSON.parse(demoUser));
          }
        }
      } catch (error) {
        console.error('Session error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    // Listen for auth changes (only if Supabase is configured)
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = data.subscription;
    } else {
    
    // For demo mode, set localStorage flag
    if (!supabase && !error) {
      localStorage.setItem('demo-auth', 'true');
      setUser(data?.user || null);
    }
    
      // Demo mode - listen for manual auth changes
      const handleStorageChange = () => {
        getCurrentUser().then(({ user }) => {
          setUser(user);
        });
    
    // For demo mode, clear localStorage flag
    if (!supabase) {
      localStorage.removeItem('demo-auth');
      setUser(null);
    }
    
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
};
    
    // For demo mode, set localStorage flag
    if (!supabase && !error) {
      localStorage.setItem('demo-auth', 'true');
      setUser(data?.user || null);
    }
    