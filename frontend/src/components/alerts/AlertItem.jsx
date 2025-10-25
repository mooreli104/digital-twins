// Alert Item Component
// Purpose: Individual alert card with icon and action button
//
// Props:
// - alert: { id, type, message, timestamp, resolved }

import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

function AlertItem({ alert }) {
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
  const bgColor = alert.type === 'critical'
    ? 'bg-red-50 border-red-200'
    : alert.type === 'warning'
    ? 'bg-yellow-50 border-yellow-200'
    : 'bg-blue-50 border-blue-200';

  return (
    <div className={`border rounded-lg p-3 ${bgColor}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {alert.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {/* TODO: Format timestamp */}
            {alert.timestamp}
          </p>
        </div>

        {!alert.resolved && (
          <button
            className="text-xs text-gray-600 hover:text-gray-900"
            onClick={() => {/* TODO: Handle resolve */}}
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}

export default AlertItem;
