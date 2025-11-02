/**
 * Veritabanı Konfigürasyonu
 * Sequelize ORM ayarları ve bağlantı yönetimi
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  development: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'isletme_yonetim_sistemi',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME + '_test' || 'isletme_yonetim_sistemi_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Sequelize instance oluştur
let sequelize;

if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

/**
 * Veritabanı bağlantısını test etme
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Veritabanı bağlantısı başarılı');
    return true;
  } catch (error) {
    console.error('❌ Veritabanı bağlantı hatası:', error.message);
    return false;
  }
}

/**
 * Veritabanı senkronizasyonu
 * @param {boolean} force - Tabloları yeniden oluştur
 * @param {boolean} alter - Mevcut tabloları güncelle
 */
async function syncDatabase(force = false, alter = false) {
  try {
    console.log('🔄 Veritabanı senkronizasyonu başlatılıyor...');
    
    await sequelize.sync({ force, alter });
    
    console.log('✅ Veritabanı senkronizasyonu tamamlandı');
    return true;
  } catch (error) {
    console.error('❌ Veritabanı senkronizasyon hatası:', error.message);
    return false;
  }
}

/**
 * Veritabanı bağlantısını kapatma
 */
async function closeConnection() {
  try {
    await sequelize.close();
    console.log('✅ Veritabanı bağlantısı kapatıldı');
  } catch (error) {
    console.error('❌ Veritabanı kapatma hatası:', error.message);
  }
}

module.exports = {
  sequelize,
  config,
  testConnection,
  syncDatabase,
  closeConnection
};