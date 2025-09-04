import { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
export const FirebaseAuthContext = createContext(null);

// Custom hook to use the auth context
export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

// Auth provider component
export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for user on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Firebase auth state change:', { 
        user: !!firebaseUser, 
        email: firebaseUser?.email 
      });
      setLoading(false);
      if (firebaseUser) {
        console.log('👤 Firebase user found:', firebaseUser.email);
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        console.log('🚫 No Firebase user');
        setUser(null);
        setProfile(null);
      }
    });
    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  // Child component for redirect logic
  function AuthRedirector() {
    const navigate = useNavigate();
    useEffect(() => {
      if (!user || loading) return;
      if (!profile) {
        console.log('[User Type] Role not found in profile:', profile);
        return;
      }
      console.log(`[User Type] Logged in as: ${profile.role}`);
      const nextStep = getNextUserFlowStep();
      const currentPath = window.location.pathname;
      console.log('🚀 Current path:', currentPath);
      console.log('🚀 Next step should be:', nextStep);
      // Don't redirect if we're already on a role-specific dashboard (including sub-routes) or diagnostic page
      if (currentPath.startsWith('/admin-dashboard') || currentPath.startsWith('/staff-dashboard') || currentPath === '/diagnostic') {
        console.log('✅ Already on role-specific dashboard or diagnostic page:', currentPath);
        return;
      }
      // Prevent redirect loop when user is navigating to /payment or /instagram-connect
      if (currentPath === '/payment' || currentPath === '/instagram-connect') {
        console.log(`✅ User is on ${currentPath} page, no redirect needed`);
        return;
      }
      // Only redirect if we're not already on the correct page
      if (currentPath !== nextStep) {
        console.log('🚀 Redirecting from', currentPath, 'to', nextStep);
        navigate(nextStep, { replace: true });
      } else {
        console.log('✅ Already on correct page:', currentPath);
      }
    }, [profile, user, loading, navigate]);
    return null;
  }

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId) => {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const profileSnap = await getDoc(profileRef);
      console.log('[fetchUserProfile] Firestore doc exists:', profileSnap.exists());
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        console.log('[fetchUserProfile] Profile data from Firestore:', data);
        if (data && typeof data === 'object') {
          setProfile(data);
        } else {
          console.warn('[fetchUserProfile] Profile data is undefined or not an object:', data);
          setProfile(null);
        }
      } else {
        // If profile doesn't exist, create one
        console.warn('[fetchUserProfile] Profile does not exist, creating new profile for user:', userId);
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('[fetchUserProfile] Error:', error);
      setProfile(null);
    }
  };

  // Create user profile
  const createUserProfile = async (userId, fullName = null) => {
    try {
      const resolvedFullName = fullName || user?.displayName || null;
      const profileData = {
        id: userId,
        full_name: resolvedFullName,
        display_name: resolvedFullName,
        email: user?.email || null,
        role: 'user',
        instagram_connected: false,
        requirements_completed: false,
        payment_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const profileRef = doc(db, 'profiles', userId);
      await setDoc(profileRef, profileData);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      await updateDoc(profileRef, updatedData);
      
      // Update local profile state
      setProfile(prev => ({ ...prev, ...updatedData }));
      return updatedData;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    if (!profile) return false;
    // Check if user has completed payment, Instagram connection, and requirements
    // Handle missing fields gracefully (treat undefined as false)
    const paymentCompleted = profile.payment_completed === true;
    const instagramConnected = profile.instagram_connected === true;
    const requirementsCompleted = profile.requirements_completed === true;
    
    console.log('🔍 Onboarding check:', {
      paymentCompleted,
      instagramConnected, 
      requirementsCompleted,
      allCompleted: paymentCompleted && instagramConnected && requirementsCompleted
    });
    
    return paymentCompleted && instagramConnected && requirementsCompleted;
  };

  // Get user completion status for debugging
  const getUserCompletionStatus = () => {
    if (!profile) return { completed: false, steps: {} };
    
    const steps = {
      payment_completed: profile.payment_completed || false,
      instagram_connected: profile.instagram_connected || false,
      requirements_completed: profile.requirements_completed || false
    };
    
    return {
      completed: hasCompletedOnboarding(),
      steps,
      nextStep: getNextUserFlowStep()
    };
  };

  // Role-based access control
  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  const isStaff = () => {
    return profile?.role === 'staff' || profile?.role === 'admin';
  };

  const isUser = () => {
    return profile?.role === 'user';
  };

  // Update user role (admin only)
  const updateUserRole = async (userId, newRole) => {
    try {
      if (!isAdmin()) {
        throw new Error('Only admins can update user roles');
      }
      
      const result = await firebaseDb.updateProfile(userId, { role: newRole });
      return result;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  // Determine the next step in user flow based on profile progress
  const getNextUserFlowStep = () => {
    if (!profile) return '/subscription';
    // Don't redirect if we're on the diagnostic page
    if (window.location.pathname === '/diagnostic') {
      console.log('🔧 On diagnostic page, not redirecting');
      return '/diagnostic';
    }
    // If user is admin, skip all onboarding checks and go directly to admin dashboard
    if (profile.role === 'admin') {
      console.log('👑 Admin user detected, redirecting to admin dashboard (no onboarding checks)');
      return '/admin-dashboard';
    }
    // Staff role check
    if (profile.role === 'staff') {
      console.log('👥 Staff user detected, redirecting to staff dashboard');
      return '/staff-dashboard';
    }
    // Onboarding checks for normal users
    const paymentCompleted = profile.payment_completed === true;
    const instagramConnected = profile.instagram_connected === true;
    const requirementsCompleted = profile.requirements_completed === true;
    console.log('🔍 Checking user progress:', {
      payment_completed: paymentCompleted,
      instagram_connected: instagramConnected,
      requirements_completed: requirementsCompleted,
      raw_values: {
        payment_completed: profile.payment_completed,
        instagram_connected: profile.instagram_connected,
        requirements_completed: profile.requirements_completed
      }
    });
    // If everything is completed, redirect to dashboard
    if (paymentCompleted && instagramConnected && requirementsCompleted) {
      console.log('✅ User has completed all steps, redirecting to dashboard');
      return '/dashboard';
    }
    // Check payment completion first
    if (!paymentCompleted) {
      console.log('💳 Payment not completed, redirecting to subscription');
      return '/subscription';
    }
    // Check Instagram connection
    if (!instagramConnected) {
      console.log('📱 Instagram not connected, redirecting to Instagram connect');
      return '/instagram-connect';
    }
    // Check requirements completion
    if (!requirementsCompleted) {
      console.log('📋 Requirements not completed, redirecting to requirements form');
      return '/requirements-form';
    }
    // Fallback to dashboard
    return '/dashboard';
  };

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      console.log('🔧 FirebaseAuthContext: signInWithEmail called with email:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ FirebaseAuthContext: Sign in successful');
      return { data: userCredential.user, error: null };
    } catch (error) {
      console.error('💥 FirebaseAuthContext: Sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email, password, fullName = null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (fullName) {
        await updateFirebaseProfile(userCredential.user, {
          displayName: fullName
        });
      }

      // Proactively create Firestore profile with provided full name to avoid null
      try {
        await setDoc(doc(db, 'profiles', userCredential.user.uid), {
          id: userCredential.user.uid,
          full_name: fullName || userCredential.user.displayName || null,
          display_name: fullName || userCredential.user.displayName || null,
          email: email,
          role: 'user',
          instagram_connected: false,
          requirements_completed: false,
          payment_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (profileErr) {
        console.warn('[signUpWithEmail] Could not proactively create profile, will rely on fetchUserProfile:', profileErr);
      }

      return { data: userCredential.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setProfile(null);
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
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updateUserPassword = async (newPassword) => {
    try {
      setLoading(true);
      await updatePassword(user, newPassword);
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
    signOut: signOutUser,
    resetPassword,
    updatePassword: updateUserPassword,
    updateProfile,
    createUserProfile,
    fetchUserProfile,
    hasCompletedOnboarding,
    getNextUserFlowStep,
    getUserCompletionStatus,
    // Role-based access control
    isAdmin,
    isStaff,
    isUser,
    updateUserRole
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      <AuthRedirector />
      {children}
    </FirebaseAuthContext.Provider>
  );
}
