import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  BarChart3, 
  ShoppingCart,
  Eye,
  Plus,
  Settings,
  Globe,
  Link,
  ArrowUpRight,
  Calendar,
  Truck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const SupplierDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const supplierStats = [
    {
      title: 'Total Revenue',
      value: '$156,840',
      change: '+24.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Products',
      value: '89',
      change: '+12 this month',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Resellers',
      value: '234',
      change: '+45 new this week',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Marketplace Views',
      value: '18,450',
      change: '+15.2% this week',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 456, revenue: 41040, commission: 6156, resellers: 89 },
    { name: 'Smart Fitness Tracker', sales: 234, revenue: 30420, commission: 6084, resellers: 67 },
    { name: 'Portable Charger', sales: 789, revenue: 27611, commission: 3313, resellers: 156 }
  ];

  const recentOrders = [
    { id: '#ORD-2024-001', reseller: 'Sarah Johnson', product: 'Wireless Headphones', quantity: 5, total: 449.95, status: 'processing', date: '2024-01-15' },
    { id: '#ORD-2024-002', reseller: 'Mike Chen', product: 'Fitness Tracker', quantity: 2, total: 259.98, status: 'shipped', date: '2024-01-15' },
    { id: '#ORD-2024-003', reseller: 'Emma Wilson', product: 'Portable Charger', quantity: 10, total: 349.90, status: 'delivered', date: '2024-01-14' }
  ];

  const pendingActions = [
    { type: 'inventory', message: 'Wireless Headphones running low (15 units left)', priority: 'high' },
    { type: 'reseller', message: '3 new reseller applications pending approval', priority: 'medium' },
    { type: 'product', message: 'Smart Watch needs price update', priority: 'low' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Dashboard</h1>
            <p className="text-gray-600">Manage your marketplace and track reseller performance</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus size={16} />
              <span>Add Product</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Globe size={16} />
              <span>View My Store</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Supplier Success AI"
            description="I optimize your product listings, manage inventory alerts, and help maximize reseller performance"
          />
        </div>

        {/* Quick Store Access */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Your DropPay Marketplace</h2>
              <p className="text-green-100 mb-4">TechCorp Electronics - Premium gadgets and accessories</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Store size={16} />
                  <span>droppay.com/store/techcorp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>234 active resellers</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Manage Store
              </button>
              <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {supplierStats.map((stat, index) => {
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
          {/* Performance Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
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
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Product Sales</span>
                  <span className="font-medium text-green-600">$124,680</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: '79%' }}></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Commission Paid</span>
                  <span className="font-medium text-blue-600">$18,702</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '15%' }}></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Platform Fees</span>
                  <span className="font-medium text-purple-600">$3,117</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '2.5%' }}></div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Products</h2>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.sales} sales • {product.resellers} resellers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Commission: ${product.commission.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  View All Orders
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Reseller</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                        <td className="py-3 px-4 text-gray-900">{order.reseller}</td>
                        <td className="py-3 px-4 text-gray-600">{order.product} (×{order.quantity})</td>
                        <td className="py-3 px-4 font-medium text-gray-900">${order.total}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Action Required</h2>
              <div className="space-y-4">
                {pendingActions.map((action, index) => (
                  <div key={index} className={`border rounded-lg p-3 ${getPriorityColor(action.priority)}`}>
                    <div className="flex items-start space-x-2">
                      <AlertCircle size={16} className="mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.message}</p>
                        <span className="text-xs opacity-75 capitalize">{action.priority} priority</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus className="text-blue-600" size={20} />
                  <span className="font-medium text-blue-800">Add New Product</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <Users className="text-green-600" size={20} />
                  <span className="font-medium text-green-800">Invite Resellers</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <BarChart3 className="text-purple-600" size={20} />
                  <span className="font-medium text-purple-800">View Analytics</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <Settings className="text-orange-600" size={20} />
                  <span className="font-medium text-orange-800">Store Settings</span>
                </button>
              </div>
            </div>

            {/* Store Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Store Health</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inventory Status</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-green-600">Good</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reseller Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900">4.8/5.0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Order Fulfillment</span>
                  <span className="text-sm font-medium text-gray-900">98.5%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-gray-900">< 2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;