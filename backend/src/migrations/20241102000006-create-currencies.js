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
        defaultValue: 2
      },
      is_base_currency: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('currencies', ['currency_code'], {
      unique: true,
      name: 'currencies_currency_code_unique'
    });
    
    await queryInterface.addIndex('currencies', ['is_active'], {
      name: 'currencies_is_active_idx'
    });
    
    await queryInterface.addIndex('currencies', ['is_base_currency'], {
      name: 'currencies_is_base_currency_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('currencies');
  }
};