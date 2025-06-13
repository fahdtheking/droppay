import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  DollarSign, 
  Users, 
  BarChart3, 
  Settings, 
  Link, 
  Calculator,
  Globe,
  CreditCard,
  Truck,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  TrendingUp,
  ShoppingCart,
  Percent,
  Copy,
  ExternalLink
} from 'lucide-react';
import AgentSlot from '../components/AgentSlot';

const SupplierPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCommissionCalculator, setShowCommissionCalculator] = useState(false);

  const supplierStats = [
    {
      title: 'Total Products',
      value: '156',
      change: '+12 this month',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Resellers',
      value: '89',
      change: '+23 new this week',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Sales',
      value: '$45,680',
      change: '+18.5% this month',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Marketplace Views',
      value: '12,450',
      change: '+8.2% this week',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-001',
      price: 89.99,
      cost: 45.00,
      commission: 15,
      inventory: 245,
      resellers: 23,
      sales: 156,
      revenue: 14039.44,
      status: 'active',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      name: 'Smart Fitness Tracker',
      sku: 'SFT-002',
      price: 129.99,
      cost: 65.00,
      commission: 20,
      inventory: 89,
      resellers: 18,
      sales: 89,
      revenue: 11569.11,
      status: 'active',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      name: 'Portable Phone Charger',
      sku: 'PPC-003',
      price: 34.99,
      cost: 18.00,
      commission: 12,
      inventory: 0,
      resellers: 45,
      sales: 234,
      revenue: 8187.66,
      status: 'out_of_stock',
      image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const resellers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      uniqueLink: 'droppay.com/store/techcorp/sarah-j',
      totalSales: 12450,
      commission: 1867.50,
      orders: 45,
      conversionRate: 3.2,
      joinDate: '2024-01-15',
      status: 'active',
      topProducts: ['Wireless Headphones', 'Fitness Tracker']
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      uniqueLink: 'droppay.com/store/techcorp/mike-c',
      totalSales: 8920,
      commission: 1338.00,
      orders: 32,
      conversionRate: 2.8,
      joinDate: '2024-01-20',
      status: 'active',
      topProducts: ['Phone Charger', 'Wireless Headphones']
    }
  ];

  const marketplaceSettings = {
    storeName: 'TechCorp Electronics',
    storeUrl: 'droppay.com/store/techcorp',
    description: 'Premium electronics and gadgets for modern lifestyle',
    logo: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=100',
    theme: 'modern',
    currency: 'USD',
    shippingZones: ['US', 'CA', 'UK', 'AU'],
    paymentMethods: ['stripe', 'paypal', 'crypto']
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'resellers', label: 'Resellers', icon: Users },
    { id: 'marketplace', label: 'My Marketplace', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'out_of_stock': return 'text-red-600 bg-red-50';
      case 'draft': return 'text-yellow-600 bg-yellow-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Portal</h1>
            <p className="text-gray-600">Manage your marketplace, products, and reseller network</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button 
              onClick={() => setShowCommissionCalculator(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Calculator size={16} />
              <span>Commission Calculator</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Supplier Success AI"
            description="I help optimize your marketplace, manage inventory, and maximize reseller performance"
          />
        </div>

        {/* Marketplace Quick Access */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Your DropPay Marketplace</h2>
              <p className="text-blue-100 mb-4">{marketplaceSettings.description}</p>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 w-fit">
                <Globe size={16} />
                <span className="font-medium">{marketplaceSettings.storeUrl}</span>
                <button 
                  onClick={() => copyToClipboard(`https://${marketplaceSettings.storeUrl}`)}
                  className="ml-2 p-1 hover:bg-white/20 rounded"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye size={16} />
                <span>Preview</span>
              </button>
              <button className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                <ExternalLink size={16} />
                <span>Visit Store</span>
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
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
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
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Performance Chart */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Performance</h2>
                  <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
                      <p className="text-gray-600">Sales analytics chart would go here</p>
                    </div>
                  </div>
                </div>

                {/* Top Products */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Products</h2>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                          <p className="text-xs text-gray-600">{product.sales} sales</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">{product.resellers} resellers</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Product Catalog</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Commission</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Inventory</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Resellers</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">${product.price}</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">{product.commission}%</span>
                          <p className="text-xs text-gray-600">${(product.price * product.commission / 100).toFixed(2)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${product.inventory > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {product.inventory}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-blue-600 font-medium">{product.resellers}</td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{product.sales}</p>
                          <p className="text-xs text-gray-600">${product.revenue.toLocaleString()}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {product.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 p-1">
                              <Edit size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1">
                              <Eye size={16} />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800 p-1">
                              <Link size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resellers Tab */}
          {activeTab === 'resellers' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Resellers</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Users size={16} />
                  <span>Invite Resellers</span>
                </button>
              </div>

              <div className="space-y-4">
                {resellers.map((reseller) => (
                  <div key={reseller.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {reseller.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{reseller.name}</h3>
                          <p className="text-sm text-gray-600">{reseller.email}</p>
                          <p className="text-xs text-gray-500">Joined {reseller.joinDate}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {reseller.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Total Sales</span>
                        <p className="text-lg font-bold text-green-600">${reseller.totalSales.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Commission Earned</span>
                        <p className="text-lg font-bold text-blue-600">${reseller.commission.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Orders</span>
                        <p className="text-lg font-bold text-purple-600">{reseller.orders}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Conversion Rate</span>
                        <p className="text-lg font-bold text-orange-600">{reseller.conversionRate}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Unique Store Link:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{reseller.uniqueLink}</code>
                          <button 
                            onClick={() => copyToClipboard(`https://${reseller.uniqueLink}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">Top Products:</span>
                        <div className="flex space-x-1 mt-1">
                          {reseller.topProducts.map((product, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketplace Tab */}
          {activeTab === 'marketplace' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Marketplace Settings</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Store Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={marketplaceSettings.storeName}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store URL
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        droppay.com/store/
                      </span>
                      <input
                        type="text"
                        value="techcorp"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Description
                    </label>
                    <textarea
                      rows={3}
                      value={marketplaceSettings.description}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Methods
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'stripe', label: 'Stripe (Cards)', icon: CreditCard },
                        { id: 'paypal', label: 'PayPal', icon: DollarSign },
                        { id: 'crypto', label: 'Cryptocurrency', icon: Globe }
                      ].map((method) => {
                        const Icon = method.icon;
                        return (
                          <label key={method.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                            <Icon size={20} className="text-gray-600" />
                            <span className="font-medium text-gray-900">{method.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Shipping Zones
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['US', 'CA', 'UK', 'AU', 'EU', 'ASIA'].map((zone) => (
                        <label key={zone} className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50">
                          <input type="checkbox" defaultChecked={marketplaceSettings.shippingZones.includes(zone)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">{zone}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Theme
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Preview Store
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
              
              <div className="space-y-8">
                {/* Commission Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Commission Rate
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          defaultValue="15"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order for Commission
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          defaultValue="25"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reseller Options */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reseller Options</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">Allow bulk orders (10+ products)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">Enable custom pricing for volume orders</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">Allow resellers to customize product listings</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">Require approval for new resellers</span>
                    </label>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">New reseller applications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">Low inventory alerts</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">Daily sales reports</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">Weekly performance summaries</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Commission Calculator Modal */}
        {showCommissionCalculator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Commission Calculator</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Price
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      placeholder="15"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800">Reseller Commission:</span>
                    <span className="text-xl font-bold text-blue-600">$0.00</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCommissionCalculator(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Calculate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPortal;