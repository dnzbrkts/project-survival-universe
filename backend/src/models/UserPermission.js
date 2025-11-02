/**
 * UserPermission Model
 * Kullanıcı-Yetki direkt ilişki tablosu (rol dışı yetkiler)
 */

module.exports = (sequelize, DataTypes) => {
  const UserPermission = sequelize.define('UserPermission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
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
    startsAt: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      field: 'starts_at'
    },
    expiresAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expires_at'
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
    tableName: 'user_permissions',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'permission_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['permission_id']
      },
      {
        fields: ['access_type']
      },
      {
        fields: ['expires_at']
      }
    ]
  });

  // Instance methods
  UserPermission.prototype.isExpired = function() {
    if (!this.expiresAt) return false;
    return new Date() > new Date(this.expiresAt);
  };

  UserPermission.prototype.isCurrentlyActive = function() {
    if (this.isExpired()) return false;
    
    const now = new Date();
    const startsAt = new Date(this.startsAt);
    
    return now >= startsAt;
  };

  UserPermission.prototype.isAllowed = function() {
    return this.accessType === 'allow' && this.isCurrentlyActive();
  };

  UserPermission.prototype.isDenied = function() {
    return this.accessType === 'deny' && this.isCurrentlyActive();
  };

  UserPermission.prototype.hasConditions = function() {
    return this.conditions && Object.keys(this.conditions).length > 0;
  };

  UserPermission.prototype.evaluateConditions = function(context = {}) {
    if (!this.hasConditions()) {
      return true;
    }

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
  UserPermission.findActiveByUser = async function(userId) {
    const now = new Date();
    
    return await this.findAll({
      where: {
        userId,
        startsAt: {
          [sequelize.Sequelize.Op.lte]: now
        },
        [sequelize.Sequelize.Op.or]: [
          { expiresAt: null },
          { expiresAt: { [sequelize.Sequelize.Op.gt]: now } }
        ]
      },
      include: [{
        model: sequelize.models.Permission,
        as: 'permission',
        where: { isActive: true }
      }]
    });
  };

  UserPermission.findByUserAndPermission = async function(userId, permissionId) {
    return await this.findOne({
      where: { userId, permissionId }
    });
  };

  UserPermission.getAllowedPermissions = async function(userId) {
    const now = new Date();
    
    return await this.findAll({
      where: {
        userId,
        accessType: 'allow',
        startsAt: {
          [sequelize.Sequelize.Op.lte]: now
        },
        [sequelize.Sequelize.Op.or]: [
          { expiresAt: null },
          { expiresAt: { [sequelize.Sequelize.Op.gt]: now } }
        ]
      },
      include: [{
        model: sequelize.models.Permission,
        as: 'permission',
        where: { isActive: true }
      }]
    });
  };

  UserPermission.getDeniedPermissions = async function(userId) {
    const now = new Date();
    
    return await this.findAll({
      where: {
        userId,
        accessType: 'deny',
        startsAt: {
          [sequelize.Sequelize.Op.lte]: now
        },
        [sequelize.Sequelize.Op.or]: [
          { expiresAt: null },
          { expiresAt: { [sequelize.Sequelize.Op.gt]: now } }
        ]
      },
      include: [{
        model: sequelize.models.Permission,
        as: 'permission',
        where: { isActive: true }
      }]
    });
  };

  UserPermission.associate = function(models) {
    // User ile ilişki
    UserPermission.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Permission ile ilişki
    UserPermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission'
    });
  };

  return UserPermission;
};