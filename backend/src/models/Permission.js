/**
 * Permission Model
 * Sistem yetkileri ve izinler
 */

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    permissionCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'permission_code',
      validate: {
        len: [3, 100],
        is: /^[a-z0-9._]+$/
      }
    },
    permissionName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'permission_name',
      validate: {
        len: [3, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'category_id'
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'module_id'
    },
    permissionType: {
      type: DataTypes.STRING(20),
      defaultValue: 'action',
      field: 'permission_type',
      validate: {
        isIn: [['module', 'page', 'action', 'data']]
      }
    },
    parentPermissionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_permission_id'
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
    }
  }, {
    tableName: 'permissions',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['permission_code']
      },
      {
        fields: ['module_id']
      },
      {
        fields: ['permission_type']
      },
      {
        fields: ['parent_permission_id']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  Permission.prototype.getFullCode = function() {
    return this.permissionCode;
  };

  Permission.prototype.isModulePermission = function() {
    return this.permissionType === 'module';
  };

  Permission.prototype.isActionPermission = function() {
    return this.permissionType === 'action';
  };

  // Class methods
  Permission.findByCode = async function(permissionCode) {
    return await this.findOne({
      where: { permissionCode }
    });
  };

  Permission.findByModule = async function(moduleId) {
    return await this.findAll({
      where: { moduleId },
      order: [['permissionName', 'ASC']]
    });
  };

  Permission.findByType = async function(permissionType) {
    return await this.findAll({
      where: { permissionType },
      order: [['permissionName', 'ASC']]
    });
  };

  Permission.getActivePermissions = async function() {
    return await this.findAll({
      where: { isActive: true },
      order: [['permissionName', 'ASC']]
    });
  };

  Permission.getHierarchy = async function() {
    const permissions = await this.findAll({
      where: { isActive: true },
      order: [['permissionName', 'ASC']]
    });

    // Hiyerarşik yapı oluştur
    const permissionMap = new Map();
    const rootPermissions = [];

    // Önce tüm permissions'ları map'e ekle
    permissions.forEach(permission => {
      permissionMap.set(permission.id, {
        ...permission.toJSON(),
        children: []
      });
    });

    // Sonra parent-child ilişkilerini kur
    permissions.forEach(permission => {
      const permissionData = permissionMap.get(permission.id);
      
      if (permission.parentPermissionId) {
        const parent = permissionMap.get(permission.parentPermissionId);
        if (parent) {
          parent.children.push(permissionData);
        }
      } else {
        rootPermissions.push(permissionData);
      }
    });

    return rootPermissions;
  };

  Permission.associate = function(models) {
    // Permission-Role many-to-many ilişkisi
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles'
    });

    // Permission-User many-to-many ilişkisi (direkt yetkiler)
    Permission.belongsToMany(models.User, {
      through: models.UserPermission,
      foreignKey: 'permissionId',
      otherKey: 'userId',
      as: 'users'
    });

    // Module ile ilişki
    Permission.belongsTo(models.SystemModule, {
      foreignKey: 'moduleId',
      as: 'module'
    });

    // Self-referencing ilişki (parent-child)
    Permission.belongsTo(Permission, {
      foreignKey: 'parentPermissionId',
      as: 'parent'
    });

    Permission.hasMany(Permission, {
      foreignKey: 'parentPermissionId',
      as: 'children'
    });
  };

  return Permission;
};