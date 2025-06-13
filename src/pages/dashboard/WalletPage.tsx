import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Banknote, 
  TrendingUp, 
  Shield, 
  Plus, 
  Send, 
  Download,
  Eye,
  EyeOff,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const WalletPage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const walletStats = [
    {
      title: 'Available Balance',
      value: showBalance ? '$24,850.32' : '••••••',
      change: '+12.5%',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending',
      value: showBalance ? '$1,245.60' : '••••••',
      change: '+5.2%',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'This Month',
      value: showBalance ? '$8,940.18' : '••••••',
      change: '+18.3%',
      icon: ArrowUpRight,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Earned',
      value: showBalance ? '$156,823.45' : '••••••',
      change: '+24.1%',
      icon: Banknote,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'received',
      description: 'Commission from Q1 Campaign',
      amount: '+$1,250.00',
      date: '2024-01-15 10:30 AM',
      status: 'completed',
      category: 'commission'
    },
    {
      id: 2,
      type: 'sent',
      description: 'Team Bonus Payment',
      amount: '-$485.00',
      date: '2024-01-14 3:45 PM',
      status: 'completed',
      category: 'bonus'
    },
    {
      id: 3,
      type: 'received',
      description: 'Product Sale Commission',
      amount: '+$875.50',
      date: '2024-01-13 1:20 PM',
      status: 'pending',
      category: 'commission'
    },
    {
      id: 4,
      type: 'sent',
      description: 'Withdrawal to Bank',
      amount: '-$2,000.00',
      date: '2024-01-12 9:15 AM',
      status: 'completed',
      category: 'withdrawal'
    },
    {
      id: 5,
      type: 'received',
      description: 'Referral Bonus',
      amount: '+$125.00',
      date: '2024-01-11 4:10 PM',
      status: 'completed',
      category: 'referral'
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'bank',
      name: 'Chase Business Account',
      details: '**** **** **** 4521',
      isDefault: true,
      status: 'verified'
    },
    {
      id: 2,
      type: 'paypal',
      name: 'PayPal Account',
      details: 'john@example.com',
      isDefault: false,
      status: 'verified'
    },
    {
      id: 3,
      type: 'card',
      name: 'Visa Debit Card',
      details: '**** **** **** 8923',
      isDefault: false,
      status: 'pending'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
    { id: 'methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const getTransactionIcon = (type: string) => {
    return type === 'received' ? ArrowDownLeft : ArrowUpRight;
  };

  const getTransactionColor = (type: string) => {
    return type === 'received' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'commission': return 'bg-blue-100 text-blue-800';
      case 'bonus': return 'bg-purple-100 text-purple-800';
      case 'referral': return 'bg-green-100 text-green-800';
      case 'withdrawal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Wallet</h1>
            <p className="text-gray-600">Manage your earnings, payments, and financial security</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showBalance ? 'Hide' : 'Show'} Balance</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download size={16} />
              <span>Withdraw</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Send size={16} />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Wallet Assistant AI"
            description="I help optimize your earnings, track expenses, and manage payment security"
          />
        </div>

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {walletStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`${stat.color}`} size={24} />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpRight size={16} />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Balance Chart */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Balance History</h2>
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>
                  
                  {/* Simplified Chart Representation */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Earnings</span>
                      <span className="font-medium text-green-600">$8,940.18</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Withdrawals</span>
                      <span className="font-medium text-blue-600">$3,200.00</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fees</span>
                      <span className="font-medium text-gray-600">$89.42</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gray-600 h-3 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Send className="text-white" size={16} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">Send Money</h3>
                        <p className="text-sm text-gray-600">Transfer to team or clients</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <Download className="text-white" size={16} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">Withdraw Funds</h3>
                        <p className="text-sm text-gray-600">To your bank account</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Plus className="text-white" size={16} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">Add Payment Method</h3>
                        <p className="text-sm text-gray-600">Bank or card</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {recentTransactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${transaction.type === 'received' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Icon className={getTransactionColor(transaction.type)} size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(transaction.category)}`}>
                              {transaction.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                            {transaction.amount}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={16} />
                  <span>Add Method</span>
                </button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <CreditCard className="text-gray-600" size={24} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{method.name}</h3>
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(method.status)}`}>
                        {method.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="text-green-600" size={24} />
                    <h3 className="font-semibold text-green-800">Account Security</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Two-Factor Authentication:</span>
                      <span className="font-medium text-green-800">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Email Verification:</span>
                      <span className="font-medium text-green-800">Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Phone Verification:</span>
                      <span className="font-medium text-green-800">Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">KYC Status:</span>
                      <span className="font-medium text-green-800">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Transaction Limits</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Daily Withdrawal:</span>
                        <span className="font-medium">$10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Transfer:</span>
                        <span className="font-medium">$50,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Security Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                        Change Password
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                        Update 2FA Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                        Freeze Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;