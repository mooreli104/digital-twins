// Sensor Card Component
// Purpose: Display individual sensor value with status indicator
//
// Props:
// - name: Sensor name (e.g., "Temperature")
// - value: Current reading
// - unit: Measurement unit (e.g., "°F", "%")
// - optimalMin: Lower bound of optimal range
// - optimalMax: Upper bound of optimal range
// - criticalMin: Critical low threshold (optional)
// - criticalMax: Critical high threshold (optional)

import React from 'react';

function SensorCard({ name, value, unit, optimalMin, optimalMax, criticalMin, criticalMax }) {
  // Determine status based on value
  const getStatus = () => {
    if (value < criticalMin || value > criticalMax) return 'critical';
    if (value < optimalMin || value > optimalMax) return 'warning';
    return 'optimal';
  };

  const status = getStatus();

  // Color schemes for each status
  const statusColors = {
    optimal: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      dot: 'bg-green-500',
      text: 'text-green-700',
      bar: 'bg-green-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      dot: 'bg-yellow-500',
      text: 'text-yellow-700',
      bar: 'bg-yellow-500'
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      dot: 'bg-red-500',
      text: 'text-red-700',
      bar: 'bg-red-500'
    }
  };

  const colors = statusColors[status];

  // Calculate position for visual indicator (0-100%)
  const calculatePosition = () => {
    const min = criticalMin || 0;
    const max = criticalMax || 100;
    const range = max - min;
    const position = ((value - min) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const position = calculatePosition();

  return (
    <div className={`rounded-lg shadow p-4 border-2 ${colors.border} ${colors.bg} transition-all`}>
      {/* Header with status indicator */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-gray-700">{name}</h3>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`}></div>
          <span className={`text-xs font-medium ${colors.text}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* Main value display */}
      <div className="mb-3">
        <span className="text-4xl font-bold text-gray-800">
          {value?.toFixed(1) ?? '--'}
        </span>
        <span className="text-lg text-gray-500 ml-2">{unit}</span>
      </div>

      {/* Optimal range text */}
      <div className="text-xs text-gray-600 mb-2">
        Optimal: {optimalMin}-{optimalMax}{unit}
      </div>

      {/* Visual range bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Optimal range highlight */}
        <div
          className="absolute h-full bg-green-200 opacity-50"
          style={{
            left: `${((optimalMin - (criticalMin || 0)) / ((criticalMax || 100) - (criticalMin || 0))) * 100}%`,
            width: `${((optimalMax - optimalMin) / ((criticalMax || 100) - (criticalMin || 0))) * 100}%`
          }}
        ></div>

        {/* Current value indicator */}
        <div
          className="absolute top-0 h-full w-1 transform -translate-x-1/2"
          style={{ left: `${position}%` }}
        >
          <div className={`w-1 h-full ${colors.bar}`}></div>
        </div>
      </div>

      {/* Range labels */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">{criticalMin}</span>
        <span className="text-xs text-gray-400">{criticalMax}</span>
      </div>
    </div>
  );
}

export default SensorCard;
