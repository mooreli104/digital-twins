import { supabase } from '../config/database.js';
import { cache, sub, CHANNELS } from '../config/redis.js';

// API Routes
// Purpose: REST endpoints for frontend

import express from 'express';

const router = express.Router();

// GET /api/sensors/current - Get latest sensor readings
router.get('/sensors/current', async (req, res) => {
  // TODO: Fetch from Redis cache
  sensor_data = sub.subscribe(CHANNELS.SENSORS)
  res.send(sensor_data)
});

// GET /api/sensors/history - Get historical data
router.get('/sensors/history', async (req, res) => {
  // TODO: Query Supabase sensor_history table
  // Query params: ?timeRange=7d
  const { data, error } = await supabase
    .from("sensor_history")
    .select("*")

  if (error) throw error

  res.send(data)
});

// GET /api/alerts - Get alert history
router.get('/alerts', async (req, res) => {
  // TODO: Query Supabase alerts table
  const { data, error } = await supabase
  .from("alerts")
  .select("*")

  if (error) throw error

  res.send(data)
});

// POST /api/alerts/:id/resolve - Mark alert as resolved
router.post('/alerts/:id/resolve', async (req, res) => {
  // TODO: Update alert in Supabase
  const id = req.query.id

  const { data, error } = await supabase
  .from("alerts")
  .update({resolved: true})
  .eq("id", id);

  if (error) throw error;  
});

// GET /api/metrics/water-savings - Get water savings data
router.get('/metrics/water-savings', async (req, res) => {
  const { data, error } = await supabase
  .from("irrigation_events")
  .select("water_amount");

  if (error) throw error;

  const total = data.reduce((sum, row) => sum + row.water_amount, 0);
  res.send(total);
});

export default router;
