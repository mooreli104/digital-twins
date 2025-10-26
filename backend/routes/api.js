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
  try {
    const { timeRange = '7d', greenhouse_id, sensor_type } = req.query;

    // Parse timeRange (e.g., '7d', '24h', '30d', '1h')
    const parseTimeRange = (range) => {
      const match = range.match(/^(\d+)([hd])$/);
      if (!match) return 7 * 24 * 60 * 60 * 1000; // Default to 7 days in ms

      const value = parseInt(match[1]);
      const unit = match[2];

      if (unit === 'h') {
        return value * 60 * 60 * 1000; // hours to ms
      } else if (unit === 'd') {
        return value * 24 * 60 * 60 * 1000; // days to ms
      }
      return 7 * 24 * 60 * 60 * 1000; // Default to 7 days
    };

    // Calculate timestamp for the time range
    const millisecondsAgo = parseTimeRange(timeRange);
    const startTime = new Date(Date.now() - millisecondsAgo).toISOString();

    // Build query
    let query = supabase
      .from('sensor_history')
      .select('*')
      .gte('timestamp', startTime)
      .order('timestamp', { ascending: false });

    // Optional filters
    if (greenhouse_id) {
      query = query.eq('greenhouse_id', greenhouse_id);
    }

    if (sensor_type) {
      query = query.eq('sensor_type', sensor_type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sensor history:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error('Unexpected error in /api/sensors/history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/alerts - Get alert history
router.get('/alerts', async (req, res) => {
  try {
    const { greenhouse_id, resolved } = req.query;

    let query = supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by greenhouse if provided
    if (greenhouse_id) {
      query = query.eq('greenhouse_id', greenhouse_id);
    }

    // Filter by resolved status if provided
    if (resolved !== undefined) {
      query = query.eq('resolved', resolved === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching alerts:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error('Unexpected error in /api/alerts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/alerts/:id/resolve - Mark alert as resolved
router.post('/alerts/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error resolving alert:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error in /api/alerts/:id/resolve:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
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
