import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, Users, Settings, Zap, BarChart3, UserPlus, Store, ShoppingCart, Package, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // If no user is authenticated, show minimal navigation
  if (!user) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DropPay
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Dynamic navigation based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'supplier':
        return [
          { path: '/dashboard/supplier', label: 'Dashboard', icon: BarChart3 },
          { path: '/supplier/portal', label: 'My Store', icon: Store },
          { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
          { path: '/tools/simulator', label: 'Calculator', icon: Settings },
        ];
      
      case 'client':
        return [
          { path: '/dashboard/client', label: 'Dashboard', icon: BarChart3 },
          { path: '/marketplace', label: 'Shop', icon: ShoppingCart },
          { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
        ];
      
      case 'admin':
        return [
          { path: '/dashboard/admin', label: 'Control Center', icon: BarChart3 },
          { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
          { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
        ];
      
      default: // reseller
        return [
          { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
          { path: '/dashboard/reseller', label: 'Dashboard', icon: BarChart3 },
          { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
          { path: '/dashboard/team', label: 'Team', icon: Users },
          { path: '/dashboard/collaboration', label: 'Collaboration', icon: UserPlus },
          { path: '/tools/campaign-studio', label: 'Studio', icon: Zap },
          { path: '/tools/simulator', label: 'Simulator', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DropPay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
              <User size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                ({user.role})
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile User Info */}
            <div className="px-4 py-3 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name} ({user.role})
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;