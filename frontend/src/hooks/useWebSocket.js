// WebSocket Hook for ESP32 Hardware Data
// Purpose: Custom React hook for real-time ESP32 sensor data connection
//
// Usage:
// const { data, connected, error } = useESP32WebSocket('http://localhost:3001');

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export function useESP32WebSocket(serverUrl) {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [esp32Active, setESP32Active] = useState(false); // Track if ESP32 is actively sending data

  useEffect(() => {
    // Initialize socket connection
    console.log('🔌 Connecting to backend WebSocket:', serverUrl);
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    let timeoutId = null;

    //Listen for sensor-update events
    socket.on('sensor-update', (newData) => {
      setData(newData);
    });

    // Listen for ESP32 sensor updates
    socket.on('esp32-update', (newData) => {
      console.log('📡 Received ESP32 data:', newData);
      setData(newData);
      setESP32Active(true);

      // Clear previous timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Set timeout to detect if ESP32 stops sending data
      // ESP32 sends every 2 seconds, so if no data for 5 seconds, consider it inactive
      timeoutId = setTimeout(() => {
        console.log('⚠️ ESP32 stopped sending data (timeout)');
        setESP32Active(false);
      }, 5000); // 5 seconds timeout
    });

    // Handle connection events
    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
      setESP32Active(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err.message);
      setError(err.message);
      setConnected(false);
      setESP32Active(false);
    });

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting WebSocket');
      if (timeoutId) clearTimeout(timeoutId);
      socket.disconnect();
    };
  }, [serverUrl]);

  return { data, connected: connected && esp32Active, error };
}
