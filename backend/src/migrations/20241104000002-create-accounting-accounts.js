'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounting_accounts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      account_code: {
        type: Sequelize.STRING(10),
        unique: true,
        allowNull: false,
        comment: 'Hesap kodu (örn: 120.01)'
      },
      account_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Hesap adı'
      },
      account_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: 'Hesap tipi (asset, liability, equity, revenue, expense)'
      },
      parent_account_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'Ana hesap kodu'
      },
      account_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Hesap seviyesi (1: Ana grup, 2: Alt grup, 3: Detay)'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Hesap aktif mi?'
      },
      is_system_account: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Sistem hesabı mı?'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Hesap açıklaması'
      },
      normal_balance: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'debit',
        comment: 'Normal bakiye (debit/credit)'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Sıralama'
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
    await queryInterface.addIndex('accounting_accounts', ['account_type']);
    await queryInterface.addIndex('accounting_accounts', ['parent_account_code']);
    await queryInterface.addIndex('accounting_accounts', ['is_active']);
    await queryInterface.addIndex('accounting_accounts', ['account_level']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounting_accounts');
  }
};