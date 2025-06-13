import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'supplier' | 'client' | 'reseller' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  companyName?: string; // For suppliers
  memberSince?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock users for demonstration
  const mockUsers: Record<string, User> = {
    'supplier@example.com': {
      id: '1',
      email: 'supplier@example.com',
      name: 'TechCorp Electronics',
      role: 'supplier',
      isVerified: true,
      companyName: 'TechCorp Electronics',
      memberSince: '2023-08-15'
    },
    'client@example.com': {
      id: '2',
      email: 'client@example.com',
      name: 'John Smith',
      role: 'client',
      isVerified: true,
      memberSince: '2024-01-10'
    },
    'reseller@example.com': {
      id: '3',
      email: 'reseller@example.com',
      name: 'Sarah Johnson',
      role: 'reseller',
      isVerified: true,
      memberSince: '2023-11-20'
    },
    'admin@example.com': {
      id: '4',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isVerified: true,
      memberSince: '2023-01-01'
    }
  };

  useEffect(() => {
    // Check for stored auth token/user
    const storedUser = localStorage.getItem('droppay_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('droppay_user');
      }
    }
    setIsLoading(false);
  }, []);

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = mockUsers[email.toLowerCase()];
    if (userData && password === 'password') {
      setUser(userData);
      localStorage.setItem('droppay_user', JSON.stringify(userData));
      
      // Redirect to appropriate dashboard
      const dashboardRoute = getDashboardRoute();
      navigate(dashboardRoute);
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const register = async (userData: any, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.fullName || userData.companyName,
      role,
      isVerified: role !== 'supplier', // Suppliers need verification
      companyName: userData.companyName,
      memberSince: new Date().toISOString().split('T')[0]
    };
    
    setUser(newUser);
    localStorage.setItem('droppay_user', JSON.stringify(newUser));
    
    // Redirect based on role
    if (role === 'supplier' && !newUser.isVerified) {
      navigate('/supplier/verification-pending');
    } else {
      const dashboardRoute = getDashboardRoute();
      navigate(dashboardRoute);
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('droppay_user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
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