/**
 * Migration: Create permissions table
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      permission_code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      permission_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true
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
      permission_type: {
        type: Sequelize.STRING(20),
        defaultValue: 'action'
      },
      parent_permission_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'permissions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Indexes
    await queryInterface.addIndex('permissions', ['permission_code'], { unique: true });
    await queryInterface.addIndex('permissions', ['module_id']);
    await queryInterface.addIndex('permissions', ['permission_type']);
    await queryInterface.addIndex('permissions', ['parent_permission_id']);
    await queryInterface.addIndex('permissions', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions');
  }
};