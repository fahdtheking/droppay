import React from 'react';
import { FileText, Download, Star, Calendar, User } from 'lucide-react';

interface ResourceCardProps {
  resource: {
    id: number;
    type: string;
    title: string;
    author: string;
    downloads: number;
    rating: number;
    category: string;
    date: string;
    description?: string;
    tags?: string[];
  };
  onDownload?: (id: number) => void;
  onRate?: (id: number, rating: number) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDownload, onRate }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return '💡';
      case 'template': return '📄';
      case 'data': return '📊';
      case 'guide': return '📚';
      case 'tool': return '🔧';
      default: return '📁';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategy': return 'bg-yellow-100 text-yellow-800';
      case 'template': return 'bg-blue-100 text-blue-800';
      case 'data': return 'bg-green-100 text-green-800';
      case 'guide': return 'bg-purple-100 text-purple-800';
      case 'tool': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getTypeIcon(resource.type)}</div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
              {resource.category}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
        )}
        
        {/* Tags */}
        {resource.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {resource.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download size={14} />
            <span>{resource.downloads}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>{resource.date}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onDownload?.(resource.id)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Star size={16} />
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;