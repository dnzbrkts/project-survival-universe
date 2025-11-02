'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currency_code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true
      },
      currency_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      decimal_places: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2
      },
      is_base_currency: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

    await queryInterface.addIndex('currencies', ['currency_code']);
    await queryInterface.addIndex('currencies', ['is_base_currency']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('currencies');
  }
};