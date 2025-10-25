// Main Dashboard Page
// Purpose: Live greenhouse monitoring interface
//
// Features:
// - Live sensor value cards
// - Real-time charts
// - Alert notifications
// - Water savings metrics

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SensorCard from '../components/dashboard/SensorCard';
import SensorChart from '../components/dashboard/SensorChart';
import AlertPanel from '../components/alerts/AlertPanel';
import MetricsPanel from '../components/metrics/MetricsPanel';
import { useWebSocket } from '../hooks/useWebSocket';

function Dashboard() {
  const { user, signOut } = useAuth();
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // TODO: Connect to WebSocket
  // const { data, connected } = useWebSocket('http://localhost:3001');

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            FarmTwin Dashboard
          </h1>
          <p className="text-gray-600">Tomato Greenhouse - Live Monitoring</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={signOut}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
        >
          Sign Out
        </button>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sensor Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sensor Value Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* TODO: Map sensor cards */}
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-500 text-sm">Auth test successful!</p>
              <p className="text-2xl font-bold text-green-600 mt-2">✓</p>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sensor Trends</h2>
            <p className="text-gray-500 text-sm">Charts coming soon...</p>
          </div>
        </div>

        {/* Right Column - Alerts & Metrics */}
        <div className="space-y-6">
          {/* Water Savings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Water Savings</h3>
            <p className="text-gray-500 text-sm">Metrics coming soon...</p>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Alerts</h3>
            <p className="text-gray-500 text-sm">Alerts coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
