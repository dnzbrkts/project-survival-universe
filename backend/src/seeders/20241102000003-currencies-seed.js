'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Para birimlerini ekle
    await queryInterface.bulkInsert('currencies', [
      {
        currency_code: 'TRY',
        currency_name: 'Türk Lirası',
        symbol: '₺',
        decimal_places: 2,
        is_base_currency: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'USD',
        currency_name: 'Amerikan Doları',
        symbol: '$',
        decimal_places: 2,
        is_base_currency: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'EUR',
        currency_name: 'Euro',
        symbol: '€',
        decimal_places: 2,
        is_base_currency: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'GBP',
        currency_name: 'İngiliz Sterlini',
        symbol: '£',
        decimal_places: 2,
        is_base_currency: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'JPY',
        currency_name: 'Japon Yeni',
        symbol: '¥',
        decimal_places: 0,
        is_base_currency: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'CHF',
        currency_name: 'İsviçre Frangı',
        symbol: 'CHF',
        decimal_places: 2,
        is_base_currency: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Örnek döviz kurları ekle
    const today = new Date().toISOString().split('T')[0];
    
    await queryInterface.bulkInsert('exchange_rates', [
      {
        currency_code: 'USD',
        buy_rate: 28.50,
        sell_rate: 28.60,
        rate_date: today,
        source: 'manual',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'EUR',
        buy_rate: 31.20,
        sell_rate: 31.35,
        rate_date: today,
        source: 'manual',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'GBP',
        buy_rate: 36.80,
        sell_rate: 37.00,
        rate_date: today,
        source: 'manual',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'JPY',
        buy_rate: 0.19,
        sell_rate: 0.20,
        rate_date: today,
        source: 'manual',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        currency_code: 'CHF',
        buy_rate: 32.10,
        sell_rate: 32.25,
        rate_date: today,
        source: 'manual',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('exchange_rates', null, {});
    await queryInterface.bulkDelete('currencies', null, {});
  }
};