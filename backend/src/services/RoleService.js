/**
 * Rol Yönetimi Servisi
 * Role Management Business Logic
 */

const { Role, User, UserRole, Permission, RolePermission } = require('../models');
const { Op } = require('sequelize');

class RoleService {
  /**
   * Rol listesi (filtreleme ve sayfalama ile)
   */
  async getRoles(filters = {}) {
    try {
      const {
        search,
        isActive,
        isSystemRole,
        page = 1,
        limit = 10
      } = filters;

      // Where koşulları
      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { roleCode: { [Op.iLike]: `%${search}%` } },
          { roleName: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (isActive !== undefined) {
        whereConditions.isActive = isActive === 'true';
      }

      if (isSystemRole !== undefined) {
        whereConditions.isSystemRole = isSystemRole === 'true';
      }

      // Sayfalama hesaplamaları
      const offset = (page - 1) * limit;

      // Rolleri getir
      const { count, rows: roles } = await Role.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            attributes: ['id'],
            required: false
          },
          {
            model: Permission,
            as: 'permissions',
            through: { attributes: [] },
            attributes: ['id'],
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      // Her rol için kullanıcı ve yetki sayısını hesapla
      const rolesWithCounts = roles.map(role => {
        const roleData = role.toJSON();
        roleData.userCount = role.users ? role.users.length : 0;
        roleData.permissionCount = role.permissions ? role.permissions.length : 0;
        delete roleData.users;
        delete roleData.permissions;
        return roleData;
      });

      // Sayfalama bilgileri
      const totalPages = Math.ceil(count / limit);
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };

      return {
        success: true,
        roles: rolesWithCounts,
        pagination
      };

    } catch (error) {
      console.error('RoleService getRoles hatası:', error);
      return {
        success: false,
        error: 'Roller getirilirken hata oluştu',
        code: 'GET_ROLES_ERROR'
      };
    }
  }

  /**
   * Aktif roller listesi (dropdown için)
   */
  async getActiveRoles() {
    try {
      const roles = await Role.findAll({
        where: { isActive: true },
        attributes: ['id', 'roleCode', 'roleName', 'description'],
        order: [['roleName', 'ASC']]
      });

      return {
        success: true,
        roles
      };

    } catch (error) {
      console.error('RoleService getActiveRoles hatası:', error);
      return {
        success: false,
        error: 'Aktif roller getirilirken hata oluştu',
        code: 'GET_ACTIVE_ROLES_ERROR'
      };
    }
  }

  /**
   * ID ile rol getirme
   */
  async getRoleById(roleId) {
    try {
      const role = await Role.findByPk(roleId, {
        include: [
          {
            model: User,
            as: 'users',
            through: { 
              attributes: ['startsAt', 'expiresAt', 'isActive'],
              as: 'userRole'
            },
            attributes: ['id', 'username', 'firstName', 'lastName', 'email']
          },
          {
            model: Permission,
            as: 'permissions',
            through: { 
              attributes: ['accessType'],
              as: 'rolePermission'
            },
            attributes: ['id', 'permissionCode', 'permissionName', 'description']
          }
        ]
      });

      if (!role) {
        return {
          success: false,
          error: 'Rol bulunamadı',
          code: 'ROLE_NOT_FOUND'
        };
      }

      return {
        success: true,
        role
      };

    } catch (error) {
      console.error('RoleService getRoleById hatası:', error);
      return {
        success: false,
        error: 'Rol getirilirken hata oluştu',
        code: 'GET_ROLE_ERROR'
      };
    }
  }

