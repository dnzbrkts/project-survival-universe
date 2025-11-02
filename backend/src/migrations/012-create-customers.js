'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      company_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      customer_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['customer', 'supplier', 'both']]
        }
      },
      tax_number: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      tax_office: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contact_person: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      payment_terms: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30
      },
      credit_limit: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
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
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('customers', ['customer_code']);
    await queryInterface.addIndex('customers', ['customer_type']);
    await queryInterface.addIndex('customers', ['tax_number']);
    await queryInterface.addIndex('customers', ['is_active']);
    await queryInterface.addIndex('customers', ['company_name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};