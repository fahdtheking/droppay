import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AgentSlotProps {
  agentName: string;
  description: string;
  isActive?: boolean;
  className?: string;
}

const AgentSlot: React.FC<AgentSlotProps> = ({ 
  agentName, 
  description, 
  isActive = true, 
  className = '' 
}) => {
  return (
    <div className={`bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-purple-600' : 'bg-gray-400'}`}>
          <Bot className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-gray-900">{agentName}</h3>
            {isActive && <Sparkles className="text-purple-600" size={14} />}
          </div>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
          {isActive && (
            <div className="mt-2 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSlot;