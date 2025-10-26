// Alert Panel Component
// Purpose: Display active and recent alerts
//
// Features:
// - Real-time alert list
// - Alert history
// - Resolve button for each alert

import React from 'react';
import AlertItem from './AlertItem';

function AlertPanel({ alerts, onResolve }) {
  // Filter and sort alerts (newest first, unresolved first)
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Unresolved alerts first
    if (a.resolved !== b.resolved) {
      return a.resolved ? 1 : -1;
    }
    // Then by timestamp (newest first)
    return new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp);
  });

  // Show max 10 alerts
  const displayAlerts = sortedAlerts.slice(0, 5);

  return (
    <div className="space-y-3">
      {displayAlerts.length > 0 ? (
        displayAlerts.map((alert, index) => (
          <AlertItem
            key={alert.id || `alert-${index}`}
            alert={alert}
            onResolve={onResolve}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✓</div>
          <p className="text-sm text-gray-500">
            All systems optimal
          </p>
          <p className="text-xs text-gray-400 mt-1">
            No active alerts
          </p>
        </div>
      )}
    </div>
  );
}

export default AlertPanel;
