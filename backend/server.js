// Node.js Backend Server
// Purpose: WebSocket server that reads from Redis and broadcasts to React frontend
//
// Features:
// - Subscribe to Redis pub/sub channel
// - WebSocket connections with Socket.io
// - REST API endpoints
// - Supabase integration for auth and persistence
// - Alert detection logic

import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { sub, cache, pub, CHANNELS } from './config/redis.js';
import router from './routes/api.js'; // if api.js is in the same directory
import cors from 'cors';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const ALLOWED_ORIGINS = [FRONTEND_URL, 'http://localhost', 'http://127.0.0.1'];


const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(json());

// Store latest ESP32 sensor data in memory
let latestESP32Data = null;

// Routes
// TODO: Import route handlers for Redis/simulator data

// ========== ESP32 HARDWARE ROUTE (separate from simulator/Redis) ==========
// POST endpoint for ESP32 hardware to send sensor data
app.post('/api/sensors/esp32', (req, res) => {
  try {
    const { temperature, humidity, soil_moisture, light_level, co2_ppm } = req.body;

    // Validate required fields (ESP32 sends these 3 physically)
    if (temperature === undefined || humidity === undefined || soil_moisture === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required sensor data (temperature, humidity, soil_moisture)'
      });
    }

    // Store latest ESP32 data with timestamp
    latestESP32Data = {
      temperature: Number(temperature),
      humidity: Number(humidity),
      soil_moisture: Number(soil_moisture),
      light_level: Number(light_level) || 600,  // Placeholder from ESP32
      co2_ppm: Number(co2_ppm) || 700,          // Placeholder from ESP32
      timestamp: new Date().toISOString(),
      source: 'ESP32'  // Mark as hardware data
    };

    console.log('🔧 ESP32 Hardware Data:', latestESP32Data);

    // Broadcast to all connected WebSocket clients
    io.emit('esp32-update', latestESP32Data);
    console.log('📡 Broadcasted ESP32 data to', io.engine.clientsCount, 'client(s)');

    res.json({
      success: true,
      message: 'ESP32 data received and broadcasted',
      data: latestESP32Data
    });
  } catch (error) {
    console.error('❌ Error processing ESP32 data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET endpoint to retrieve latest ESP32 data
app.get('/api/sensors/esp32/current', (req, res) => {
  if (!latestESP32Data) {
    return res.status(404).json({
      success: false,
      error: 'No ESP32 data available yet'
    });
  }

  res.json({
    success: true,
    data: latestESP32Data
  });
});
app.use('/api', router);


// Redis Setup
// TODO: Create Redis client and subscriber for simulator data

// WebSocket Setup - Handle connections
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Send latest ESP32 data immediately upon connection (if available)
  if (latestESP32Data) {
    socket.emit('esp32-update', latestESP32Data);
    console.log('📤 Sent latest ESP32 data to new client');
  }

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Server Start
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