  /**
   * Yeni rol oluşturma
   */
  async createRole(roleData) {
    try {
      const {
        roleCode,
        roleName,
        description,
        permissionIds = []
      } = roleData;

      // Rol kodu kontrolü
      const existingRole = await Role.findOne({
        where: { roleCode: roleCode.toUpperCase() }
      });

      if (existingRole) {
        return {
          success: false,
          error: 'Bu rol kodu zaten kullanımda',
          code: 'ROLE_CODE_EXISTS'
        };
      }

      // Yetkilerinin varlığını kontrol et
      if (permissionIds.length > 0) {
        const existingPermissions = await Permission.findAll({
          where: {
            id: { [Op.in]: permissionIds },
            isActive: true
          }
        });

        if (existingPermissions.length !== permissionIds.length) {
          return {
            success: false,
            error: 'Geçersiz yetki ID\'leri',
            code: 'INVALID_PERMISSION_IDS'
          };
        }
      }

      // Rol oluştur
      const role = await Role.create({
        roleCode: roleCode.toUpperCase(),
        roleName,
        description
      });

      // Yetkilerini ata
      if (permissionIds.length > 0) {
        const rolePermissions = permissionIds.map(permissionId => ({
          roleId: role.id,
          permissionId
        }));

        await RolePermission.bulkCreate(rolePermissions);
      }

      // Rolü yetkilerle birlikte getir
      const createdRole = await this.getRoleById(role.id);

      return {
        success: true,
        message: 'Rol başarıyla oluşturuldu',
        role: createdRole.role
      };

    } catch (error) {
      console.error('RoleService createRole hatası:', error);
      return {
        success: false,
        error: 'Rol oluşturulurken hata oluştu',
        code: 'CREATE_ROLE_ERROR'
      };
    }
  }

  /**
   * Rol güncelleme
   */
  async updateRole(roleId, updateData) {
    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return {
          success: false,
          error: 'Rol bulunamadı',
          code: 'ROLE_NOT_FOUND'
        };
      }

      // Sistem rolü kontrolü
      if (role.isSystemRole) {
        return {
          success: false,
          error: 'Sistem rolleri güncellenemez',
          code: 'SYSTEM_ROLE_UPDATE_DENIED'
        };
      }

      const { roleName, description } = updateData;

      // Rolü güncelle
      await role.update({
        ...(roleName && { roleName }),
        ...(description !== undefined && { description })
      });

      // Güncellenmiş rolü getir
      const updatedRole = await this.getRoleById(roleId);

