/**
 * UserRole Model
 * Kullanıcı-Rol ilişki tablosu
 */

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
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
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id'
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
    tableName: 'user_roles',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'role_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['role_id']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['expires_at']
      }
    ]
  });

  // Instance methods
  UserRole.prototype.isExpired = function() {
    if (!this.expiresAt) return false;
    return new Date() > new Date(this.expiresAt);
  };

  UserRole.prototype.isCurrentlyActive = function() {
    if (!this.isActive) return false;
    if (this.isExpired()) return false;
    
    const now = new Date();
    const startsAt = new Date(this.startsAt);
    
    return now >= startsAt;
  };

  // Class methods
  UserRole.findActiveByUser = async function(userId) {
    const now = new Date();
    
    return await this.findAll({
      where: {
        userId,
        isActive: true,
        startsAt: {
          [sequelize.Sequelize.Op.lte]: now
        },
        [sequelize.Sequelize.Op.or]: [
          { expiresAt: null },
          { expiresAt: { [sequelize.Sequelize.Op.gt]: now } }
        ]
      },
      include: [{
        model: sequelize.models.Role,
        as: 'role',
        where: { isActive: true }
      }]
    });
  };

  UserRole.findByUserAndRole = async function(userId, roleId) {
    return await this.findOne({
      where: { userId, roleId }
    });
  };

  UserRole.associate = function(models) {
    // User ile ilişki
    UserRole.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Role ile ilişki
    UserRole.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role'
    });
  };

  return UserRole;
};