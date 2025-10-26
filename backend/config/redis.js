// Redis Configuration
// Purpose: Redis client setup for pub/sub and caching

import { createClient } from 'redis';

const REDIS_CONFIG = {
  socket:{
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  },
};

const CHANNELS = {
  SENSORS: 'greenhouse:sensors',
  ALERTS: 'greenhouse:alerts',
};

// Create Redis clients
const pub = createClient(REDIS_CONFIG);
const sub = createClient(REDIS_CONFIG);
const cache = createClient(REDIS_CONFIG);

// Handle connection errors
for (const client of [pub, sub, cache]) {
  client.on('error', (err) => console.error('Redis error:', err));
  client.connect(); // connect() returns a promise (Node Redis v4+)
}

export {
  REDIS_CONFIG,
  CHANNELS,
  pub,
  sub,
  cache,
};
