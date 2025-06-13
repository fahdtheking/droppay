import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, ShoppingCart, Users, Shield } from 'lucide-react';

const RegisterPage = () => {
  const registrationOptions = [
    {
      title: 'Join as Supplier',
      description: 'Create your marketplace and sell products globally',
      icon: Store,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      link: '/register/supplier',
      features: ['Create your own marketplace', 'Manage inventory & orders', 'Set commission rates', 'Track reseller performance']
    },
    {
      title: 'Shop as Client',
      description: 'Access premium products with transparent pricing',
      icon: ShoppingCart,
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800',
      link: '/register/client',
      features: ['Browse verified suppliers', 'Track orders & deliveries', 'Earn reward points', 'Premium customer support']
    },
    {
      title: 'Earn as Reseller',
      description: 'Sell products and earn commissions on every sale',
      icon: Users,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'hover:from-purple-700 hover:to-purple-800',
      link: '/register/reseller',
      features: ['Earn on product sales', 'Build your network', 'Marketing tools & AI', 'Team collaboration']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DP</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DropPay
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join DropPay</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role and start your journey in our AI-powered fintech ecosystem
          </p>
        </div>

        {/* Registration Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {registrationOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Link
                key={index}
                to={option.link}
                className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white" size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{option.title}</h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Admin Access */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Platform Administrator</h3>
                <p className="text-gray-600">Manage platform operations and oversight</p>
              </div>
            </div>
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Shield size={16} />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;