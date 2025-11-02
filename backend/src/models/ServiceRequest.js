'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ServiceRequest extends Model {
    static associate(models) {
      // Association with customer
      ServiceRequest.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });

      // Association with product
      ServiceRequest.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });

      // Association with assigned technician
      ServiceRequest.belongsTo(models.User, {
        foreignKey: 'assigned_technician_id',
        as: 'technician'
      });

      // Association with service activities
      ServiceRequest.hasMany(models.ServiceActivity, {
        foreignKey: 'service_request_id',
        as: 'activities'
      });

      // Association with service parts used
      ServiceRequest.hasMany(models.ServicePartsUsed, {
        foreignKey: 'service_request_id',
        as: 'partsUsed'
      });
    }

    // Static method to generate request number
    static async generateRequestNumber() {
      const year = new Date().getFullYear();
      const prefix = 'SR'; // Service Request
      
      const lastRequest = await ServiceRequest.findOne({
        where: {
          request_number: {
            [sequelize.Sequelize.Op.like]: `${prefix}${year}%`
          }
        },
        order: [['request_number', 'DESC']]
      });

      let nextNumber = 1;
      if (lastRequest) {
        const lastNumber = parseInt(lastRequest.request_number.slice(-6));
        nextNumber = lastNumber + 1;
      }

      return `${prefix}${year}${nextNumber.toString().padStart(6, '0')}`;
    }

    // Instance method to calculate total duration
    async getTotalDuration() {
      const activities = await this.getActivities();
      return activities.reduce((total, activity) => {
        return total + (activity.duration_minutes || 0);
      }, 0);
    }

    // Instance method to calculate total parts cost
    async getTotalPartsCost() {
      const partsUsed = await this.getPartsUsed();
      return partsUsed.reduce((total, part) => {
        return total + parseFloat(part.total_price || 0);
      }, 0);
    }

    // Instance method to calculate total service cost
    async getTotalServiceCost() {
      const activities = await this.getActivities();
      const partsCost = await this.getTotalPartsCost();
      
      const laborCost = activities.reduce((total, activity) => {
        return total + parseFloat(activity.cost || 0);
      }, 0);

      return laborCost + partsCost;
    }

    // Instance method to update status with timestamp
    async updateStatus(newStatus, userId = null) {
      const updateData = { status: newStatus };
      
      if (newStatus === 'in_progress' && !this.started_at) {
        updateData.started_at = new Date();
      } else if (newStatus === 'completed' && !this.completed_at) {
        updateData.completed_at = new Date();
        updateData.actual_cost = await this.getTotalServiceCost();
      }

      return await this.update(updateData);
    }

    // Instance method to check if service is overdue (based on priority)
    isOverdue() {
      if (this.status === 'completed' || this.status === 'cancelled') {
        return false;
      }

      const createdDate = new Date(this.created_at);
      const currentDate = new Date();
      const daysDiff = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));

      // Define SLA days based on priority
      const slaDays = {
        urgent: 1,
        high: 3,
        normal: 7,
        low: 14
      };

      return daysDiff > (slaDays[this.priority] || 7);
    }
  }

  ServiceRequest.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    request_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 20]
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    issue_description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'in_progress', 'completed', 'cancelled']]
      }
    },
    priority: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'normal',
      validate: {
        isIn: [['low', 'normal', 'high', 'urgent']]
      }
    },
    assigned_technician_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    estimated_cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    actual_cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ServiceRequest',
    tableName: 'service_requests',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ServiceRequest;
};