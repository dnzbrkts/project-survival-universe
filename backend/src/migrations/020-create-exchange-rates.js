'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exchange_rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currency_code: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      buy_rate: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
      },
      sell_rate: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
      },
      rate_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      source: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'manual'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('exchange_rates', ['currency_code', 'rate_date'], { unique: true });
    await queryInterface.addIndex('exchange_rates', ['rate_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exchange_rates');
  }
};