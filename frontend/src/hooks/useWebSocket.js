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

  useEffect(() => {
    // Initialize socket connection
    console.log('🔌 Connecting to backend WebSocket:', serverUrl);
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Listen for ESP32 sensor updates
    socket.on('esp32-update', (newData) => {
      console.log('📡 Received ESP32 data:', newData);
      setData(newData);
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
    });

    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err.message);
      setError(err.message);
      setConnected(false);
    });

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting WebSocket');
      socket.disconnect();
    };
  }, [serverUrl]);

  return { data, connected, error };
}
