import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Users, Wallet } from 'lucide-react';
import AgentSlot from '../components/AgentSlot';

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Bank-grade security with multi-layer encryption'
    },
    {
      icon: Zap,
      title: 'AI-Powered Tools',
      description: 'Intelligent campaign creation and optimization'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with suppliers and clients worldwide'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Real-time insights and performance tracking'
    }
  ];

  const roles = [
    {
      title: 'Join as Supplier',
      description: 'Expand your business reach with our global marketplace',
      icon: Wallet,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      link: '/register/supplier'
    },
    {
      title: 'Buy as Client',
      description: 'Access premium products with transparent pricing',
      icon: Shield,
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800',
      link: '/register/client'
    },
    {
      title: 'Earn as Reseller',
      description: 'Build your network and earn with our reseller program',
      icon: Users,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'hover:from-purple-700 hover:to-purple-800',
      link: '/register/reseller'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fintech
            </span>{' '}
            Revolution
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Connect suppliers, clients, and resellers in a seamless ecosystem powered by 
            advanced AI technology. Scale your business with intelligent tools and global reach.
          </p>

          {/* AI Agent Spotlight */}
          <div className="max-w-md mx-auto mb-12">
            <AgentSlot 
              agentName="Jarvis Home AI"
              description="Your intelligent assistant ready to guide you through the platform"
            />
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <Link
                  key={index}
                  to={role.link}
                  className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{role.title}</h3>
                  <p className="text-gray-600 mb-6">{role.description}</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                    Get Started
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DropPay?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of financial technology with our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using DropPay to scale their operations
          </p>
          <Link
            to="/register/reseller"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
          >
            Start Your Journey
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;