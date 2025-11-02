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
        defaultValue: 'manual'
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
    await queryInterface.addIndex('exchange_rates', ['currency_code', 'rate_date'], {
      unique: true,
      name: 'exchange_rates_currency_date_unique'
    });
    
    await queryInterface.addIndex('exchange_rates', ['rate_date'], {
      name: 'exchange_rates_rate_date_idx'
    });
    
    await queryInterface.addIndex('exchange_rates', ['currency_code'], {
      name: 'exchange_rates_currency_code_idx'
    });
    
    await queryInterface.addIndex('exchange_rates', ['is_active'], {
      name: 'exchange_rates_is_active_idx'
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('exchange_rates', {
      fields: ['currency_code'],
      type: 'foreign key',
      name: 'fk_exchange_rates_currency_code',
      references: {
        table: 'currencies',
        field: 'currency_code'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exchange_rates');
  }
};