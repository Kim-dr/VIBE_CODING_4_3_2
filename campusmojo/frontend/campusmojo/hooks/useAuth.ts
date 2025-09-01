import { useState, useEffect } from 'react';
import { authUtils, profileUtils } from '../utils/supabase';
import { User, Profile, LoadingState } from '../types';

interface AuthState extends LoadingState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const user = await authUtils.getCurrentUser();
      if (user) {
        const { data: profile } = await profileUtils.getProfile(user.id);
        setAuthState({
          user,
          profile,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed',
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data: user, error } = await authUtils.signIn(email, password);
      if (error) throw new Error(error);
      if (!user) throw new Error('Sign in failed');

      const { data: profile } = await profileUtils.getProfile(user.id);
      
      setAuthState({
        user,
        profile,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data: user, error } = await authUtils.signUp(email, password);
      if (error) throw new Error(error);
      if (!user) throw new Error('Sign up failed');

      setAuthState(prev => ({ ...prev, loading: false, error: null }));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      await authUtils.signOut();
      
      setAuthState({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!authState.user) return { success: false, error: 'No user authenticated' };

    try {
      const { data: profile, error } = await profileUtils.updateProfile(authState.user.id, updates);
      if (error) throw new Error(error);
      if (!profile) throw new Error('Profile update failed');

      setAuthState(prev => ({ ...prev, profile }));
      return { success: true, profile };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    checkAuth,
  };
};
