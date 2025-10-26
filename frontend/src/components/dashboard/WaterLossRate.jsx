// Water Loss Rate Component
// Purpose: Calculate and display water loss rate based on sensor data
//
// Calculates water loss rate by analyzing:
// - Soil moisture decline over time
// - Temperature impact (higher temp = more evapotranspiration)
// - Humidity impact (lower humidity = more evaporation)
// - Historical trends from sensor data

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Droplet, TrendingUp, TrendingDown } from 'lucide-react';
import { getSensorHistory } from '../../services/api';

function WaterLossRate() {
  const [lossData, setLossData] = useState([]);
  const [currentRate, setCurrentRate] = useState(0);
  const [averageRate, setAverageRate] = useState(0);
  const [trend, setTrend] = useState('stable'); // 'increasing', 'decreasing', 'stable'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and calculate water loss rate
  useEffect(() => {
    const calculateWaterLoss = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch last 24 hours of sensor data
        const data = await getSensorHistory('24h');

        if (!data || data.length < 2) {
          setError('Insufficient data for water loss calculation');
          setLoading(false);
          return;
        }

        // Reverse to get chronological order (oldest to newest)
        const chronologicalData = data.reverse();

        // Calculate water loss rate for each data point
        const lossRates = [];

        for (let i = 1; i < chronologicalData.length; i++) {
          const prev = chronologicalData[i - 1];
          const curr = chronologicalData[i];

          // Calculate time difference in hours
          const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / (1000 * 60 * 60);

          if (timeDiff > 0) {
            // Calculate soil moisture change
            const moistureChange = prev.soil_moisture - curr.soil_moisture;

            // Calculate base loss rate (% per hour)
            let lossRate = moistureChange / timeDiff;

            // Environmental factor adjustments
            // Higher temperature increases evapotranspiration
            const tempFactor = curr.temperature > 75 ? 1 + ((curr.temperature - 75) * 0.02) : 1;

            // Lower humidity increases evaporation
            const humidityFactor = curr.humidity < 65 ? 1 + ((65 - curr.humidity) * 0.01) : 1;

            // Adjusted loss rate considering environmental factors
            const adjustedLossRate = lossRate * tempFactor * humidityFactor;

            // Only track positive loss (ignore irrigation events which increase moisture)
            if (adjustedLossRate > 0) {
              lossRates.push({
                timestamp: new Date(curr.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                fullTimestamp: curr.timestamp,
                lossRate: parseFloat(adjustedLossRate.toFixed(3)),
                temperature: curr.temperature,
                humidity: curr.humidity,
                soilMoisture: curr.soil_moisture
              });
            }
          }
        }

        // Calculate statistics
        if (lossRates.length > 0) {
          const recentRate = lossRates[lossRates.length - 1].lossRate;
          const avgRate = lossRates.reduce((sum, item) => sum + item.lossRate, 0) / lossRates.length;

          setCurrentRate(recentRate);
          setAverageRate(avgRate);
          setLossData(lossRates);

          // Determine trend based on recent vs average
          if (recentRate > avgRate * 1.15) {
            setTrend('increasing');
          } else if (recentRate < avgRate * 0.85) {
            setTrend('decreasing');
          } else {
            setTrend('stable');
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error calculating water loss rate:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    calculateWaterLoss();

    // Refresh every 5 minutes
    const interval = setInterval(calculateWaterLoss, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-gray-800">
            {data.timestamp}
          </p>
          <p className="text-sm text-blue-600">
            Loss Rate: <span className="font-bold">{data.lossRate.toFixed(3)}%/hr</span>
          </p>
          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
            <p>Soil Moisture: {data.soilMoisture.toFixed(1)}%</p>
            <p>Temperature: {data.temperature.toFixed(1)}°F</p>
            <p>Humidity: {data.humidity.toFixed(1)}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Get trend color and icon
  const getTrendDisplay = () => {
    switch (trend) {
      case 'increasing':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: <TrendingUp className="w-5 h-5" />,
          label: 'Increasing'
        };
      case 'decreasing':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: <TrendingDown className="w-5 h-5" />,
          label: 'Decreasing'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: <Droplet className="w-5 h-5" />,
          label: 'Stable'
        };
    }
  };

  const trendDisplay = getTrendDisplay();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-600" />
          Water Loss Rate
        </h3>
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">Loading water loss data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-600" />
          Water Loss Rate
        </h3>
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Droplet className="w-5 h-5 text-blue-600" />
        Water Loss Rate
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Current Rate */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Current</p>
          <p className="text-2xl font-bold text-blue-600">
            {currentRate.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600">%/hour</p>
        </div>

        {/* Average Rate */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">24hr Avg</p>
          <p className="text-2xl font-bold text-gray-700">
            {averageRate.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600">%/hour</p>
        </div>

        {/* Trend */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Trend</p>
          <div className={`flex items-center justify-center gap-1 ${trendDisplay.color}`}>
            {trendDisplay.icon}
            <span className="text-xs font-medium">{trendDisplay.label}</span>
          </div>
        </div>
      </div>

      {/* Trend Indicator Bar */}
      <div className={`${trendDisplay.bgColor} ${trendDisplay.color} rounded-lg p-3 mb-4 text-sm`}>
        <p className="font-medium">
          {trend === 'increasing' && 'Water loss is higher than average. Consider checking irrigation or environmental controls.'}
          {trend === 'decreasing' && 'Water loss is lower than average. Conditions are favorable.'}
          {trend === 'stable' && 'Water loss rate is stable and within normal range.'}
        </p>
      </div>

      {/* Chart */}
      {lossData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lossData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />

            <YAxis
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
              label={{ value: '%/hr', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              formatter={() => 'Water Loss Rate'}
            />

            {/* Average reference line */}
            <Line
              type="monotone"
              dataKey={() => averageRate}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Average"
            />

            {/* Actual loss rate */}
            <Line
              type="monotone"
              dataKey="lossRate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              animationDuration={500}
              name="Loss Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">No water loss data available</div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Water loss rate calculated from soil moisture decline, adjusted for temperature and humidity effects.
          Excludes irrigation events.
        </p>
      </div>
    </div>
  );
}

export default WaterLossRate;
