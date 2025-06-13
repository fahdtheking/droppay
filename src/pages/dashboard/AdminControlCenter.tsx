import React, { useState } from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, Settings, Bot, Activity } from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const AdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState('applications');

  const supplierApplications = [
    { id: 1, name: 'TechCorp Solutions', status: 'pending', submitted: '2024-01-15', country: 'US' },
    { id: 2, name: 'Global Supplies Ltd', status: 'pending', submitted: '2024-01-14', country: 'UK' },
    { id: 3, name: 'Innovation Partners', status: 'approved', submitted: '2024-01-13', country: 'CA' },
  ];

  const flaggedUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', reason: 'Suspicious activity', severity: 'high' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', reason: 'Multiple failed payments', severity: 'medium' },
  ];

  const aiAgents = [
    { name: 'Jarvis Home AI', status: 'active', usage: '2.1GB RAM', uptime: '99.9%' },
    { name: 'Verify Supplier AI', status: 'active', usage: '1.8GB RAM', uptime: '98.5%' },
    { name: 'Client Assistant AI', status: 'maintenance', usage: '0GB RAM', uptime: '0%' },
    { name: 'Growth Advisor AI', status: 'active', usage: '1.5GB RAM', uptime: '99.2%' },
    { name: 'Campaign Studio AI', status: 'active', usage: '3.2GB RAM', uptime: '97.8%' },
  ];

  const tabs = [
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'flagged', label: 'Flagged Users', icon: AlertTriangle },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'system', label: 'System Health', icon: Activity },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Control Center</h1>
            <p className="text-gray-600">Manage platform operations and oversight</p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-medium">System Operational</span>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Admin Control AI"
            description="Monitoring system health and providing administrative insights"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
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
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Country</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierApplications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{app.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{app.country}</td>
                        <td className="py-3 px-4 text-gray-600">{app.submitted}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-800 p-1">
                              <CheckCircle size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-800 p-1">
                              <XCircle size={16} />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 p-1">
                              <Settings size={16} />
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

          {/* Flagged Users */}
          {activeTab === 'flagged' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Flagged Users</h2>
              <div className="space-y-4">
                {flaggedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{user.reason}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(user.severity)}`}>
                          {user.severity}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                          Ban
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Agents */}
          {activeTab === 'agents' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">AI Agent Management</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiAgents.map((agent, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Memory:</span>
                        <span className="font-medium">{agent.usage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="font-medium">{agent.uptime}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Configure
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                        Restart
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
        </div>
      </div>
    </div>
  );
};

export default AdminControlCenter;