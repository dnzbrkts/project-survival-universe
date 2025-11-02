/**
 * Redis Konfigürasyonu
 * Cache ve session yönetimi için Redis bağlantısı
 */

const redis = require('redis');
require('dotenv').config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true
};

// Redis client oluştur
const client = redis.createClient({
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
    connectTimeout: 5000,
    lazyConnect: true
  },
  password: redisConfig.password,
  database: redisConfig.db
});

// Hata yönetimi
client.on('error', (err) => {
  console.error('❌ Redis bağlantı hatası:', err.message);
});

client.on('connect', () => {
  console.log('🔄 Redis bağlantısı kuruluyor...');
});

client.on('ready', () => {
  console.log('✅ Redis bağlantısı hazır');
});

client.on('end', () => {
  console.log('⚠️ Redis bağlantısı sonlandı');
});

/**
 * Redis bağlantısını başlatma
 */
async function connectRedis() {
  try {
    if (!client.isOpen) {
      // 5 saniye timeout ile bağlantı dene
      await Promise.race([
        client.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        )
      ]);
    }
    return true;
  } catch (error) {
    console.error('❌ Redis bağlantı hatası:', error.message);
    return false;
  }
}

/**
 * Redis bağlantısını kapatma
 */
async function disconnectRedis() {
  try {
    if (client.isOpen) {
      await client.quit();
    }
    console.log('✅ Redis bağlantısı kapatıldı');
  } catch (error) {
    console.error('❌ Redis kapatma hatası:', error.message);
  }
}

/**
 * Cache helper fonksiyonları
 */
const cache = {
  /**
   * Değer kaydetme
   * @param {string} key - Anahtar
   * @param {*} value - Değer
   * @param {number} ttl - TTL (saniye)
   */
  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl > 0) {
        await client.setEx(key, ttl, serializedValue);
      } else {
        await client.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      console.error('Cache set hatası:', error);
      return false;
    }
  },

  /**
   * Değer getirme
   * @param {string} key - Anahtar
   * @returns {*} Değer
   */
  async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get hatası:', error);
      return null;
    }
  },

  /**
   * Değer silme
   * @param {string} key - Anahtar
   */
  async del(key) {
    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Cache del hatası:', error);
      return false;
    }
  },

  /**
   * Anahtar varlığını kontrol etme
   * @param {string} key - Anahtar
   * @returns {boolean} Var mı?
   */
  async exists(key) {
    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists hatası:', error);
      return false;
    }
  },

  /**
   * TTL getirme
   * @param {string} key - Anahtar
   * @returns {number} TTL (saniye)
   */
  async ttl(key) {
    try {
      return await client.ttl(key);
    } catch (error) {
      console.error('Cache TTL hatası:', error);
      return -1;
    }
  },

  /**
   * Pattern ile anahtarları bulma
   * @param {string} pattern - Pattern
   * @returns {Array} Anahtarlar
   */
  async keys(pattern) {
    try {
      return await client.keys(pattern);
    } catch (error) {
      console.error('Cache keys hatası:', error);
      return [];
    }
  },

  /**
   * Tüm cache'i temizleme
   */
  async flush() {
    try {
      await client.flushDb();
      return true;
    } catch (error) {
      console.error('Cache flush hatası:', error);
      return false;
    }
  },

  /**
   * Hash set
   * @param {string} key - Hash anahtarı
   * @param {string} field - Field
   * @param {*} value - Değer
   */
  async hset(key, field, value) {
    try {
      const serializedValue = JSON.stringify(value);
      await client.hSet(key, field, serializedValue);
      return true;
    } catch (error) {
      console.error('Cache hset hatası:', error);
      return false;
    }
  },

  /**
   * Hash get
   * @param {string} key - Hash anahtarı
   * @param {string} field - Field
   * @returns {*} Değer
   */
  async hget(key, field) {
    try {
      const value = await client.hGet(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache hget hatası:', error);
      return null;
    }
  },

  /**
   * Hash getall
   * @param {string} key - Hash anahtarı
   * @returns {Object} Tüm field-value çiftleri
   */
  async hgetall(key) {
    try {
      const hash = await client.hGetAll(key);
      const result = {};
      
      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value;
        }
      }
      
      return result;
    } catch (error) {
      console.error('Cache hgetall hatası:', error);
      return {};
    }
  }
};

/**
 * Session helper fonksiyonları
 */
const session = {
  /**
   * Session kaydetme
   * @param {string} sessionId - Session ID
   * @param {Object} data - Session verisi
   * @param {number} ttl - TTL (saniye)
   */
  async set(sessionId, data, ttl = 86400) { // 24 saat
    const key = `session:${sessionId}`;
    return await cache.set(key, data, ttl);
  },

  /**
   * Session getirme
   * @param {string} sessionId - Session ID
   * @returns {Object} Session verisi
   */
  async get(sessionId) {
    const key = `session:${sessionId}`;
    return await cache.get(key);
  },

  /**
   * Session silme
   * @param {string} sessionId - Session ID
   */
  async destroy(sessionId) {
    const key = `session:${sessionId}`;
    return await cache.del(key);
  },

  /**
   * Session TTL güncelleme
   * @param {string} sessionId - Session ID
   * @param {number} ttl - Yeni TTL
   */
  async touch(sessionId, ttl = 86400) {
    const key = `session:${sessionId}`;
    const data = await cache.get(key);
    if (data) {
      return await cache.set(key, data, ttl);
    }
    return false;
  }
};

module.exports = {
  client,
  connectRedis,
  disconnectRedis,
  cache,
  session
};