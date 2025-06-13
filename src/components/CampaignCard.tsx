import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  Eye
} from 'lucide-react';

interface CampaignCardProps {
  campaign: {
    id: number;
    name: string;
    type: string;
    participants: number;
    budget: number;
    spent: number;
    leads: number;
    conversions: number;
    status: 'active' | 'paused' | 'completed' | 'draft';
    endDate: string;
    description?: string;
    roi?: number;
  };
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  onViewAnalytics?: (id: number) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  onEdit, 
  onToggleStatus, 
  onViewAnalytics 
}) => {
  const budgetUsed = (campaign.spent / campaign.budget) * 100;
  const conversionRate = campaign.leads > 0 ? (campaign.conversions / campaign.leads) * 100 : 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Active',
          icon: Play
        };
      case 'paused':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Paused',
          icon: Pause
        };
      case 'completed':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Completed',
          icon: Target
        };
      case 'draft':
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Draft',
          icon: Settings
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Unknown',
          icon: Settings
        };
    }
  };

  const config = getStatusConfig(campaign.status);
  const StatusIcon = config.icon;

  return (
    <div className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${config.borderColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.name}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="font-medium">{campaign.type}</span>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{campaign.participants} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Ends {campaign.endDate}</span>
            </div>
          </div>
          {campaign.description && (
            <p className="text-sm text-gray-600 mt-2">{campaign.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon className={config.color} size={16} />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <DollarSign size={14} className="text-blue-600" />
            <span className="text-xs text-gray-600">Budget</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className="bg-blue-600 h-1 rounded-full"
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target size={14} className="text-green-600" />
            <span className="text-xs text-gray-600">Leads</span>
          </div>
          <p className="text-lg font-bold text-green-600">{campaign.leads}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrendingUp size={14} className="text-purple-600" />
            <span className="text-xs text-gray-600">Conversions</span>
          </div>
          <p className="text-lg font-bold text-purple-600">{campaign.conversions}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <BarChart3 size={14} className="text-orange-600" />
            <span className="text-xs text-gray-600">Conv. Rate</span>
          </div>
          <p className="text-lg font-bold text-orange-600">{conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* ROI Display */}
      {campaign.roi !== undefined && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Return on Investment</span>
            <span className={`text-sm font-bold ${campaign.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {campaign.roi >= 0 ? '+' : ''}{campaign.roi.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {campaign.status === 'active' && (
          <button
            onClick={() => onToggleStatus?.(campaign.id)}
            className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <Pause size={14} />
            <span>Pause</span>
          </button>
        )}
        
        {campaign.status === 'paused' && (
          <button
            onClick={() => onToggleStatus?.(campaign.id)}
            className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Play size={14} />
            <span>Resume</span>
          </button>
        )}

        <button
          onClick={() => onViewAnalytics?.(campaign.id)}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Eye size={14} />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => onEdit?.(campaign.id)}
          className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings size={14} />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;