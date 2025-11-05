const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceActivity = sequelize.define('ServiceActivity', {
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
  activity_type: {
    type: DataTypes.STRING(50),
    allowNull: false
    // Örnek değerler: 'created', 'diagnosis', 'repair', 'part_replacement', 'testing', 'status_change', 'technician_assigned', 'parts_added', 'updated'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  technician_id: {
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
  }
}, {
  tableName: 'service_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// İlişkiler
ServiceActivity.associate = (models) => {
  // Servis talebi ilişkisi
  ServiceActivity.belongsTo(models.ServiceRequest, {
    foreignKey: 'service_request_id',
    as: 'serviceRequest'
  });

  // Teknisyen ilişkisi
  ServiceActivity.belongsTo(models.User, {
    foreignKey: 'technician_id',
    as: 'technician'
  });
};

module.exports = ServiceActivity;