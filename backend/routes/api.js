// API Routes
// Purpose: REST endpoints for frontend

const express = require('express');
const router = express.Router();

// GET /api/sensors/current - Get latest sensor readings
router.get('/sensors/current', async (req, res) => {
  // TODO: Fetch from Redis cache
});

// GET /api/sensors/history - Get historical data
router.get('/sensors/history', async (req, res) => {
  // TODO: Query Supabase sensor_history table
  // Query params: ?timeRange=7d
});

// GET /api/alerts - Get alert history
router.get('/alerts', async (req, res) => {
  // TODO: Query Supabase alerts table
});

// POST /api/alerts/:id/resolve - Mark alert as resolved
router.post('/alerts/:id/resolve', async (req, res) => {
  // TODO: Update alert in Supabase
});

// GET /api/metrics/water-savings - Get water savings data
router.get('/metrics/water-savings', async (req, res) => {
  // TODO: Calculate and return water savings
});

module.exports = router;
