'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounting_entries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      entry_number: {
        type: Sequelize.STRING(30),
        unique: true,
        allowNull: false,
        comment: 'Yevmiye kayıt numarası'
      },
      entry_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Kayıt tarihi'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Kayıt açıklaması'
      },
      reference_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Referans tipi (invoice, payment, expense, etc.)'
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Referans ID'
      },
      total_debit: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Toplam borç tutarı'
      },
      total_credit: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Toplam alacak tutarı'
      },
      is_balanced: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Kayıt dengeli mi?'
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Kayıt durumu (active, cancelled, reversed)'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Kaydı oluşturan kullanıcı ID'
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Kaydı onaylayan kullanıcı ID'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Onay tarihi'
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
    await queryInterface.addIndex('accounting_entries', ['entry_date']);
    await queryInterface.addIndex('accounting_entries', ['reference_type', 'reference_id']);
    await queryInterface.addIndex('accounting_entries', ['created_by']);
    await queryInterface.addIndex('accounting_entries', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounting_entries');
  }
};