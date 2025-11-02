'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      request_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      issue_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'in_progress', 'completed', 'cancelled']]
        }
      },
      priority: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'normal',
        validate: {
          isIn: [['low', 'normal', 'high', 'urgent']]
        }
      },
      assigned_technician_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      estimated_cost: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      actual_cost: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.addIndex('service_requests', ['request_number']);
    await queryInterface.addIndex('service_requests', ['customer_id']);
    await queryInterface.addIndex('service_requests', ['product_id']);
    await queryInterface.addIndex('service_requests', ['status']);
    await queryInterface.addIndex('service_requests', ['priority']);
    await queryInterface.addIndex('service_requests', ['assigned_technician_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('service_requests');
  }
};