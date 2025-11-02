'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ServiceActivity extends Model {
    static associate(models) {
      ServiceActivity.belongsTo(models.ServiceRequest, {
        foreignKey: 'service_request_id',
        as: 'serviceRequest'
      });

      ServiceActivity.belongsTo(models.User, {
        foreignKey: 'technician_id',
        as: 'technician'
      });
    }
  }

  ServiceActivity.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    service_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activity_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['diagnosis', 'repair', 'part_replacement', 'testing', 'other']]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 }
    },
    cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: { min: 0 }
    },
    technician_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ServiceActivity',
    tableName: 'service_activities',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return ServiceActivity;
};