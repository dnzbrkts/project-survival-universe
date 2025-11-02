/**
 * Migration: Create user_permissions table
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      access_type: {
        type: Sequelize.STRING(20),
        defaultValue: 'allow'
      },
      starts_at: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
      },
      expires_at: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      conditions: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Indexes
    await queryInterface.addIndex('user_permissions', ['user_id', 'permission_id'], { unique: true });
    await queryInterface.addIndex('user_permissions', ['user_id']);
    await queryInterface.addIndex('user_permissions', ['permission_id']);
    await queryInterface.addIndex('user_permissions', ['access_type']);
    await queryInterface.addIndex('user_permissions', ['expires_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_permissions');
  }
};