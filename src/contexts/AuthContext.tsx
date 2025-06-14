import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type User } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type UserRole = 'supplier' | 'client' | 'reseller' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any, role: UserRole) => Promise<void>;
  isLoading: boolean;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardRoute = (): string => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'supplier':
        return '/dashboard/supplier';
      case 'client':
        return '/dashboard/client';
      case 'reseller':
        return '/dashboard/reseller';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        
        // Redirect to appropriate dashboard
        const dashboardRoute = getDashboardRoute();
        navigate(dashboardRoute);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        // Handle specific error cases with user-friendly messages
        if (authError.message === 'User already registered' || authError.message.includes('user_already_exists')) {
          throw new Error('This email is already registered. Please try logging in instead.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create user profile in our users table with proper field mapping
      const userProfileData = {
        id: authData.user.id,
        email: userData.email,
        name: userData.fullName || userData.companyName || userData.name,
        role,
        is_verified: role !== 'supplier', // Suppliers need verification
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert(userProfileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      // Create extended profile with proper field mapping
      const extendedProfileData = {
        user_id: authData.user.id,
        country: userData.country,
        currency: userData.currency || 'USD',
        language: userData.language || 'en',
        timezone: userData.timezone,
        address: userData.address ? (typeof userData.address === 'string' ? { full_address: userData.address } : userData.address) : null,
        preferences: userData.preferences || {},
      };

      const { error: extendedProfileError } = await supabase
        .from('user_profiles')
        .insert(extendedProfileData);

      if (extendedProfileError) {
        console.warn('Failed to create extended profile:', extendedProfileError);
      }

      // Create role-specific records
      if (role === 'supplier') {
        // Generate unique store URL
        const baseStoreUrl = userData.companyName?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store';
        const storeUrl = `${baseStoreUrl}-${Date.now().toString().slice(-4)}`;
        
        const supplierData = {
          user_id: authData.user.id,
          company_name: userData.companyName,
          legal_name: userData.legalName || userData.companyName,
          tax_id: userData.taxId,
          business_type: userData.businessType,
          store_url: storeUrl,
          store_name: `${userData.companyName} Store`,
          description: userData.description,
          commission_rate: 15.0, // Default commission rate
          status: 'pending',
          verification_documents: [],
          store_settings: {},
        };

        const { error: supplierError } = await supabase
          .from('suppliers')
          .insert(supplierData);

        if (supplierError) {
          console.warn('Failed to create supplier profile:', supplierError);
        }
      } else if (role === 'reseller') {
        // Generate unique referral code
        const nameCode = userData.fullName?.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 6) || 'USER';
        const referralCode = `${nameCode}${Date.now().toString().slice(-4)}`;
        
        const resellerData = {
          user_id: authData.user.id,
          reseller_type: userData.resellerType || 'solo',
          referral_code: referralCode,
          performance_tier: 'bronze',
          total_sales: 0,
          total_commission: 0,
          team_bonus_earned: 0,
          payout_info: userData.payoutInfo || {},
        };

        const { error: resellerError } = await supabase
          .from('resellers')
          .insert(resellerData);

        if (resellerError) {
          console.warn('Failed to create reseller profile:', resellerError);
        }
      }

      // Fetch the complete user profile
      await fetchUserProfile(authData.user.id);

      // Redirect based on role and verification status
      if (role === 'supplier' && !user?.is_verified) {
        // For suppliers, redirect to a verification pending page or dashboard
        navigate('/dashboard/supplier');
      } else {
        const dashboardRoute = getDashboardRoute();
        navigate(dashboardRoute);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      setSession(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      logout,
      register,
      isLoading,
      getDashboardRoute
    }}>
      {children}
    </AuthContext.Provider>
  );
};