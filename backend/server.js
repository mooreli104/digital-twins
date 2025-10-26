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

// Routes
// TODO: Import route handlers
app.use('/api', router);


// Redis Setup
// TODO: Create Redis client and subscriber
// Redis + WebSocket handling
await sub.subscribe('greenhouse:sensors', (message) => {
  console.log('📡 Received sensor message:', message);
  io.emit('sensor_data', JSON.parse(message));
});


// WebSocket Setup
// TODO: Handle socket connections and emit sensor data
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`❌ Client disconnected: ${socket.id}`));
});

// Server Start
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
