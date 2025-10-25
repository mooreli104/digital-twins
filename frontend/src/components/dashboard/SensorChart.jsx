// Sensor Chart Component
// Purpose: Real-time line charts using Recharts
//
// Props:
// - data: Array of sensor readings with timestamps
// - sensorKey: Which sensor to display (e.g., 'temperature')
// - optimalRange: { min, max } for optimal zone shading

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function SensorChart({ data, sensorKey, optimalRange }) {
  // TODO: Implement chart with:
  // - Time-series data (last 60 readings)
  // - Optimal range shaded area
  // - Smooth line animation

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        {/* TODO: Add optimal range reference lines */}
        <Line type="monotone" dataKey={sensorKey} stroke="#22c55e" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SensorChart;
