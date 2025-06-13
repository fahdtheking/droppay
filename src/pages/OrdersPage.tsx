import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Star,
  Eye,
  Download,
  MessageSquare,
  ArrowRight,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import AgentSlot from '../components/AgentSlot';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 124.98,
      items: [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          supplier: 'TechCorp Electronics',
          price: 89.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
          id: 2,
          name: 'Phone Case',
          supplier: 'TechCorp Electronics',
          price: 34.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
      ],
      shipping: {
        address: '123 Main St, New York, NY 10001',
        method: 'Standard Shipping',
        tracking: 'TRK123456789',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17'
      },
      payment: {
        method: 'Credit Card',
        last4: '4242',
        subtotal: 124.98,
        shipping: 0,
        tax: 0,
        total: 124.98
      }
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-12',
      status: 'shipped',
      total: 129.99,
      items: [
        {
          id: 3,
          name: 'Smart Fitness Tracker',
          supplier: 'HealthTech Solutions',
          price: 129.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
      ],
      shipping: {
        address: '123 Main St, New York, NY 10001',
        method: 'Express Shipping',
        tracking: 'TRK987654321',
        estimatedDelivery: '2024-01-15',
        actualDelivery: null
      },
      payment: {
        method: 'PayPal',
        last4: null,
        subtotal: 129.99,
        shipping: 0,
        tax: 0,
        total: 129.99
      }
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-10',
      status: 'processing',
      total: 69.98,
      items: [
        {
          id: 4,
          name: 'Portable Charger',
          supplier: 'PowerMax Accessories',
          price: 34.99,
          quantity: 2,
          image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
      ],
      shipping: {
        address: '123 Main St, New York, NY 10001',
        method: 'Standard Shipping',
        tracking: null,
        estimatedDelivery: '2024-01-17',
        actualDelivery: null
      },
      payment: {
        method: 'Credit Card',
        last4: '4242',
        subtotal: 69.98,
        shipping: 0,
        tax: 0,
        total: 69.98
      }
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'processing':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Clock,
          label: 'Processing'
        };
      case 'shipped':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: Truck,
          label: 'Shipped'
        };
      case 'delivered':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          label: 'Delivered'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: Package,
          label: 'Unknown'
        };
    }
  };

  const getStatusSteps = (order: any) => {
    const steps = [
      { id: 'processing', label: 'Order Placed', completed: true },
      { id: 'shipped', label: 'Shipped', completed: order.status === 'shipped' || order.status === 'delivered' },
      { id: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
    ];
    return steps;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your order history</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Order Assistant AI"
            description="I help you track orders, handle returns, and resolve any delivery issues"
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders by ID, product name, or supplier..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This Year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const config = getStatusConfig(order.status);
            const StatusIcon = config.icon;
            
            return (
              <div key={order.id} className={`bg-white rounded-xl shadow-sm border ${config.borderColor} overflow-hidden`}>
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={config.color} size={20} />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} ${config.bgColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${order.total}</p>
                      <p className="text-sm text-gray-600">Ordered {order.date}</p>
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="flex items-center space-x-4 mb-4">
                    {getStatusSteps(order).map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.completed ? <CheckCircle size={16} /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                        </div>
                        <span className={`ml-2 text-sm ${step.completed ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                          {step.label}
                        </span>
                        {index < getStatusSteps(order).length - 1 && (
                          <div className={`w-8 h-px mx-4 ${step.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  {order.shipping.tracking && (
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Truck size={16} />
                        <span>Tracking: {order.shipping.tracking}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>
                          {order.shipping.actualDelivery 
                            ? `Delivered ${order.shipping.actualDelivery}`
                            : `Est. delivery ${order.shipping.estimatedDelivery}`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">by {item.supplier}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </button>
                      {order.status === 'shipped' && (
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Truck size={16} />
                          <span>Track Package</span>
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Star size={16} />
                          <span>Leave Review</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageSquare size={16} />
                        <span>Contact Supplier</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <RefreshCw size={16} />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.id}</h2>
                    <p className="text-gray-600">Order Details</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                    <div className="flex items-center space-x-4">
                      {getStatusSteps(selectedOrder).map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {step.completed ? <CheckCircle size={16} /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                          </div>
                          <span className={`ml-2 text-sm ${step.completed ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                            {step.label}
                          </span>
                          {index < getStatusSteps(selectedOrder).length - 1 && (
                            <div className={`w-8 h-px mx-4 ${step.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">by {item.supplier}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-600">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-gray-600 mt-1" size={16} />
                        <div>
                          <p className="text-gray-900">{selectedOrder.shipping.address}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedOrder.shipping.method}
                            {selectedOrder.shipping.tracking && ` • Tracking: ${selectedOrder.shipping.tracking}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-gray-900">${selectedOrder.payment.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-900">${selectedOrder.payment.shipping}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="text-gray-900">${selectedOrder.payment.tax}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-gray-900">${selectedOrder.payment.total}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Paid with {selectedOrder.payment.method}
                          {selectedOrder.payment.last4 && ` ending in ${selectedOrder.payment.last4}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Download Invoice
                    </button>
                    <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;