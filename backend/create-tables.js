/**
 * Manuel tablo oluşturma scripti
 */

require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function createTables() {
  try {
    console.log('🔧 Tablolar oluşturuluyor...');

    // Para birimleri tablosu
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS currencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        currency_code VARCHAR(3) NOT NULL UNIQUE,
        currency_name VARCHAR(50) NOT NULL,
        symbol VARCHAR(10),
        decimal_places INTEGER DEFAULT 2,
        is_base_currency BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Döviz kurları tablosu
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS exchange_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        currency_code VARCHAR(3) NOT NULL,
        buy_rate DECIMAL(10, 6) NOT NULL,
        sell_rate DECIMAL(10, 6) NOT NULL,
        rate_date DATE NOT NULL,
        source VARCHAR(50) DEFAULT 'manual',
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (currency_code) REFERENCES currencies(currency_code),
        UNIQUE(currency_code, rate_date)
      )
    `);

    console.log('✅ Tablolar başarıyla oluşturuldu');

    // Örnek veriler ekle
    console.log('📝 Örnek veriler ekleniyor...');

    // TRY para birimini ekle
    await sequelize.query(`
      INSERT OR IGNORE INTO currencies (currency_code, currency_name, symbol, decimal_places, is_base_currency, is_active)
      VALUES ('TRY', 'Türk Lirası', '₺', 2, true, true)
    `);

    // USD para birimini ekle
    await sequelize.query(`
      INSERT OR IGNORE INTO currencies (currency_code, currency_name, symbol, decimal_places, is_base_currency, is_active)
      VALUES ('USD', 'Amerikan Doları', '$', 2, false, true)
    `);

    // EUR para birimini ekle
    await sequelize.query(`
      INSERT OR IGNORE INTO currencies (currency_code, currency_name, symbol, decimal_places, is_base_currency, is_active)
      VALUES ('EUR', 'Euro', '€', 2, false, true)
    `);

    // Örnek döviz kurları ekle
    const today = new Date().toISOString().split('T')[0];
    
    await sequelize.query(`
      INSERT OR IGNORE INTO exchange_rates (currency_code, buy_rate, sell_rate, rate_date, source, is_active)
      VALUES ('USD', 28.50, 28.60, '${today}', 'manual', true)
    `);

    await sequelize.query(`
      INSERT OR IGNORE INTO exchange_rates (currency_code, buy_rate, sell_rate, rate_date, source, is_active)
      VALUES ('EUR', 31.20, 31.35, '${today}', 'manual', true)
    `);

    console.log('✅ Örnek veriler başarıyla eklendi');
    console.log('🎉 Kurulum tamamlandı!');

  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTables();