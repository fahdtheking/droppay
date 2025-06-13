import React, { useState } from 'react';
import { Users, Plus, Crown, Star, Mail, Phone, MoreVertical, UserCheck, UserX, Award, TrendingUp } from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const TeamManagement = () => {
  const [activeView, setActiveView] = useState('tree');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Team Leader',
      level: 2,
      recruits: 8,
      totalEarnings: '$12,450',
      monthlyEarnings: '$2,850',
      status: 'active',
      joinDate: '2023-08-15',
      isDirectRecruit: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'Senior Reseller',
      level: 3,
      recruits: 15,
      totalEarnings: '$8,920',
      monthlyEarnings: '$1,940',
      status: 'active',
      joinDate: '2023-09-22',
      isDirectRecruit: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      role: 'Reseller',
      level: 4,
      recruits: 3,
      totalEarnings: '$3,280',
      monthlyEarnings: '$780',
      status: 'active',
      joinDate: '2023-11-10',
      isDirectRecruit: false,
      parentId: 1
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david@example.com',
      role: 'Reseller',
      level: 4,
      recruits: 1,
      totalEarnings: '$1,650',
      monthlyEarnings: '$420',
      status: 'inactive',
      joinDate: '2023-12-03',
      isDirectRecruit: false,
      parentId: 2
    }
  ];

  const teamStats = [
    {
      title: 'Total Team Size',
      value: '27',
      change: '+4 this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Members',
      value: '24',
      change: '89% active rate',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Team Earnings',
      value: '$48,320',
      change: '+15.2% this month',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Your Bonuses',
      value: '$2,416',
      change: 'From team performance',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Team Leader': return Crown;
      case 'Senior Reseller': return Star;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Team Leader': return 'text-purple-600 bg-purple-100';
      case 'Senior Reseller': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
            <p className="text-gray-600">Build and manage your reseller network</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Invite Member</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail size={16} />
              <span>Send Announcement</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Team Growth AI"
            description="I analyze team performance and suggest strategies for network expansion"
          />
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {teamStats.map((stat, index) => {
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
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* View Toggle */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveView('tree')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeView === 'tree'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team Tree
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeView === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List View
          </button>
        </div>

        {/* Team Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {activeView === 'tree' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Team Hierarchy</h2>
              
              {/* Root User */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Crown className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold">You (Team Owner)</h3>
                      <p className="text-purple-100 text-sm">Level 1 • 27 total recruits</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 2 - Direct Recruits */}
              <div className="flex justify-center space-x-8 mb-8">
                {teamMembers.filter(member => member.isDirectRecruit).map((member) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <div key={member.id} className="relative">
                      {/* Connection Line */}
                      <div className="absolute -top-8 left-1/2 w-px h-8 bg-gray-300"></div>
                      
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <RoleIcon className="text-blue-600" size={20} />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">Level {member.level}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                          <div className="mt-2 text-xs text-gray-500">
                            {member.recruits} recruits
                          </div>
                        </div>
                      </div>

                      {/* Sub-team members */}
                      {teamMembers.filter(sub => sub.parentId === member.id).length > 0 && (
                        <div className="flex justify-center mt-8 space-x-4">
                          {teamMembers.filter(sub => sub.parentId === member.id).map((subMember) => (
                            <div key={subMember.id} className="relative">
                              {/* Connection Line */}
                              <div className="absolute -top-8 left-1/2 w-px h-8 bg-gray-300"></div>
                              
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Users className="text-gray-600" size={14} />
                                </div>
                                <h4 className="font-medium text-gray-900 text-xs">{subMember.name}</h4>
                                <p className="text-xs text-gray-500">Level {subMember.level}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeView === 'list' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Team Members</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Member</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Level</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Recruits</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Monthly Earnings</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => {
                      const RoleIcon = getRoleIcon(member.role);
                      return (
                        <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <RoleIcon className="text-gray-600" size={16} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{member.level}</td>
                          <td className="py-3 px-4 text-gray-600">{member.recruits}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{member.monthlyEarnings}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {inviteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Invite Team Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="colleague@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Reseller</option>
                    <option>Senior Reseller</option>
                    <option>Team Leader</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Join my team and start earning together!"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setInviteModalOpen(false);
                    alert('Invitation sent!');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;