'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      payment_number: {
        type: Sequelize.STRING(30),
        unique: true,
        allowNull: false,
        comment: 'Ödeme numarası'
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Fatura ID',
        references: {
          model: 'invoices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Müşteri ID',
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Ödeme yöntemi (cash, bank_transfer, credit_card, check)'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        comment: 'Ödeme tutarı'
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'TRY',
        comment: 'Para birimi'
      },
      exchange_rate: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Döviz kuru'
      },
      payment_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Ödeme tarihi'
      },
      reference_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Referans numarası'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Notlar'
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'completed',
        comment: 'Ödeme durumu (pending, completed, cancelled)'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Kaydı oluşturan kullanıcı ID',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // İndeksler
    await queryInterface.addIndex('payments', ['invoice_id']);
    await queryInterface.addIndex('payments', ['customer_id']);
    await queryInterface.addIndex('payments', ['payment_date']);
    await queryInterface.addIndex('payments', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};