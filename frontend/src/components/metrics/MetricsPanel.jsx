// Metrics Panel Component
// Purpose: Display sustainability metrics (water savings, efficiency)
//
// Features:
// - Water saved today/this week
// - Comparison to traditional watering
// - Optimal range adherence score

import React from 'react';
import { Droplet, TrendingUp } from 'lucide-react';

function MetricsPanel({ waterSavings, optimalScore }) {
  // TODO: Receive metrics data from parent

  return (
    <div className="space-y-4">
      {/* Water Savings Card */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Droplet className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">
            Water Saved Today
          </span>
        </div>

        <div className="ml-7">
          <p className="text-2xl font-bold text-blue-600">
            {/* TODO: Display actual savings */}
            -- gal
          </p>
          <p className="text-xs text-gray-500">
            vs. traditional watering
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
          <p className="text-xl font-semibold text-green-600">
            {/* TODO: Display weekly savings */}
            -- gal saved
          </p>
        </div>
      </div>

      {/* Optimal Range Score */}
      <div>
        <span className="text-sm font-medium text-gray-700 block mb-2">
          Optimal Range Adherence
        </span>

        {/* TODO: Add circular progress or bar chart */}
        <div className="ml-0">
          <p className="text-2xl font-bold text-gray-800">
            --%
          </p>
          <p className="text-xs text-gray-500">
            of sensors in optimal range
          </p>
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;
