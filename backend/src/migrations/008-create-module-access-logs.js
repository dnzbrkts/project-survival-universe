/**
 * Migration: Create module_access_logs table
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('module_access_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'system_modules',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      accessed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      ip_address: {
        type: Sequelize.INET,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_successful: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });

    // Indexes
    await queryInterface.addIndex('module_access_logs', ['user_id']);
    await queryInterface.addIndex('module_access_logs', ['module_id']);
    await queryInterface.addIndex('module_access_logs', ['accessed_at']);
    await queryInterface.addIndex('module_access_logs', ['is_successful']);
    await queryInterface.addIndex('module_access_logs', ['ip_address']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('module_access_logs');
  }
};