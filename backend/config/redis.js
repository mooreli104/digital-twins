// Redis Configuration
// Purpose: Redis client setup for pub/sub and caching

const redis = require('redis');

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
};

const CHANNELS = {
  SENSORS: 'greenhouse:sensors',
  ALERTS: 'greenhouse:alerts',
};

// TODO: Create Redis clients
// - Publisher client
// - Subscriber client
// - Cache client

module.exports = {
  REDIS_CONFIG,
  CHANNELS,
};
