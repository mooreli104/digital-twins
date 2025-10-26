// Sensor Chart Component
// Purpose: Real-time line charts using Recharts with Supabase data
//
// Props:
// - greenhouseId: UUID of the greenhouse to fetch data for
// - sensorKey: Which sensor to display (e.g., 'temperature', 'humidity', 'soil_moisture', 'light_level', 'co2')
// - optimalRange: { min, max } for optimal zone shading
// - criticalRange: { min, max } for critical thresholds
// - title: Chart title (e.g., 'Temperature')
// - unit: Unit to display (e.g., '°F', '%', 'ppm')

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend
} from 'recharts';
import { supabase } from '../../services/supabase';

function SensorChart({
  greenhouseId,
  sensorKey,
  optimalRange,
  criticalRange,
  title,
  unit
}) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sensor history from Supabase
  useEffect(() => {
    const fetchSensorHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query last 60 readings for the specified greenhouse
        const { data, error: fetchError } = await supabase
          .from('sensor_history')
          .select('temperature, humidity, soil_moisture, light_level, co2, timestamp')
          .eq('greenhouse_id', greenhouseId)
          .order('timestamp', { ascending: false })
          .limit(60);

        if (fetchError) {
          throw fetchError;
        }

        // Reverse to show oldest to newest
        const reversedData = (data || []).reverse();

        // Format data for Recharts
        const formattedData = reversedData.map(record => ({
          timestamp: new Date(record.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          fullTimestamp: record.timestamp,
          value: parseFloat(record[sensorKey]) || 0,
          temperature: parseFloat(record.temperature),
          humidity: parseFloat(record.humidity),
          soil_moisture: parseFloat(record.soil_moisture),
          light_level: parseFloat(record.light_level),
          co2: parseFloat(record.co2)
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching sensor history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (greenhouseId && sensorKey) {
      fetchSensorHistory();

      // Set up real-time subscription for new data
      const subscription = supabase
        .channel(`sensor_history:${greenhouseId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'sensor_history',
            filter: `greenhouse_id=eq.${greenhouseId}`
          },
          (payload) => {
            const newRecord = payload.new;
            const formattedRecord = {
              timestamp: new Date(newRecord.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              fullTimestamp: newRecord.timestamp,
              value: parseFloat(newRecord[sensorKey]) || 0,
              temperature: parseFloat(newRecord.temperature),
              humidity: parseFloat(newRecord.humidity),
              soil_moisture: parseFloat(newRecord.soil_moisture),
              light_level: parseFloat(newRecord.light_level),
              co2: parseFloat(newRecord.co2)
            };

            // Add new record and keep only last 60
            setChartData(prev => [...prev.slice(-59), formattedRecord]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [greenhouseId, sensorKey]);

  // Custom tooltip to show formatted data
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-gray-800">
            {data.timestamp}
          </p>
          <p className="text-sm text-gray-600">
            {title}: <span className="font-bold">{data.value.toFixed(2)}{unit}</span>
          </p>
          {optimalRange && (
            <p className="text-xs text-gray-500 mt-1">
              Optimal: {optimalRange.min}-{optimalRange.max}{unit}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Determine line color based on current status
  const getLineColor = () => {
    if (!chartData.length) return '#22c55e';

    const latestValue = chartData[chartData.length - 1]?.value;

    if (criticalRange && (latestValue < criticalRange.min || latestValue > criticalRange.max)) {
      return '#ef4444'; // red
    }
    if (optimalRange && (latestValue < optimalRange.min || latestValue > optimalRange.max)) {
      return '#f59e0b'; // yellow
    }
    return '#22c55e'; // green
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />

        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
          label={{ value: unit, angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          formatter={() => title}
        />

        {/* Optimal range shading */}
        {optimalRange && (
          <ReferenceArea
            y1={optimalRange.min}
            y2={optimalRange.max}
            fill="#22c55e"
            fillOpacity={0.1}
            strokeOpacity={0.3}
          />
        )}

        {/* Main data line */}
        <Line
          type="monotone"
          dataKey="value"
          stroke={getLineColor()}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          animationDuration={500}
          name={title}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SensorChart;
