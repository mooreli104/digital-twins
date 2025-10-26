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

// Create Redis clients
const publisherClient = redis.createClient(REDIS_CONFIG);
const subscriberClient = redis.createClient(REDIS_CONFIG);
const cacheClient = redis.createClient(REDIS_CONFIG);

// Error handling
publisherClient.on('error', (err) => console.error('Redis Publisher Error:', err));
subscriberClient.on('error', (err) => console.error('Redis Subscriber Error:', err));
cacheClient.on('error', (err) => console.error('Redis Cache Error:', err));

// Connect clients
Promise.all([
  publisherClient.connect(),
  subscriberClient.connect(),
  cacheClient.connect()
]).then(() => {
  console.log('Redis clients connected successfully');
}).catch(err => {
  console.error('Failed to connect Redis clients:', err);
});

module.exports = {
  REDIS_CONFIG,
  CHANNELS,
  publisherClient,
  subscriberClient,
  cacheClient,
};
