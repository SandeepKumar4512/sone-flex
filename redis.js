// backend/redis.js
const redis = require('redis');

// Redis client बनाएं
const client = redis.createClient({
  url: 'redis://127.0.0.1:6379', // Local Redis server
  legacyMode: true
});

// Redis connect करना
client.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch(err => console.error('❌ Redis connection error:', err));

module.exports = client;
