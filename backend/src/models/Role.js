/**
 * Role Model
 * Kullanıcı rolleri ve yetki grupları
 */

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'role_code',
      validate: {
        len: [2, 50],
        isUppercase: true,
        is: /^[A-Z_]+$/
      }
    },
    roleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'role_name',
      validate: {
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isSystemRole: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_system_role'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
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
    tableName: 'roles',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['role_code']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['is_system_role']
      }
    ]
  });

  // Instance methods
  Role.prototype.canBeDeleted = function() {
    return !this.isSystemRole;
  };

  // Class methods
  Role.findByCode = async function(roleCode) {
    return await this.findOne({
      where: { roleCode: roleCode.toUpperCase() }
    });
  };

  Role.getSystemRoles = async function() {
    return await this.findAll({
      where: { isSystemRole: true }
    });
  };

  Role.getActiveRoles = async function() {
    return await this.findAll({
      where: { isActive: true },
      order: [['roleName', 'ASC']]
    });
  };

  Role.associate = function(models) {
    // Role-User many-to-many ilişkisi
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: 'roleId',
      otherKey: 'userId',
      as: 'users'
    });

    // Role-Permission many-to-many ilişkisi
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions'
    });
  };

  return Role;
};