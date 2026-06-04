const Redis = require('ioredis');

let client = null;
let isFallback = false;
const fallbackStore = new Map();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

try {
  client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    retryStrategy(times) {
      // If it fails once, stop retrying and activate fallback
      isFallback = true;
      return null;
    }
  });

  client.on('error', (err) => {
    if (!isFallback) {
      console.warn('⚠️ Redis not running or connection failed. Falling back to in-memory store.');
      isFallback = true;
    }
  });

  client.on('connect', () => {
    if (!isFallback) {
      console.log('✅ Redis Connected');
    }
  });
} catch (e) {
  console.warn('⚠️ Redis initialization error. Falling back to in-memory store.', e);
  isFallback = true;
}

// Unified client wrapping standard commands used in matchmaking
const redisClient = {
  async set(key, value, expirySeconds) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    if (isFallback) {
      fallbackStore.set(key, stringValue);
      if (expirySeconds) {
        setTimeout(() => {
          fallbackStore.delete(key);
        }, expirySeconds * 1000);
      }
      return 'OK';
    }
    
    try {
      if (expirySeconds) {
        return await client.set(key, stringValue, 'EX', expirySeconds);
      }
      return await client.set(key, stringValue);
    } catch (err) {
      console.warn('⚠️ Redis command set failed. Switching to in-memory fallback.');
      isFallback = true;
      fallbackStore.set(key, stringValue);
      return 'OK';
    }
  },

  async get(key) {
    if (isFallback) {
      return fallbackStore.get(key) || null;
    }
    
    try {
      return await client.get(key);
    } catch (err) {
      console.warn('⚠️ Redis command get failed. Switching to in-memory fallback.');
      isFallback = true;
      return fallbackStore.get(key) || null;
    }
  },

  async del(key) {
    if (isFallback) {
      return fallbackStore.delete(key) ? 1 : 0;
    }
    
    try {
      return await client.del(key);
    } catch (err) {
      console.warn('⚠️ Redis command del failed. Switching to in-memory fallback.');
      isFallback = true;
      return fallbackStore.delete(key) ? 1 : 0;
    }
  },

  async keys(pattern) {
    if (isFallback) {
      const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return Array.from(fallbackStore.keys()).filter(k => regexPattern.test(k));
    }
    
    try {
      return await client.keys(pattern);
    } catch (err) {
      console.warn('⚠️ Redis command keys failed. Switching to in-memory fallback.');
      isFallback = true;
      const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return Array.from(fallbackStore.keys()).filter(k => regexPattern.test(k));
    }
  }
};

module.exports = redisClient;
