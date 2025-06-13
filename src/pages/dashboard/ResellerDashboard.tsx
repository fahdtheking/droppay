import React from 'react';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, Plus, Share2 } from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const ResellerDashboard = () => {
  const stats = [
    {
      title: 'Total Earnings',
      value: '$12,458',
      change: '+23.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Campaigns',
      value: '8',
      change: '+2',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Team Members',
      value: '24',
      change: '+4',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Conversion Rate',
      value: '15.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentSales = [
    { id: 1, product: 'Premium Software License', amount: '$299', commission: '$44.85', date: '2024-01-15' },
    { id: 2, product: 'Marketing Tools Bundle', amount: '$199', commission: '$29.85', date: '2024-01-14' },
    { id: 3, product: 'Business Analytics Pro', amount: '$399', commission: '$59.85', date: '2024-01-13' },
  ];

  const topCampaigns = [
    { name: 'Q1 Software Push', performance: 92, sales: 45, commission: '$1,350' },
    { name: 'New Year Special', performance: 88, sales: 38, commission: '$1,140' },
    { name: 'Enterprise Solutions', performance: 76, sales: 22, commission: '$2,200' },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reseller Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your performance overview.</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={16} />
              <span>New Campaign</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 size={16} />
              <span>Invite Member</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Growth Advisor AI"
            description="I analyze your performance data and suggest optimization strategies"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            
            {/* Simplified Chart Representation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sales</span>
                <span className="font-medium">$8,450</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Commissions</span>
                <span className="font-medium">$1,268</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Team Bonus</span>
                <span className="font-medium">$340</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>

          {/* Top Campaigns */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Campaigns</h2>
            <div className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{campaign.name}</h3>
                    <span className="text-sm font-bold text-green-600">{campaign.commission}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>{campaign.sales} sales</span>
                    <span>{campaign.performance}% performance</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full" 
                      style={{ width: `${campaign.performance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Sales</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Commission</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{sale.product}</td>
                    <td className="py-3 px-4 text-gray-600">{sale.amount}</td>
                    <td className="py-3 px-4 font-medium text-green-600">{sale.commission}</td>
                    <td className="py-3 px-4 text-gray-600">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;