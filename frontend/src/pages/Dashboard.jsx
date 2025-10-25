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
import AlertPanel from '../components/alerts/AlertPanel';
import { detectAlerts, saveAlert, getRecentAlerts, resolveAlert } from '../services/alertService';

function Dashboard() {
  const { user, signOut } = useAuth();

  // Mock sensor data (will be replaced with real WebSocket data)
  const [sensorData, setSensorData] = useState({
    temperature: 80,
    humidity: 68.5,
    soil_moisture: 45.0,
    light_level: 650,
    co2: 580
  });

  // Alerts state
  const [alerts, setAlerts] = useState([]);
  const [previousAlerts, setPreviousAlerts] = useState({});

  // Tomato greenhouse thresholds
  const sensorConfig = [
    {
      name: 'Temperature',
      key: 'temperature',
      unit: '°F',
      optimalMin: 65,
      optimalMax: 85,
      criticalMin: 55,
      criticalMax: 95
    },
    {
      name: 'Humidity',
      key: 'humidity',
      unit: '%',
      optimalMin: 60,
      optimalMax: 80,
      criticalMin: 40,
      criticalMax: 90
    },
    {
      name: 'Soil Moisture',
      key: 'soil_moisture',
      unit: '%',
      optimalMin: 40,
      optimalMax: 60,
      criticalMin: 30,
      criticalMax: 75
    },
    {
      name: 'Light Level',
      key: 'light_level',
      unit: ' lux',
      optimalMin: 400,
      optimalMax: 800,
      criticalMin: 200,
      criticalMax: 1000
    },
    {
      name: 'CO₂',
      key: 'co2',
      unit: ' ppm',
      optimalMin: 400,
      optimalMax: 1000,
      criticalMin: 300,
      criticalMax: 1500
    }
  ];

  // Load existing alerts from Supabase on mount
  useEffect(() => {
    getRecentAlerts(10).then(setAlerts).catch(console.error);
  }, []);

  // Check for alerts when sensor data changes
  useEffect(() => {
    const newAlerts = detectAlerts(sensorData, sensorConfig, previousAlerts);

    if (newAlerts.length > 0) {
      // Add to local state immediately
      setAlerts(prev => [...newAlerts, ...prev]);

      // Update previousAlerts to avoid duplicates
      const updatedPrevious = { ...previousAlerts };
      newAlerts.forEach(alert => {
        updatedPrevious[alert.alertKey] = Date.now();
      });
      setPreviousAlerts(updatedPrevious);

      // Save to Supabase
      newAlerts.forEach(alert => {
        saveAlert(alert)
          .then(savedAlert => {
            // Update local alert with Supabase ID
            setAlerts(prev => prev.map(a =>
              a.alertKey === alert.alertKey && !a.id ? savedAlert : a
            ));
          })
          .catch(err => console.error('Failed to save alert:', err));
      });
    }

    // Clean up old previous alerts (older than 5 minutes)
    const now = Date.now();
    const cleanedPrevious = {};
    Object.entries(previousAlerts).forEach(([key, timestamp]) => {
      if (now - timestamp < 5 * 60 * 1000) { // 5 minutes
        cleanedPrevious[key] = timestamp;
      }
    });
    if (Object.keys(cleanedPrevious).length !== Object.keys(previousAlerts).length) {
      setPreviousAlerts(cleanedPrevious);
    }
  }, [sensorData]);

  // Handle alert resolution
  const handleResolveAlert = async (alertId) => {
    try {
      await resolveAlert(alertId);
      // Update local state
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true, resolved_at: new Date().toISOString() } : alert
      ));
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  // Simulate changing values (temporary - will be removed when WebSocket is connected)
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: prev.humidity + (Math.random() - 0.5) * 3,
        soil_moisture: prev.soil_moisture - 0.1, // Slowly decrease to trigger alert
        light_level: prev.light_level + (Math.random() - 0.5) * 50,
        co2: prev.co2 + (Math.random() - 0.5) * 20
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Live Sensor Readings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensorConfig.map((sensor) => (
                <SensorCard
                  key={sensor.key}
                  name={sensor.name}
                  value={sensorData[sensor.key]}
                  unit={sensor.unit}
                  optimalMin={sensor.optimalMin}
                  optimalMax={sensor.optimalMax}
                  criticalMin={sensor.criticalMin}
                  criticalMax={sensor.criticalMax}
                />
              ))}
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sensor Trends</h2>
            <p className="text-gray-500 text-sm">Charts coming soon...</p>
          </div>
        </div>

        {/* Right Column - Alerts & Metrics */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Alerts
              {alerts.filter(a => !a.resolved).length > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {alerts.filter(a => !a.resolved).length}
                </span>
              )}
            </h3>
            <AlertPanel alerts={alerts} onResolve={handleResolveAlert} />
          </div>

          {/* Water Savings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Water Savings</h3>
            <p className="text-gray-500 text-sm">Metrics coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
