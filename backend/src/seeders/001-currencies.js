'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('currencies', [
      {
        currency_code: 'TRY',
        currency_name: 'Türk Lirası',
        symbol: '₺',
        decimal_places: 2,
        is_base_currency: true,
        is_active: true,
        created_at: new Date()
      },
      {
        currency_code: 'USD',
        currency_name: 'US Dollar',
        symbol: '$',
        decimal_places: 2,
        is_base_currency: false,
        is_active: true,
        created_at: new Date()
      },
      {
        currency_code: 'EUR',
        currency_name: 'Euro',
        symbol: '€',
        decimal_places: 2,
        is_base_currency: false,
        is_active: true,
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('currencies', null, {});
  }
};