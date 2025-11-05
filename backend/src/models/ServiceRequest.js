const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  request_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
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
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal'
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
    allowNull: true
  },
  actual_cost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'service_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// İlişkiler
ServiceRequest.associate = (models) => {
  // Müşteri ilişkisi
  ServiceRequest.belongsTo(models.Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
  });

  // Ürün ilişkisi
  ServiceRequest.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });

  // Atanan teknisyen ilişkisi
  ServiceRequest.belongsTo(models.User, {
    foreignKey: 'assigned_technician_id',
    as: 'assignedTechnician'
  });

  // Oluşturan kullanıcı ilişkisi
  ServiceRequest.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'createdBy'
  });

  // Servis aktiviteleri ilişkisi
  ServiceRequest.hasMany(models.ServiceActivity, {
    foreignKey: 'service_request_id',
    as: 'activities'
  });

  // Kullanılan parçalar ilişkisi
  ServiceRequest.hasMany(models.ServicePartsUsed, {
    foreignKey: 'service_request_id',
    as: 'partsUsed'
  });
};

module.exports = ServiceRequest;