/**
 * ModuleAccessLog Model
 * Modül erişim kayıtları ve audit trail
 */

module.exports = (sequelize, DataTypes) => {
  const ModuleAccessLog = sequelize.define('ModuleAccessLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'module_id',
      references: {
        model: 'system_modules',
        key: 'id'
      }
    },
    accessedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'accessed_at'
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
      field: 'ip_address'
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent'
    },
    isSuccessful: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_successful'
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'error_message'
    }
  }, {
    tableName: 'module_access_logs',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['module_id']
      },
      {
        fields: ['accessed_at']
      },
      {
        fields: ['is_successful']
      },
      {
        fields: ['ip_address']
      }
    ]
  });

  // Instance methods
  ModuleAccessLog.prototype.isSuccess = function() {
    return this.isSuccessful;
  };

  ModuleAccessLog.prototype.isFailure = function() {
    return !this.isSuccessful;
  };

  ModuleAccessLog.prototype.getAccessTime = function() {
    return this.accessedAt;
  };

  // Class methods
  ModuleAccessLog.logAccess = async function(data) {
    const {
      userId,
      moduleId,
      ipAddress,
      userAgent,
      isSuccessful = true,
      errorMessage = null
    } = data;

    return await this.create({
      userId,
      moduleId,
      ipAddress,
      userAgent,
      isSuccessful,
      errorMessage,
      accessedAt: new Date()
    });
  };

  ModuleAccessLog.findByUser = async function(userId, options = {}) {
    const {
      limit = 100,
      offset = 0,
      startDate = null,
      endDate = null,
      moduleId = null,
      isSuccessful = null
    } = options;

    const where = { userId };

    if (startDate && endDate) {
      where.accessedAt = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.accessedAt = {
        [sequelize.Sequelize.Op.gte]: startDate
      };
    } else if (endDate) {
      where.accessedAt = {
        [sequelize.Sequelize.Op.lte]: endDate
      };
    }

    if (moduleId !== null) {
      where.moduleId = moduleId;
    }

    if (isSuccessful !== null) {
      where.isSuccessful = isSuccessful;
    }

    return await this.findAll({
      where,
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: sequelize.models.SystemModule,
          as: 'module',
          attributes: ['id', 'moduleCode', 'moduleName']
        }
      ],
      order: [['accessedAt', 'DESC']],
      limit,
      offset
    });
  };

  ModuleAccessLog.findByModule = async function(moduleId, options = {}) {
    const {
      limit = 100,
      offset = 0,
      startDate = null,
      endDate = null,
      userId = null,
      isSuccessful = null
    } = options;

    const where = { moduleId };

    if (startDate && endDate) {
      where.accessedAt = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    if (userId !== null) {
      where.userId = userId;
    }

    if (isSuccessful !== null) {
      where.isSuccessful = isSuccessful;
    }

    return await this.findAll({
      where,
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: sequelize.models.SystemModule,
          as: 'module',
          attributes: ['id', 'moduleCode', 'moduleName']
        }
      ],
      order: [['accessedAt', 'DESC']],
      limit,
      offset
    });
  };

  ModuleAccessLog.getAccessStats = async function(options = {}) {
    const {
      startDate = null,
      endDate = null,
      moduleId = null,
      userId = null
    } = options;

    const where = {};

    if (startDate && endDate) {
      where.accessedAt = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    if (moduleId !== null) {
      where.moduleId = moduleId;
    }

    if (userId !== null) {
      where.userId = userId;
    }

    const [totalAccess, successfulAccess, failedAccess] = await Promise.all([
      this.count({ where }),
      this.count({ where: { ...where, isSuccessful: true } }),
      this.count({ where: { ...where, isSuccessful: false } })
    ]);

    return {
      totalAccess,
      successfulAccess,
      failedAccess,
      successRate: totalAccess > 0 ? (successfulAccess / totalAccess * 100).toFixed(2) : 0
    };
  };

  ModuleAccessLog.getTopModules = async function(options = {}) {
    const {
      limit = 10,
      startDate = null,
      endDate = null
    } = options;

    const where = {};

    if (startDate && endDate) {
      where.accessedAt = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    return await this.findAll({
      where,
      attributes: [
        'moduleId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'accessCount']
      ],
      include: [{
        model: sequelize.models.SystemModule,
        as: 'module',
        attributes: ['moduleCode', 'moduleName']
      }],
      group: ['moduleId', 'module.id'],
      order: [[sequelize.literal('accessCount'), 'DESC']],
      limit
    });
  };

  ModuleAccessLog.getTopUsers = async function(options = {}) {
    const {
      limit = 10,
      startDate = null,
      endDate = null
    } = options;

    const where = {};

    if (startDate && endDate) {
      where.accessedAt = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    return await this.findAll({
      where,
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'accessCount']
      ],
      include: [{
        model: sequelize.models.User,
        as: 'user',
        attributes: ['username', 'firstName', 'lastName']
      }],
      group: ['userId', 'user.id'],
      order: [[sequelize.literal('accessCount'), 'DESC']],
      limit
    });
  };

  ModuleAccessLog.cleanOldLogs = async function(daysToKeep = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deletedCount = await this.destroy({
      where: {
        accessedAt: {
          [sequelize.Sequelize.Op.lt]: cutoffDate
        }
      }
    });

    return deletedCount;
  };

  ModuleAccessLog.associate = function(models) {
    // User ile ilişki
    ModuleAccessLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // SystemModule ile ilişki
    ModuleAccessLog.belongsTo(models.SystemModule, {
      foreignKey: 'moduleId',
      as: 'module'
    });
  };

  return ModuleAccessLog;
};