/**
 * Migration: Create system_modules table
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_modules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      module_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      module_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      version: {
        type: Sequelize.STRING(20),
        defaultValue: '1.0.0'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      requires_license: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      license_expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      icon: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Indexes
    await queryInterface.addIndex('system_modules', ['module_code'], { unique: true });
    await queryInterface.addIndex('system_modules', ['is_active']);
    await queryInterface.addIndex('system_modules', ['category']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('system_modules');
  }
};