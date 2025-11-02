/**
 * System Modules Model
 * Dinamik modül sistemi için modül tanımları
 */

module.exports = (sequelize, DataTypes) => {
  const SystemModule = sequelize.define('SystemModule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    moduleCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'module_code'
    },
    moduleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'module_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING(20),
      defaultValue: '1.0.0'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_active'
    },
    requiresLicense: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'requires_license'
    },
    licenseExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'license_expires_at'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order'
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'system_modules',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['module_code']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['category']
      }
    ]
  });

  SystemModule.associate = function(models) {
    // Modül erişim logları ile ilişki
    SystemModule.hasMany(models.ModuleAccessLog, {
      foreignKey: 'moduleId',
      as: 'accessLogs'
    });

    // Permissions ile ilişki
    SystemModule.hasMany(models.Permission, {
      foreignKey: 'moduleId',
      as: 'permissions'
    });
  };

  return SystemModule;
};