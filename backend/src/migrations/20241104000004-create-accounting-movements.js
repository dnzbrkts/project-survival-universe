'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounting_movements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      accounting_entry_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Yevmiye kayıt ID',
        references: {
          model: 'accounting_entries',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      account_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: 'Hesap kodu (örn: 120.01)'
      },
      account_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Hesap adı'
      },
      debit_amount: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Borç tutarı'
      },
      credit_amount: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Alacak tutarı'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Hareket açıklaması'
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
      original_amount: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: true,
        comment: 'Orijinal para birimi tutarı'
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
    await queryInterface.addIndex('accounting_movements', ['accounting_entry_id']);
    await queryInterface.addIndex('accounting_movements', ['account_code']);
    await queryInterface.addIndex('accounting_movements', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounting_movements');
  }
};