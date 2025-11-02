/**
 * RolePermission Model
 * Rol-Yetki ilişki tablosu
 */

module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'permission_id',
      references: {
        model: 'permissions',
        key: 'id'
      }
    },
    accessType: {
      type: DataTypes.STRING(20),
      defaultValue: 'allow',
      field: 'access_type',
      validate: {
        isIn: [['allow', 'deny']]
      }
    },
    conditions: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Koşullu yetki kuralları'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'role_permissions',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['role_id', 'permission_id']
      },
      {
        fields: ['role_id']
      },
      {
        fields: ['permission_id']
      },
      {
        fields: ['access_type']
      }
    ]
  });

  // Instance methods
  RolePermission.prototype.isAllowed = function() {
    return this.accessType === 'allow';
  };

  RolePermission.prototype.isDenied = function() {
    return this.accessType === 'deny';
  };

  RolePermission.prototype.hasConditions = function() {
    return this.conditions && Object.keys(this.conditions).length > 0;
  };

  RolePermission.prototype.evaluateConditions = function(context = {}) {
    if (!this.hasConditions()) {
      return true;
    }

    // Basit koşul değerlendirmesi
    // Gerçek uygulamada daha karmaşık bir rule engine kullanılabilir
    try {
      const conditions = this.conditions;
      
      for (const [key, expectedValue] of Object.entries(conditions)) {
        const actualValue = context[key];
        
        if (actualValue !== expectedValue) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Koşul değerlendirme hatası:', error);
      return false;
    }
  };

  // Class methods
  RolePermission.findByRole = async function(roleId) {
    return await this.findAll({
      where: { roleId },
      include: [{
        model: sequelize.models.Permission,
        as: 'permission',
        where: { isActive: true }
      }]
    });
  };

  RolePermission.findByPermission = async function(permissionId) {
    return await this.findAll({
      where: { permissionId },
      include: [{
        model: sequelize.models.Role,
        as: 'role',
        where: { isActive: true }
      }]
    });
  };

  RolePermission.findByRoleAndPermission = async function(roleId, permissionId) {
    return await this.findOne({
      where: { roleId, permissionId }
    });
  };

  RolePermission.getAllowedPermissions = async function(roleId) {
    return await this.findAll({
      where: {
        roleId,
        accessType: 'allow'
      },
      include: [{
        model: sequelize.models.Permission,
        as: 'permission',
        where: { isActive: true }
      }]
    });
  };

  RolePermission.getDeniedPermissions = async function(roleId) {
    return await this.findAll({
      where: {
        roleId,
        accessType: 'deny'
      },
      include: [{
        model: sequelize.models.Permission,
        as: 'permission',
        where: { isActive: true }
      }]
    });
  };

  RolePermission.associate = function(models) {
    // Role ile ilişki
    RolePermission.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role'
    });

    // Permission ile ilişki
    RolePermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission'
    });
  };

  return RolePermission;
};