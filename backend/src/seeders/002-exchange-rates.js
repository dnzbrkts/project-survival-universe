'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const today = new Date().toISOString().split('T')[0];
    
    await queryInterface.bulkInsert('exchange_rates', [
      {
        currency_code: 'USD',
        buy_rate: 32.50,
        sell_rate: 32.60,
        rate_date: today,
        source: 'manual',
        is_active: true,
        created_at: new Date()
      },
      {
        currency_code: 'EUR',
        buy_rate: 35.20,
        sell_rate: 35.30,
        rate_date: today,
        source: 'manual',
        is_active: true,
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('exchange_rates', null, {});
  }
};