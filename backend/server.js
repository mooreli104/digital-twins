// Node.js Backend Server
// Purpose: WebSocket server that reads from Redis and broadcasts to React frontend
//
// Features:
// - Subscribe to Redis pub/sub channel
// - WebSocket connections with Socket.io
// - REST API endpoints
// - Supabase integration for auth and persistence
// - Alert detection logic

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// TODO: Import route handlers

// Redis Setup
// TODO: Create Redis client and subscriber

// WebSocket Setup
// TODO: Handle socket connections and emit sensor data

// Server Start
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
