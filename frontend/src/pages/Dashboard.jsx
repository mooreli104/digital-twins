// Main Dashboard Page
// Purpose: Live greenhouse monitoring interface with real-time WebSocket data

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import SensorCard from '../components/dashboard/SensorCard';
import AlertPanel from '../components/alerts/AlertPanel';
import MetricsPanel from '../components/metrics/MetricsPanel';
import {
  detectAlerts,
  saveAlert,
  getRecentAlerts,
  resolveAlert,
} from '../services/alertService';
import {
  saveIrrigationEvent,
  getRecentIrrigationEvents,
} from '../services/irrigationService';
import { useESP32WebSocket } from '../hooks/useWebSocket';

function Dashboard() {
  const { user, signOut } = useAuth();

  // ESP32 Hardware WebSocket connection
  const { data: esp32Data, connected: esp32Connected, error: esp32Error } = useESP32WebSocket('http://localhost:3001');

  // Live sensor data
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soil_moisture: 0,
    light_level: 0,
    co2: 0,
  });

  // Alerts + irrigation state
  const [alerts, setAlerts] = useState([]);
  const [previousAlerts, setPreviousAlerts] = useState({});
  const [irrigationEvents, setIrrigationEvents] = useState([]);
  const [lastIrrigationTime, setLastIrrigationTime] = useState(null);

  // Thresholds (tomato greenhouse)
  const sensorConfig = [
    { name: 'Temperature', key: 'temperature', unit: '°F', optimalMin: 65, optimalMax: 85, criticalMin: 55, criticalMax: 95 },
    { name: 'Humidity', key: 'humidity', unit: '%', optimalMin: 60, optimalMax: 80, criticalMin: 40, criticalMax: 90 },
    { name: 'Soil Moisture', key: 'soil_moisture', unit: '%', optimalMin: 40, optimalMax: 60, criticalMin: 30, criticalMax: 75 },
    { name: 'Light Level', key: 'light_level', unit: ' lux', optimalMin: 400, optimalMax: 800, criticalMin: 200, criticalMax: 1000 },
    { name: 'CO₂', key: 'co2_ppm', unit: ' ppm', optimalMin: 400, optimalMax: 1000, criticalMin: 300, criticalMax: 1500 },
  ];

  // Update sensor data whenever new data arrives (ESP32 or Simulator)
  useEffect(() => {
    if (esp32Data) {
      const source = esp32Data.source || 'Unknown';
      console.log(`📊 Updating dashboard with ${source} data:`, esp32Data);
      setSensorData({
        temperature: esp32Data.temperature,
        humidity: esp32Data.humidity,
        soil_moisture: esp32Data.soil_moisture,
        light_level: esp32Data.light_level || 600,
        co2: esp32Data.co2_ppm || 700
      });
    }
  }, [esp32Data]);

  // Connect to WebSocket backend
  useEffect(() => {
    const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001');

    socket.on('connect', () => console.log('🛰️ Connected to WebSocket server'));
    socket.on('disconnect', () => console.log('❌ Disconnected from WebSocket server'));

    socket.on('sensor_data', (data) => {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        console.log('📡 Incoming sensor data:', parsed);
        setSensorData(parsed);
      } catch (err) {
        console.error('Failed to parse sensor data:', err);
      }
    });

    return () => socket.disconnect();
  }, []);

  // Load recent alerts + irrigation history from Supabase on mount
  useEffect(() => {
    getRecentAlerts(10).then(setAlerts).catch(console.error);
    getRecentIrrigationEvents(100)
      .then((events) => setIrrigationEvents(events))
      .catch(console.error);
  }, []);

  // Detect and save new alerts whenever new sensor data arrives
  useEffect(() => {
    const newAlerts = detectAlerts(sensorData, sensorConfig, previousAlerts);
    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev]);
      const updatedPrev = { ...previousAlerts };
      newAlerts.forEach((alert) => {
        updatedPrev[alert.alertKey] = Date.now();
      });
      setPreviousAlerts(updatedPrev);

      newAlerts.forEach((alert) => {
        saveAlert(alert)
          .then((savedAlert) => {
            setAlerts((prev) =>
              prev.map((a) =>
                a.alertKey === alert.alertKey && !a.id ? savedAlert : a
              )
            );
          })
          .catch((err) => console.error('Failed to save alert:', err));
      });
    }

    // Clean up old alerts (>5 min old)
    const now = Date.now();
    const cleanedPrev = {};
    Object.entries(previousAlerts).forEach(([key, timestamp]) => {
      if (now - timestamp < 5 * 60 * 1000) cleanedPrev[key] = timestamp;
    });
    if (Object.keys(cleanedPrev).length !== Object.keys(previousAlerts).length) {
      setPreviousAlerts(cleanedPrev);
    }
  }, [sensorData]);

  // Monitor soil moisture and trigger irrigation when needed
  useEffect(() => {
    const soilMoisture = sensorData.soil_moisture;
    const IRRIGATION_THRESHOLD = 30; // Trigger irrigation below 30%
    const IRRIGATION_COOLDOWN = 60000; // Don't irrigate more than once per minute

    const now = Date.now();
    const timeSinceLastIrrigation = lastIrrigationTime ? now - lastIrrigationTime : Infinity;

    if (soilMoisture > 0 && soilMoisture < IRRIGATION_THRESHOLD && timeSinceLastIrrigation > IRRIGATION_COOLDOWN) {
      console.log(`💧 Soil moisture low (${soilMoisture.toFixed(1)}%) - triggering irrigation`);

      const event = {
        timestamp: new Date().toISOString(),
        amount: 0.5, // gallons
        triggered_by: 'automatic'
      };

      // Update last irrigation time
      setLastIrrigationTime(now);

      // Add to local state
      setIrrigationEvents(prevEvents => [...prevEvents, event]);

      // Save to Supabase
      saveIrrigationEvent(event)
        .then(savedEvent => {
          console.log('✅ Irrigation event saved to Supabase');
          // Update local event with Supabase ID
          setIrrigationEvents(prevEvents =>
            prevEvents.map(e => e.timestamp === event.timestamp && !e.id ? savedEvent : e)
          );
        })
        .catch(err => console.error('Failed to save irrigation event:', err));

      // Note: In a real system, this would trigger actual irrigation hardware
      // For now, we just log the event. The simulator will naturally vary moisture levels.
    }
  }, [sensorData.soil_moisture, lastIrrigationTime]);

  // Allow user to resolve alerts
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

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">FarmTwin Dashboard</h1>
          <p className="text-gray-600">Tomato Greenhouse - Live Monitoring</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">Logged in as: {user.email}</p>
          )}

          {/* ESP32 Connection Status */}
          <div className="mt-2 flex items-center gap-2">
            {esp32Connected ? (
              <span className="flex items-center text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                ESP32 Hardware Connected
              </span>
            ) : (
              <span className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Waiting for ESP32...
              </span>
            )}
            {esp32Error && (
              <span className="text-xs text-red-500">({esp32Error})</span>
            )}
          </div>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
        >
          Sign Out
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Live Sensor Readings
            </h2>
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

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Sustainability Metrics</h3>
            <MetricsPanel
              irrigationEvents={irrigationEvents}
              sensorData={sensorData}
              sensorConfig={sensorConfig}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Alerts
              {alerts.filter((a) => !a.resolved).length > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {alerts.filter((a) => !a.resolved).length}
                </span>
              )}
            </h3>
            <AlertPanel alerts={alerts} onResolve={handleResolveAlert} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
