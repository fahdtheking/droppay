import React, { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, Settings, Bot, Activity, BarChart3, Eye, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import AgentSlot from '../../components/AgentSlot';

const AdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [supplierApplications, setSupplierApplications] = useState([]);
  const [flaggedUsers, setFlaggedUsers] = useState([]);
  const [aiAgents, setAiAgents] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load supplier applications
      const { data: suppliers } = await supabase
        .from('suppliers')
        .select(`
          *,
          users!inner(name, email, created_at)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setSupplierApplications(suppliers || []);

      // Load AI agents
      const { data: agents } = await supabase
        .from('ai_agents')
        .select('*')
        .order('name');

      setAiAgents(agents || []);

      // Load system metrics (mock data for now)
      setSystemMetrics({
        totalUsers: 1247,
        activeSuppliers: 89,
        totalOrders: 3456,
        systemUptime: '99.9%',
        apiResponseTime: '120ms'
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierAction = async (supplierId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('suppliers')
        .update({ status: newStatus })
        .eq('id', supplierId);

      if (error) throw error;

      // Refresh the data
      loadDashboardData();
    } catch (error) {
      console.error('Error updating supplier status:', error);
    }
  };

  const tabs = [
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'users', label: 'User Management', icon: UserCheck },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'system', label: 'System Health', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Filter tabs based on user role
  const getAvailableTabs = () => {
    switch (user?.role) {
      case 'admin':
        return tabs; // Admin sees all tabs
      case 'moderator':
        return tabs.filter(tab => ['applications', 'users', 'system'].includes(tab.id));
      case 'analyst':
        return tabs.filter(tab => ['analytics', 'system'].includes(tab.id));
      case 'support':
        return tabs.filter(tab => ['users', 'system'].includes(tab.id));
      default:
        return [];
    }
  };

  const availableTabs = getAvailableTabs();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'suspended': return 'text-red-600 bg-red-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'supplier': return 'Supplier';
      case 'reseller': return 'Reseller';
      case 'client': return 'Client';
      case 'moderator': return 'Moderator';
      case 'analyst': return 'Analyst';
      case 'support': return 'Support';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.role === 'admin' ? 'Admin Control Center' : 
               user?.role === 'moderator' ? 'Moderation Dashboard' :
               user?.role === 'analyst' ? 'Analytics Dashboard' :
               user?.role === 'support' ? 'Support Dashboard' : 'Dashboard'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'admin' ? 'Manage platform operations and oversight' :
               user?.role === 'moderator' ? 'Content and user moderation tools' :
               user?.role === 'analyst' ? 'Platform analytics and insights' :
               user?.role === 'support' ? 'Customer support and assistance' : 'Platform management'}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-medium">System Operational</span>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName={user?.role === 'admin' ? 'Admin Control AI' : 
                      user?.role === 'moderator' ? 'Moderation AI' :
                      user?.role === 'analyst' ? 'Analytics AI' :
                      user?.role === 'support' ? 'Support AI' : 'Platform AI'}
            description={user?.role === 'admin' ? 'Monitoring system health and providing administrative insights' :
                        user?.role === 'moderator' ? 'Assisting with content moderation and user management' :
                        user?.role === 'analyst' ? 'Providing data insights and performance analytics' :
                        user?.role === 'support' ? 'Helping resolve customer issues and support requests' : 'Platform assistance'}
          />
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="text-blue-600" size={24} />
              <span className="font-medium text-gray-900">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{systemMetrics.totalUsers?.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="text-green-600" size={24} />
              <span className="font-medium text-gray-900">Active Suppliers</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{systemMetrics.activeSuppliers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="text-purple-600" size={24} />
              <span className="font-medium text-gray-900">System Uptime</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{systemMetrics.systemUptime}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="text-orange-600" size={24} />
              <span className="font-medium text-gray-900">API Response</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{systemMetrics.apiResponseTime}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {availableTabs.map((tab) => {
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

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Supplier Applications */}
          {activeTab === 'applications' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Supplier Applications</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Company</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierApplications.map((supplier: any) => (
                      <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{supplier.company_name}</p>
                            <p className="text-sm text-gray-600">{supplier.legal_name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-gray-900">{supplier.users?.name}</p>
                            <p className="text-sm text-gray-600">{supplier.users?.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                            {supplier.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(supplier.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {supplier.status === 'pending' && user?.role === 'admin' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleSupplierAction(supplier.id, 'approve')}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                onClick={() => handleSupplierAction(supplier.id, 'reject')}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800 p-1" title="View Details">
                                <Eye size={16} />
                              </button>
                            </div>
                          )}
                          {supplier.status !== 'pending' && (
                            <button className="text-blue-600 hover:text-blue-800 p-1" title="View Details">
                              <Eye size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Agents */}
          {activeTab === 'agents' && user?.role === 'admin' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">AI Agent Management</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiAgents.map((agent: any) => (
                  <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.is_active ? 'active' : 'inactive')}`}>
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{agent.type}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Configure
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                        {agent.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Health */}
          {activeTab === 'system' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="text-green-600" size={20} />
                    <span className="font-medium text-green-800">API Status</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                  <p className="text-sm text-green-700">Operational</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="text-blue-600" size={20} />
                    <span className="font-medium text-blue-800">Security</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">Secure</p>
                  <p className="text-sm text-blue-700">All systems protected</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="text-yellow-600" size={20} />
                    <span className="font-medium text-yellow-800">Active Users</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">1,247</p>
                  <p className="text-sm text-yellow-700">Online now</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="text-purple-600" size={20} />
                    <span className="font-medium text-purple-800">AI Load</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">68%</p>
                  <p className="text-sm text-purple-700">Processing capacity</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (user?.role === 'admin' || user?.role === 'analyst') && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Analytics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">User Growth</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Users (30d):</span>
                      <span className="font-medium">+234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Users:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retention Rate:</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Revenue Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium">$156,840</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission Paid:</span>
                      <span className="font-medium">$23,526</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate:</span>
                      <span className="font-medium">+24.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (user?.role === 'admin' || user?.role === 'moderator' || user?.role === 'support') && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">User management interface coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminControlCenter;