import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

// Create the authentication context
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for user on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        // Check if there is an active session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          setUser(session.user);
          // Fetch user profile
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error checking auth state:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', { event, session: !!session, user: !!session?.user });
        
        // Always ensure loading is set to false when auth state changes
        setLoading(false);
        
        if (session?.user) {
          console.log('👤 User session found:', session.user.email);
          setUser(session.user);
          // Fetch user profile
          await fetchUserProfile(session.user.id);
          
          // Redirect based on user progress on login/signup events
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            console.log('🚀 User signed in, checking progress...');
            // Use window.location to ensure a full page reload
            // This is more reliable across different auth methods
            if (!window.location.pathname.includes('/subscription') && 
                !window.location.pathname.includes('/payment') && 
                !window.location.pathname.includes('/instagram-connect') && 
                !window.location.pathname.includes('/requirements-form') &&
                !window.location.pathname.includes('/dashboard') &&
                !window.location.pathname.includes('/staff') &&
                !window.location.pathname.includes('/admin')) {
              // Wait a bit for profile to be fetched, then redirect
              setTimeout(() => {
                const nextStep = getNextUserFlowStep();
                console.log('🚀 Redirecting to next step:', nextStep);
                window.location.href = nextStep;
              }, 100);
            }
          }
        } else {
          console.log('🚫 No user session');
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Clean up subscription when component unmounts
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createUserProfile(userId);
        }
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Create user profile
  const createUserProfile = async (userId, fullName = null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            full_name: fullName || user?.user_metadata?.full_name || null,
            role: 'user'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    if (!profile) return false;
    // Check if user has Instagram account connected and requirements filled
    return profile.instagram_connected && profile.requirements_completed;
  };

  // Determine the next step in user flow based on profile progress
  const getNextUserFlowStep = () => {
    if (!profile) return '/subscription';
    
    // Check if user has completed payment (you might need to add a payment_completed field)
    // For now, we'll assume they need to go through the flow
    if (!profile.requirements_completed) {
      if (!profile.instagram_connected) {
        return '/instagram-connect';
      }
      return '/requirements-form';
    }
    
    // If everything is completed, redirect to dashboard
    return '/dashboard';
  };

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      console.log('🔧 AuthContext: signInWithEmail called with email:', email);
      
      // Check if Supabase client is properly initialized
      if (!supabase || !supabase.auth) {
        console.error('❌ Supabase client not properly initialized');
        return { data: null, error: { message: 'Authentication service unavailable' } };
      }
      
      console.log('🔧 AuthContext: Calling supabase.auth.signInWithPassword');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('🔧 AuthContext: Supabase response:', { data, error });
      
      if (error) {
        console.error('❌ AuthContext: Supabase error:', error);
        throw error;
      }
      
      console.log('✅ AuthContext: Sign in successful, returning data');
      return { data, error: null };
    } catch (error) {
      console.error('💥 AuthContext: Sign in error:', error);
      return { data: null, error };
    }
  };



  // Sign up with email and password
  const signUpWithEmail = async (email, password, fullName = null) => {
    try {
      // Check if Supabase client is properly initialized
      if (!supabase || !supabase.auth) {
        console.error('Supabase client not properly initialized');
        return { data: null, error: { message: 'Authentication service unavailable' } };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    profile,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    createUserProfile,
    fetchUserProfile,
    hasCompletedOnboarding,
    getNextUserFlowStep
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
