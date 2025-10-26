// Metrics Panel Component
// Purpose: Display sustainability metrics (water savings, efficiency)
//
// Features:
// - Water saved today/this week
// - Comparison to traditional watering
// - Irrigation event tracking

import React from 'react';
import { Droplet, TrendingUp, Percent } from 'lucide-react';

function MetricsPanel({ irrigationEvents = [], sensorData, sensorConfig }) {
  // Constants for water usage
  const TRADITIONAL_WATER_PER_DAY = 5; // gallons/day (fixed schedule watering)
  const WATER_PER_IRRIGATION = 0.5; // gallons per smart irrigation event

  // Calculate daily water usage
  const calculateDailyUsage = () => {
    const today = new Date();
    const todayEvents = irrigationEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate.toDateString() === today.toDateString();
    });

    const smartWaterUsed = todayEvents.length * WATER_PER_IRRIGATION;
    const waterSaved = TRADITIONAL_WATER_PER_DAY - smartWaterUsed;

    return {
      smartUsed: smartWaterUsed,
      saved: waterSaved > 0 ? waterSaved : 0,
      events: todayEvents.length
    };
  };

  // Calculate weekly water usage
  const calculateWeeklyUsage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekEvents = irrigationEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= weekAgo;
    });

    const daysElapsed = 7;
    const traditionalWeekly = TRADITIONAL_WATER_PER_DAY * daysElapsed;
    const smartWeekly = weekEvents.length * WATER_PER_IRRIGATION;
    const savedWeekly = traditionalWeekly - smartWeekly;

    return {
      saved: savedWeekly > 0 ? savedWeekly : 0,
      percentage: traditionalWeekly > 0 ? ((savedWeekly / traditionalWeekly) * 100).toFixed(0) : 0
    };
  };

  // Calculate optimal range adherence
  const calculateOptimalScore = () => {
    if (!sensorData || !sensorConfig) return 0;

    let inRangeCount = 0;
    sensorConfig.forEach(sensor => {
      const value = sensorData[sensor.key];
      if (value >= sensor.optimalMin && value <= sensor.optimalMax) {
        inRangeCount++;
      }
    });

    return Math.round((inRangeCount / sensorConfig.length) * 100);
  };

  const daily = calculateDailyUsage();
  const weekly = calculateWeeklyUsage();
  const optimalScore = calculateOptimalScore();

  return (
    <div className="space-y-4">
      {/* Water Saved Today */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Droplet className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">
            Water Saved Today
          </span>
        </div>

        <div className="ml-7">
          <p className="text-3xl font-bold text-blue-600">
            {daily.saved.toFixed(1)} <span className="text-lg">gal</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            vs. traditional watering ({TRADITIONAL_WATER_PER_DAY} gal/day)
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {daily.events} irrigation events • {daily.smartUsed.toFixed(1)} gal used
          </p>
        </div>
      </div>

      {/* Weekly Savings */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">
            This Week
          </span>
        </div>

        <div className="ml-7">
          <p className="text-2xl font-semibold text-green-600">
            {weekly.saved.toFixed(1)} <span className="text-base">gal saved</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {weekly.percentage}% reduction
          </p>
        </div>
      </div>

      {/* Optimal Range Adherence */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Percent className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            System Health
          </span>
        </div>

        <div className="ml-7">
          <p className="text-3xl font-bold text-gray-800">
            {optimalScore}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            sensors in optimal range
          </p>

          {/* Visual bar */}
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                optimalScore >= 80 ? 'bg-green-500' :
                optimalScore >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${optimalScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;
