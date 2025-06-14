import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type User, type UserProfile, type Supplier, type Reseller } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type UserRole = 'supplier' | 'client' | 'reseller' | 'admin' | 'moderator' | 'analyst' | 'support';

interface ExtendedUser extends User {
  profile?: UserProfile;
  supplier?: Supplier;
  reseller?: Reseller;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any, role: UserRole) => Promise<void>;
  isLoading: boolean;
  getDashboardRoute: () => string;
  refreshUser: () => Promise<void>;
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
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.id);
      
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Fetch user data with a simple query
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        setIsLoading(false);
        return;
      }

      if (!userData) {
        console.log('No user data found');
        setIsLoading(false);
        return;
      }

      console.log('User data fetched:', userData);

      let extendedUser: ExtendedUser = { ...userData };

      // Try to fetch additional data but don't fail if it doesn't exist
      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (profileData) {
          extendedUser.profile = profileData;
        }

        // Fetch role-specific data
        if (userData.role === 'supplier') {
          const { data: supplierData } = await supabase
            .from('suppliers')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (supplierData) {
            extendedUser.supplier = supplierData;
          }
        } else if (userData.role === 'reseller') {
          const { data: resellerData } = await supabase
            .from('resellers')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (resellerData) {
            extendedUser.reseller = resellerData;
          }
        }
      } catch (error) {
        console.warn('Error fetching additional profile data:', error);
        // Continue with basic user data
      }

      setUser(extendedUser);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user.id);
    }
  };

  const getDashboardRoute = (userRole?: UserRole): string => {
    const role = userRole || user?.role;
    if (!role) return '/';
    
    switch (role) {
      case 'supplier':
        return '/dashboard/supplier';
      case 'client':
        return '/dashboard/client';
      case 'reseller':
        return '/dashboard/reseller';
      case 'admin':
        return '/dashboard/admin';
      case 'moderator':
      case 'analyst':
      case 'support':
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

      // The auth state change listener will handle the rest
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData: any, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log('Starting registration for role:', role);
      
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        if (authError.message === 'User already registered' || authError.message.includes('user_already_exists')) {
          throw new Error('This email is already registered. Please try logging in instead.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      console.log('Auth user created:', authData.user.id);

      // Wait a moment for the auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create user profile in our users table
      const userProfileData = {
        id: authData.user.id,
        email: userData.email,
        name: userData.fullName || userData.companyName || userData.name,
        role,
        is_verified: role !== 'supplier', // Suppliers need verification
        is_active: true,
        failed_login_attempts: 0,
        is_locked: false,
        two_factor_enabled: false,
      };

      console.log('Creating user profile:', userProfileData);

      const { error: profileError } = await supabase
        .from('users')
        .insert(userProfileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile: ' + profileError.message);
      }

      console.log('User profile created successfully');

      // Create extended profile (optional)
      try {
        const extendedProfileData = {
          user_id: authData.user.id,
          country: userData.country,
          currency: userData.currency || 'USD',
          language: userData.language || 'en',
          timezone: userData.timezone,
          preferences: userData.preferences || {},
          kyc_status: 'pending',
          kyc_documents: [],
          social_profiles: {},
        };

        const { error: extendedProfileError } = await supabase
          .from('user_profiles')
          .insert(extendedProfileData);

        if (extendedProfileError) {
          console.warn('Failed to create extended profile:', extendedProfileError);
        }
      } catch (error) {
        console.warn('Error creating extended profile:', error);
      }

      // Create role-specific records
      try {
        if (role === 'supplier') {
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
            commission_rate: 15.0,
            status: 'pending',
            verification_documents: [],
            store_settings: {},
            performance_metrics: {},
          };

          const { error: supplierError } = await supabase
            .from('suppliers')
            .insert(supplierData);

          if (supplierError) {
            console.warn('Failed to create supplier profile:', supplierError);
          }
        } else if (role === 'reseller') {
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
            performance_metrics: {},
            status: 'active',
          };

          const { error: resellerError } = await supabase
            .from('resellers')
            .insert(resellerData);

          if (resellerError) {
            console.warn('Failed to create reseller profile:', resellerError);
          }
        }
      } catch (error) {
        console.warn('Error creating role-specific profile:', error);
      }

      console.log('Registration completed successfully');
      
      // The auth state change listener will handle navigation
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      throw new Error(error.message || 'Registration failed');
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
      getDashboardRoute,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};