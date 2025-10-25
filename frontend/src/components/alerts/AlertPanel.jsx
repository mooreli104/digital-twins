// Alert Panel Component
// Purpose: Display active and recent alerts
//
// Features:
// - Real-time toast notifications
// - Alert history list
// - Resolve button for each alert

import React from 'react';
import AlertItem from './AlertItem';

function AlertPanel({ alerts }) {
  // TODO: Implement alert display logic
  // - Filter active vs resolved
  // - Sort by timestamp (newest first)
  // - Show max 10 recent alerts

  return (
    <div className="space-y-3">
      {alerts && alerts.length > 0 ? (
        alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No active alerts
        </p>
      )}
    </div>
  );
}

export default AlertPanel;