      return {
        success: true,
        message: 'Rol başarıyla güncellendi',
        role: updatedRole.role
      };

    } catch (error) {
      console.error('RoleService updateRole hatası:', error);
      return {
        success: false,
        error: 'Rol güncellenirken hata oluştu',
        code: 'UPDATE_ROLE_ERROR'
      };
    }
  }

  /**
   * Rol silme
   */
  async deleteRole(roleId) {
    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return {
          success: false,
          error: 'Rol bulunamadı',
          code: 'ROLE_NOT_FOUND'
        };
      }

      // Sistem rolü kontrolü
      if (role.isSystemRole) {
        return {
          success: false,
          error: 'Sistem rolleri silinemez',
          code: 'SYSTEM_ROLE_DELETE_DENIED'
        };
      }

      // Kullanıcı ataması kontrolü
      const userCount = await UserRole.count({
        where: { roleId }
      });

      if (userCount > 0) {
        return {
          success: false,
          error: 'Bu role atanmış kullanıcılar var, önce kullanıcıları başka rollere atayın',
          code: 'ROLE_HAS_USERS'
        };
      }

      // Rol yetkilerini sil
      await RolePermission.destroy({
        where: { roleId }
      });

      // Rolü sil
      await role.destroy();

      return {
        success: true,
        message: 'Rol başarıyla silindi'
      };

    } catch (error) {
      console.error('RoleService deleteRole hatası:', error);
      return {
        success: false,
        error: 'Rol silinirken hata oluştu',
        code: 'DELETE_ROLE_ERROR'
      };
    }
  }

  /**
   * Rol yetkilerini güncelleme
   */
  async updateRolePermissions(roleId, permissionIds) {
    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return {
          success: false,
          error: 'Rol bulunamadı',
          code: 'ROLE_NOT_FOUND'
        };
      }

      // Sistem rolü kontrolü
      if (role.isSystemRole) {
        return {
          success: false,
          error: 'Sistem rollerinin yetkileri güncellenemez',
          code: 'SYSTEM_ROLE_PERMISSION_UPDATE_DENIED'
        };
      }

      // Yetkilerinin varlığını kontrol et
      if (permissionIds.length > 0) {
        const existingPermissions = await Permission.findAll({
          where: {
            id: { [Op.in]: permissionIds },
            isActive: true
          }
        });

        if (existingPermissions.length !== permissionIds.length) {
          return {
            success: false,
            error: 'Geçersiz yetki ID\'leri',
            code: 'INVALID_PERMISSION_IDS'
          };
        }
      }

      // Mevcut yetkilerini sil
      await RolePermission.destroy({
        where: { roleId }
      });

      // Yeni yetkilerini ekle
      if (permissionIds.length > 0) {
        const rolePermissions = permissionIds.map(permissionId => ({
          roleId,
          permissionId
        }));

        await RolePermission.bulkCreate(rolePermissions);
      }

      // Güncellenmiş rolü getir
      const updatedRole = await this.getRoleById(roleId);

      return {
        success: true,
        message: 'Rol yetkileri başarıyla güncellendi',
        role: updatedRole.role
      };

    } catch (error) {
      console.error('RoleService updateRolePermissions hatası:', error);
      return {
        success: false,
        error: 'Rol yetkileri güncellenirken hata oluştu',
        code: 'UPDATE_ROLE_PERMISSIONS_ERROR'
      };
    }
  }

  /**
   * Rol aktivasyon/deaktivasyon
   */
  async toggleRoleStatus(roleId) {
    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return {
          success: false,
          error: 'Rol bulunamadı',
          code: 'ROLE_NOT_FOUND'
        };
      }

      // Sistem rolü kontrolü
      if (role.isSystemRole) {
        return {
          success: false,
          error: 'Sistem rollerinin durumu değiştirilemez',
          code: 'SYSTEM_ROLE_STATUS_CHANGE_DENIED'
        };
      }

      // Durumu değiştir
      await role.update({ isActive: !role.isActive });

      // Güncellenmiş rolü getir
      const updatedRole = await this.getRoleById(roleId);

      return {
        success: true,
        message: `Rol ${role.isActive ? 'aktif' : 'pasif'} hale getirildi`,
        role: updatedRole.role
      };

    } catch (error) {
      console.error('RoleService toggleRoleStatus hatası:', error);
      return {
        success: false,
        error: 'Rol durumu değiştirilirken hata oluştu',
        code: 'TOGGLE_ROLE_STATUS_ERROR'
      };
    }
  }

  /**
   * Rol kullanıcıları listesi
   */
  async getRoleUsers(roleId) {
    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return {
          success: false,
          error: 'Rol bulunamadı',
          code: 'ROLE_NOT_FOUND'
        };
      }

      const users = await User.findAll({
        include: [
          {
            model: Role,
            as: 'roles',
            where: { id: roleId },
            through: { 
              attributes: ['startsAt', 'expiresAt', 'isActive'],
              as: 'userRole'
            },
            attributes: []
          }
        ],
        attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'isActive'],
        order: [['firstName', 'ASC'], ['lastName', 'ASC']]
      });

      return {
        success: true,
        users
      };

    } catch (error) {
      console.error('RoleService getRoleUsers hatası:', error);
      return {
        success: false,
        error: 'Rol kullanıcıları getirilirken hata oluştu',
        code: 'GET_ROLE_USERS_ERROR'
      };
    }
  }

  /**
   * Rol yetkilerini görüntüleme
   */
  async getRolePermissions(roleId) {
    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return {
          success: false,
          error: 'Rol bulunamadı',
          code: 'ROLE_NOT_FOUND'
        };
      }

      const permissions = await Permission.findAll({
        include: [
          {
            model: Role,
            as: 'roles',
            where: { id: roleId },
            through: { 
              attributes: ['accessType'],
              as: 'rolePermission'
            },
            attributes: []
          }
        ],
        attributes: ['id', 'permissionCode', 'permissionName', 'description', 'permissionType'],
        order: [['permissionCode', 'ASC']]
      });

      return {
        success: true,
        permissions
      };

    } catch (error) {
      console.error('RoleService getRolePermissions hatası:', error);
      return {
        success: false,
        error: 'Rol yetkileri getirilirken hata oluştu',
        code: 'GET_ROLE_PERMISSIONS_ERROR'
      };
    }
  }
}

module.exports = RoleService;