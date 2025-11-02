'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ServicePartsUsed extends Model {
    static associate(models) {
      ServicePartsUsed.belongsTo(models.ServiceRequest, {
        foreignKey: 'service_request_id',
        as: 'serviceRequest'
      });

      ServicePartsUsed.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }

  ServicePartsUsed.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    service_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    unit_price: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      validate: { min: 0 }
    },
    total_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 }
    }
  }, {
    sequelize,
    modelName: 'ServicePartsUsed',
    tableName: 'service_parts_used',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    hooks: {
      beforeSave: (item) => {
        item.total_price = (parseFloat(item.quantity) * parseFloat(item.unit_price)).toFixed(2);
      }
    }
  });

  return ServicePartsUsed;
};