import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Heart, 
  Star, 
  Truck, 
  CreditCard,
  Gift,
  Search,
  Filter,
  Eye,
  Plus,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const ClientDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const clientStats = [
    {
      title: 'Total Spent',
      value: '$2,847',
      change: '+18.5%',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Orders Placed',
      value: '23',
      change: '+5 this month',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Saved Items',
      value: '47',
      change: '+12 new',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Rewards Points',
      value: '1,240',
      change: '+340 earned',
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentOrders = [
    { 
      id: '#ORD-2024-001', 
      items: 'Wireless Headphones, Phone Case', 
      total: 124.98, 
      status: 'delivered', 
      date: '2024-01-15',
      supplier: 'TechCorp Electronics',
      tracking: 'TRK123456789'
    },
    { 
      id: '#ORD-2024-002', 
      items: 'Fitness Tracker', 
      total: 129.99, 
      status: 'shipped', 
      date: '2024-01-12',
      supplier: 'HealthTech Solutions',
      tracking: 'TRK987654321'
    },
    { 
      id: '#ORD-2024-003', 
      items: 'Portable Charger (×2)', 
      total: 69.98, 
      status: 'processing', 
      date: '2024-01-10',
      supplier: 'PowerMax Accessories',
      tracking: null
    }
  ];

  const recommendedProducts = [
    {
      id: 1,
      name: 'Smart Watch Pro',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
      supplier: 'TechCorp Electronics',
      discount: 20,
      inStock: true
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.6,
      reviews: 189,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
      supplier: 'AudioMax',
      discount: 20,
      inStock: true
    },
    {
      id: 3,
      name: 'Phone Stand',
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.4,
      reviews: 156,
      image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=300',
      supplier: 'AccessoryHub',
      discount: 29,
      inStock: false
    }
  ];

  const savedItems = [
    { id: 1, name: 'Gaming Keyboard', price: 89.99, supplier: 'TechCorp' },
    { id: 2, name: 'Desk Lamp', price: 45.99, supplier: 'HomeStyle' },
    { id: 3, name: 'Coffee Mug Set', price: 29.99, supplier: 'KitchenPro' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your shopping overview</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Search size={16} />
              <span>Browse Products</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart size={16} />
              <span>View Cart</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Shopping Assistant AI"
            description="I help you find the best deals, track orders, and discover products you'll love"
          />
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Exclusive Member Benefits</h2>
              <p className="text-purple-100 mb-4">Enjoy free shipping, early access to sales, and reward points on every purchase</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Gift size={16} />
                  <span>1,240 reward points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck size={16} />
                  <span>Free shipping unlocked</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Redeem Points
              </button>
              <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                View Benefits
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {clientStats.map((stat, index) => {
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  View All Orders
                </button>
              </div>
              
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.items}</p>
                        <p className="text-xs text-gray-500">From {order.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${order.total}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{order.date}</span>
                        </div>
                        {order.tracking && (
                          <div className="flex items-center space-x-1">
                            <Truck size={14} />
                            <span>Track: {order.tracking}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Track</button>
                        <button className="text-gray-600 hover:text-gray-800">Reorder</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  View All
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex space-x-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">by {product.supplier}</p>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star size={12} className="text-yellow-500" fill="currentColor" />
                            <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                          </div>
                          {product.discount > 0 && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-900">${product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-gray-500 line-through ml-1">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-400 hover:text-red-500">
                              <Heart size={14} />
                            </button>
                            <button className="p-1 text-blue-600 hover:text-blue-800">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-blue-800">1 Processing</p>
                    <p className="text-xs text-blue-600">Expected ship: Tomorrow</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Truck className="text-yellow-600" size={20} />
                  <div>
                    <p className="font-medium text-yellow-800">1 In Transit</p>
                    <p className="text-xs text-yellow-600">Arrives in 2-3 days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium text-green-800">3 Delivered</p>
                    <p className="text-xs text-green-600">This month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Saved Items</h2>
                <span className="text-sm text-gray-600">{savedItems.length} items</span>
              </div>
              
              <div className="space-y-3">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">${item.price}</p>
                      <button className="text-xs text-blue-600 hover:text-blue-800">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                View All Saved Items
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <Search className="text-blue-600" size={20} />
                  <span className="font-medium text-blue-800">Browse Products</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <Package className="text-green-600" size={20} />
                  <span className="font-medium text-green-800">Track Orders</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <Gift className="text-purple-600" size={20} />
                  <span className="font-medium text-purple-800">Redeem Rewards</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                  <Heart className="text-red-600" size={20} />
                  <span className="font-medium text-red-800">Manage Wishlist</span>
                </button>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">Jan 2024</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="text-sm font-medium text-gray-900">23</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Favorite Supplier</span>
                  <span className="text-sm font-medium text-gray-900">TechCorp</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Reward</span>
                  <span className="text-sm font-medium text-purple-600">760 points away</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;