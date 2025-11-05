const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServicePartsUsed = sequelize.define('ServicePartsUsed', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service_request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'service_requests',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'service_parts_used',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// İlişkiler
ServicePartsUsed.associate = (models) => {
  // Servis talebi ilişkisi
  ServicePartsUsed.belongsTo(models.ServiceRequest, {
    foreignKey: 'service_request_id',
    as: 'serviceRequest'
  });

  // Ürün ilişkisi
  ServicePartsUsed.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
};

module.exports = ServicePartsUsed;