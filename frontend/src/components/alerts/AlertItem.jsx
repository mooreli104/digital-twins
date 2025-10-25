// Alert Item Component
// Purpose: Individual alert card with icon and action button
//
// Props:
// - alert: { id, type, message, timestamp, resolved }
// - onResolve: callback function when resolved

import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

function AlertItem({ alert, onResolve }) {
  // Icon selection based on alert type
  const getIcon = () => {
    switch (alert.type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Background color based on type
  const getBgColor = () => {
    if (alert.resolved) return 'bg-gray-50 border-gray-200 opacity-60';

    switch (alert.type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      return date.toLocaleDateString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className={`border rounded-lg p-3 ${getBgColor()} transition-all`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${alert.resolved ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
            {alert.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatTimestamp(alert.created_at || alert.timestamp)}
            {alert.resolved && ' • Resolved'}
          </p>
        </div>

        {!alert.resolved && onResolve && (
          <button
            className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => onResolve(alert.id)}
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}

export default AlertItem;
