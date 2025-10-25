// Sensor Card Component
// Purpose: Display individual sensor value with status indicator
//
// Props:
// - name: Sensor name (e.g., "Temperature")
// - value: Current reading
// - unit: Measurement unit (e.g., "°F", "%")
// - optimalMin: Lower bound of optimal range
// - optimalMax: Upper bound of optimal range
// - status: 'optimal' | 'warning' | 'critical'

import React from 'react';

function SensorCard({ name, value, unit, optimalMin, optimalMax, status }) {
  // TODO: Implement status color logic
  // optimal = green, warning = yellow, critical = red

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600">{name}</h3>
        {/* TODO: Add status indicator */}
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold">
          {value}
        </span>
        <span className="text-lg text-gray-500 ml-1">{unit}</span>
      </div>

      {/* Optimal Range Indicator */}
      <div className="text-xs text-gray-500">
        Optimal: {optimalMin}-{optimalMax}{unit}
      </div>

      {/* Visual Range Bar */}
      {/* TODO: Add progress bar showing current value in range */}
    </div>
  );
}

export default SensorCard;
