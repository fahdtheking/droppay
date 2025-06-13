import React from 'react';
import { Trophy, Calendar, Gift, Users, Target, CheckCircle } from 'lucide-react';

interface MilestoneCardProps {
  milestone: {
    id: number;
    name: string;
    target: number;
    current: number;
    reward: string;
    deadline: string;
    status: 'completed' | 'active' | 'upcoming';
    participants?: number;
    description?: string;
  };
  onJoin?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onJoin, onViewDetails }) => {
  const progress = Math.min((milestone.current / milestone.target) * 100, 100);
  const remaining = milestone.target - milestone.current;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          progressColor: 'bg-green-600',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'active':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          progressColor: 'bg-blue-600',
          icon: Target,
          label: 'Active'
        };
      case 'upcoming':
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          progressColor: 'bg-gray-400',
          icon: Calendar,
          label: 'Upcoming'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          progressColor: 'bg-gray-400',
          icon: Target,
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(milestone.status);
  const StatusIcon = config.icon;

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${config.borderColor} ${config.bgColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Trophy className={`${config.color}`} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{milestone.name}</h3>
            {milestone.description && (
              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon className={config.color} size={20} />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className={`text-sm font-bold ${config.color}`}>
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${config.progressColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>${milestone.current.toLocaleString()} raised</span>
          <span>Target: ${milestone.target.toLocaleString()}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Gift size={16} />
          <span className="font-medium">Reward:</span>
          <span>{milestone.reward}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>Deadline: {milestone.deadline}</span>
          </div>
          {milestone.participants && (
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{milestone.participants} participating</span>
            </div>
          )}
        </div>
      </div>

      {/* Status-specific content */}
      {milestone.status === 'active' && remaining > 0 && (
        <div className={`${config.bgColor} rounded-lg p-3 mb-4`}>
          <p className={`text-sm ${config.color}`}>
            <strong>${remaining.toLocaleString()}</strong> remaining to unlock this milestone!
          </p>
        </div>
      )}

      {milestone.status === 'completed' && (
        <div className="bg-green-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800">
            🎉 <strong>Milestone achieved!</strong> Rewards have been distributed.
          </p>
        </div>
      )}

      {milestone.status === 'upcoming' && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            This milestone will become available once the current milestone is completed.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        {milestone.status === 'active' && (
          <button
            onClick={() => onJoin?.(milestone.id)}
            className={`flex-1 py-2 px-4 ${config.color.replace('text-', 'bg-').replace('-600', '-600')} text-white rounded-lg hover:opacity-90 transition-opacity`}
          >
            Contribute
          </button>
        )}
        <button
          onClick={() => onViewDetails?.(milestone.id)}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default MilestoneCard;