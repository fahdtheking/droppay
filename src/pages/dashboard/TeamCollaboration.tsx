import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Share2, 
  MessageSquare, 
  TrendingUp, 
  Award, 
  Calendar,
  FileText,
  DollarSign,
  Zap,
  Plus,
  Search,
  Filter,
  BarChart3,
  Trophy,
  Star,
  Gift,
  Lightbulb,
  Megaphone,
  Database,
  Clock,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const TeamCollaboration = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTeam, setSelectedTeam] = useState('alpha-sellers');

  const myTeams = [
    {
      id: 'alpha-sellers',
      name: 'Alpha Sellers',
      members: 12,
      totalSales: 145680,
      avgSales: 12140,
      milestone: 'Gold Tier',
      progress: 78,
      role: 'leader'
    },
    {
      id: 'tech-innovators',
      name: 'Tech Innovators',
      members: 8,
      totalSales: 89420,
      avgSales: 11177,
      milestone: 'Silver Tier',
      progress: 45,
      role: 'member'
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'SC',
      personalSales: 18450,
      commission: 2767,
      rank: 1,
      streak: 12,
      specialties: ['Software', 'SaaS'],
      lastActive: '2 hours ago',
      contributions: 24
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      avatar: 'MR',
      personalSales: 15680,
      commission: 2352,
      rank: 2,
      streak: 8,
      specialties: ['Electronics', 'Gadgets'],
      lastActive: '1 hour ago',
      contributions: 18
    },
    {
      id: 3,
      name: 'Emma Thompson',
      avatar: 'ET',
      personalSales: 13920,
      commission: 2088,
      rank: 3,
      streak: 15,
      specialties: ['Fashion', 'Lifestyle'],
      lastActive: '30 min ago',
      contributions: 31
    },
    {
      id: 4,
      name: 'David Park',
      avatar: 'DP',
      personalSales: 12340,
      commission: 1851,
      rank: 4,
      streak: 6,
      specialties: ['Health', 'Fitness'],
      lastActive: '4 hours ago',
      contributions: 15
    }
  ];

  const sharedResources = [
    {
      id: 1,
      type: 'strategy',
      title: 'Q1 2024 Sales Playbook',
      author: 'Sarah Chen',
      downloads: 45,
      rating: 4.8,
      category: 'Sales Strategy',
      date: '2024-01-15'
    },
    {
      id: 2,
      type: 'template',
      title: 'Email Campaign Templates',
      author: 'Mike Rodriguez',
      downloads: 32,
      rating: 4.6,
      category: 'Marketing',
      date: '2024-01-12'
    },
    {
      id: 3,
      type: 'data',
      title: 'Customer Persona Analysis',
      author: 'Emma Thompson',
      downloads: 28,
      rating: 4.9,
      category: 'Analytics',
      date: '2024-01-10'
    }
  ];

  const milestones = [
    {
      id: 1,
      name: 'Bronze Collective',
      target: 50000,
      current: 48320,
      reward: '$500 team bonus + Bronze badges',
      deadline: '2024-02-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Silver Surge',
      target: 100000,
      current: 48320,
      reward: '$1,200 team bonus + Silver badges + AI tool credits',
      deadline: '2024-03-15',
      status: 'upcoming'
    },
    {
      id: 3,
      name: 'Gold Rush',
      target: 200000,
      current: 48320,
      reward: '$3,000 team bonus + Gold badges + Premium AI access',
      deadline: '2024-06-30',
      status: 'upcoming'
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Spring Tech Launch',
      type: 'Collaborative',
      participants: 8,
      budget: 2400,
      spent: 1680,
      leads: 156,
      conversions: 23,
      status: 'active',
      endDate: '2024-02-15'
    },
    {
      id: 2,
      name: 'Valentine\'s Special',
      type: 'Cross-Promotion',
      participants: 5,
      budget: 1200,
      spent: 890,
      leads: 89,
      conversions: 12,
      status: 'active',
      endDate: '2024-02-14'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'resources', label: 'Shared Resources', icon: Database },
    { id: 'campaigns', label: 'Joint Campaigns', icon: Megaphone },
    { id: 'milestones', label: 'Milestones', icon: Trophy },
    { id: 'communication', label: 'Team Chat', icon: MessageSquare }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-600';
    if (progress >= 60) return 'bg-blue-600';
    if (progress >= 40) return 'bg-yellow-600';
    return 'bg-gray-600';
  };

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'upcoming': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Collaboration</h1>
            <p className="text-gray-600">Collaborate, share resources, and achieve milestones together</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={16} />
              <span>Create Team</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Users size={16} />
              <span>Join Team</span>
            </button>
          </div>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Team Collaboration AI"
            description="I help optimize team dynamics, suggest collaboration strategies, and track collective performance"
          />
        </div>

        {/* Team Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Team</label>
          <div className="grid md:grid-cols-2 gap-4">
            {myTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedTeam === team.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{team.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    team.role === 'leader' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {team.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Members:</span>
                    <p className="font-medium">{team.members}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Sales:</span>
                    <p className="font-medium">${team.totalSales.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">{team.milestone}</span>
                    <span className="font-medium">{team.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(team.progress)}`}
                      style={{ width: `${team.progress}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
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
                {/* Team Performance */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Team Performance</h2>
                  
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="text-blue-600" size={20} />
                        <span className="font-medium text-blue-800">Total Sales</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">$145,680</p>
                      <p className="text-sm text-blue-700">+18.5% this month</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="text-green-600" size={20} />
                        <span className="font-medium text-green-800">Avg per Member</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">$12,140</p>
                      <p className="text-sm text-green-700">Above target</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="text-purple-600" size={20} />
                        <span className="font-medium text-purple-800">Team Rank</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">#3</p>
                      <p className="text-sm text-purple-700">In region</p>
                    </div>
                  </div>

                  {/* Sales Chart Placeholder */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Monthly Sales Trend</h3>
                    <div className="space-y-3">
                      {['Jan', 'Feb', 'Mar', 'Apr'].map((month, index) => (
                        <div key={month} className="flex items-center space-x-3">
                          <span className="w-8 text-sm text-gray-600">{month}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full"
                              style={{ width: `${60 + index * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">${(25000 + index * 5000).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Milestones */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                  
                  <div className="space-y-4 mb-8">
                    <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      <Share2 className="text-blue-600" size={20} />
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">Share Resource</h3>
                        <p className="text-sm text-gray-600">Upload strategy or template</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                      <Megaphone className="text-green-600" size={20} />
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">Start Campaign</h3>
                        <p className="text-sm text-gray-600">Launch joint marketing</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      <MessageSquare className="text-purple-600" size={20} />
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">Team Chat</h3>
                        <p className="text-sm text-gray-600">Join the discussion</p>
                      </div>
                    </button>
                  </div>

                  {/* Next Milestone */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Next Milestone</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Bronze Collective</span>
                        <span className="text-sm text-gray-600">96.6%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-orange-600 h-3 rounded-full" style={{ width: '96.6%' }}></div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>$48,320 / $50,000</p>
                        <p className="text-orange-600 font-medium">$1,680 to go!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'members' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">Rank #{member.rank} • {member.lastActive}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${member.personalSales.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Personal Sales</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Commission</span>
                        <p className="font-medium text-blue-600">${member.commission.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Contributions</span>
                        <p className="font-medium text-purple-600">{member.contributions}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm font-medium">{member.streak} day streak</span>
                      </div>
                      <div className="flex space-x-1">
                        {member.specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Resources Tab */}
          {activeTab === 'resources' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shared Resources</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={16} />
                  <span>Upload Resource</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedResources.map((resource) => (
                  <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {resource.type === 'strategy' && <Lightbulb className="text-yellow-600" size={20} />}
                        {resource.type === 'template' && <FileText className="text-blue-600" size={20} />}
                        {resource.type === 'data' && <BarChart3 className="text-green-600" size={20} />}
                        <span className="text-sm font-medium text-gray-600">{resource.category}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star size={14} />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">By {resource.author}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{resource.downloads} downloads</span>
                      <span>{resource.date}</span>
                    </div>

                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Joint Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Joint Campaigns</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={16} />
                  <span>Create Campaign</span>
                </button>
              </div>

              <div className="space-y-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{campaign.type}</span>
                          <span>{campaign.participants} participants</span>
                          <span>Ends {campaign.endDate}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {campaign.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Budget Used</span>
                        <p className="text-lg font-bold text-gray-900">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">Leads Generated</span>
                        <p className="text-lg font-bold text-blue-600">{campaign.leads}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">Conversions</span>
                        <p className="text-lg font-bold text-green-600">{campaign.conversions}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">Conversion Rate</span>
                        <p className="text-lg font-bold text-purple-600">
                          {((campaign.conversions / campaign.leads) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Edit Campaign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Team Milestones & Rewards</h2>
              
              <div className="space-y-6">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className={`border rounded-lg p-6 ${getMilestoneColor(milestone.status)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.name}</h3>
                        <p className="text-gray-600 mb-2">{milestone.reward}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Target: ${milestone.target.toLocaleString()}</span>
                          <span>Deadline: {milestone.deadline}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Trophy className="text-yellow-600" size={20} />
                          <span className="font-medium text-gray-900">
                            {((milestone.current / milestone.target) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          ${milestone.current.toLocaleString()} / ${milestone.target.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-600' :
                            milestone.status === 'active' ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {milestone.status === 'active' && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>${(milestone.target - milestone.current).toLocaleString()}</strong> remaining to unlock this milestone!
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Chat Tab */}
          {activeTab === 'communication' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Team Communication</h2>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Chat Area */}
                <div className="lg:col-span-2">
                  <div className="border border-gray-200 rounded-lg h-96 flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                      <h3 className="font-semibold text-gray-900">General Discussion</h3>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          SC
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">Sarah Chen</span>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                          </div>
                          <p className="text-gray-700">Just shared the new Q1 playbook! Check it out in resources 📚</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          MR
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">Mike Rodriguez</span>
                            <span className="text-xs text-gray-500">1 hour ago</span>
                          </div>
                          <p className="text-gray-700">Thanks Sarah! The email templates are working great for the tech campaign 🚀</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Online Members */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Online Now (4)</h3>
                    <div className="space-y-2">
                      {teamMembers.slice(0, 4).map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {member.avatar}
                          </div>
                          <span className="text-sm text-gray-900">{member.name}</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                        📋 Share Strategy
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded">
                        🎯 Announce Goal
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded">
                        🏆 Celebrate Win
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

export default TeamCollaboration;