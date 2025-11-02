/**
 * Kullanıcı Yönetimi Servisi
 * User Management Business Logic
 */

const { User, Role, UserRole, Permission } = require('../models');
const { Op } = require('sequelize');

class UserService {
  /**
   * Kullanıcı listesi (filtreleme ve sayfalama ile)
   */
  async getUsers(filters = {}) {
    try {
      const {
        search,
        isActive,
        roleId,
        page = 1,
        limit = 10
      } = filters;

      // Where koşulları
      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (isActive !== undefined) {
        whereConditions.isActive = isActive === 'true';
      }

      // Include koşulları
      const includeConditions = [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['id', 'roleCode', 'roleName']
        }
      ];

      // Rol filtresi varsa
      if (roleId) {
        includeConditions[0].where = { id: roleId };
        includeConditions[0].required = true;
      }

      // Sayfalama hesaplamaları
      const offset = (page - 1) * limit;

      // Kullanıcıları getir
      const { count, rows: users } = await User.findAndCountAll({
        where: whereConditions,
        include: includeConditions,
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']],
        distinct: true
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
        users,
        pagination
      };

    } catch (error) {
      console.error('UserService getUsers hatası:', error);
      return {
        success: false,
        error: 'Kullanıcılar getirilirken hata oluştu',
        code: 'GET_USERS_ERROR'
      };
    }
  }

  /**
   * ID ile kullanıcı getirme
   */
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'roles',
            through: { 
              attributes: ['startsAt', 'expiresAt', 'isActive'],
              as: 'userRole'
            },
            attributes: ['id', 'roleCode', 'roleName', 'description']
          },
          {
            model: Permission,
            as: 'permissions',
            through: { 
              attributes: ['accessType', 'startsAt', 'expiresAt'],
              as: 'userPermission'
            },
            attributes: ['id', 'permissionCode', 'permissionName']
          }
        ]
      });

      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      return {
        success: true,
        user
      };

    } catch (error) {
      console.error('UserService getUserById hatası:', error);
      return {
        success: false,
        error: 'Kullanıcı getirilirken hata oluştu',
        code: 'GET_USER_ERROR'
      };
    }
  }

  /**
   * Yeni kullanıcı oluşturma
   */
  async createUser(userData) {
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        roleIds = []
      } = userData;

      // Kullanıcı adı ve email kontrolü
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Bu kullanıcı adı veya email zaten kullanımda',
          code: 'USER_ALREADY_EXISTS'
        };
      }

      // Rollerin varlığını kontrol et
      if (roleIds.length > 0) {
        const existingRoles = await Role.findAll({
          where: {
            id: { [Op.in]: roleIds },
            isActive: true
          }
        });

        if (existingRoles.length !== roleIds.length) {
          return {
            success: false,
            error: 'Geçersiz rol ID\'leri',
            code: 'INVALID_ROLE_IDS'
          };
        }
      }

      // Kullanıcı oluştur
      const user = await User.create({
        username,
        email,
        passwordHash: password, // Model'de hash'lenecek
        firstName,
        lastName
      });

      // Rolleri ata
      if (roleIds.length > 0) {
        const userRoles = roleIds.map(roleId => ({
          userId: user.id,
          roleId
        }));

        await UserRole.bulkCreate(userRoles);
      }

      // Kullanıcıyı rollerle birlikte getir
      const createdUser = await this.getUserById(user.id);

      return {
        success: true,
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: createdUser.user
      };

    } catch (error) {
      console.error('UserService createUser hatası:', error);
      return {
        success: false,
        error: 'Kullanıcı oluşturulurken hata oluştu',
        code: 'CREATE_USER_ERROR'
      };
    }
  }

  /**
   * Kullanıcı güncelleme
   */
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      const {
        username,
        email,
        firstName,
        lastName
      } = updateData;

      // Kullanıcı adı ve email kontrolü (kendisi hariç)
      if (username || email) {
        const whereConditions = {
          id: { [Op.ne]: userId }
        };

        if (username && email) {
          whereConditions[Op.or] = [
            { username },
            { email }
          ];
        } else if (username) {
          whereConditions.username = username;
        } else if (email) {
          whereConditions.email = email;
        }

        const existingUser = await User.findOne({
          where: whereConditions
        });

        if (existingUser) {
          return {
            success: false,
            error: 'Bu kullanıcı adı veya email zaten kullanımda',
            code: 'USER_ALREADY_EXISTS'
          };
        }
      }

      // Kullanıcıyı güncelle
      await user.update({
        ...(username && { username }),
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName })
      });

      // Güncellenmiş kullanıcıyı getir
      const updatedUser = await this.getUserById(userId);

      return {
        success: true,
        message: 'Kullanıcı başarıyla güncellendi',
        user: updatedUser.user
      };

    } catch (error) {
      console.error('UserService updateUser hatası:', error);
      return {
        success: false,
        error: 'Kullanıcı güncellenirken hata oluştu',
        code: 'UPDATE_USER_ERROR'
      };
    }
  }

  /**
   * Kullanıcı silme (soft delete)
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      // Kullanıcıyı pasif yap
      await user.update({ isActive: false });

      return {
        success: true,
        message: 'Kullanıcı başarıyla silindi'
      };

    } catch (error) {
      console.error('UserService deleteUser hatası:', error);
      return {
        success: false,
        error: 'Kullanıcı silinirken hata oluştu',
        code: 'DELETE_USER_ERROR'
      };
    }
  }

  /**
   * Kullanıcı profil güncelleme
   */
  async updateProfile(userId, profileData) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      const { firstName, lastName, email } = profileData;

      // Email kontrolü (kendisi hariç)
      if (email && email !== user.email) {
        const existingUser = await User.findOne({
          where: {
            email,
            id: { [Op.ne]: userId }
          }
        });

        if (existingUser) {
          return {
            success: false,
            error: 'Bu email adresi zaten kullanımda',
            code: 'EMAIL_ALREADY_EXISTS'
          };
        }
      }

      // Profili güncelle
      await user.update({
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email })
      });

      // Güncellenmiş kullanıcıyı getir
      const updatedUser = await this.getUserById(userId);

      return {
        success: true,
        message: 'Profil başarıyla güncellendi',
        user: updatedUser.user
      };

    } catch (error) {
      console.error('UserService updateProfile hatası:', error);
      return {
        success: false,
        error: 'Profil güncellenirken hata oluştu',
        code: 'UPDATE_PROFILE_ERROR'
      };
    }
  }

  /**
   * Kullanıcı rollerini güncelleme
   */
  async updateUserRoles(userId, roleIds) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      // Rollerin varlığını kontrol et
      if (roleIds.length > 0) {
        const existingRoles = await Role.findAll({
          where: {
            id: { [Op.in]: roleIds },
            isActive: true
          }
        });

        if (existingRoles.length !== roleIds.length) {
          return {
            success: false,
            error: 'Geçersiz rol ID\'leri',
            code: 'INVALID_ROLE_IDS'
          };
        }
      }

      // Mevcut rolleri sil
      await UserRole.destroy({
        where: { userId }
      });

      // Yeni rolleri ekle
      if (roleIds.length > 0) {
        const userRoles = roleIds.map(roleId => ({
          userId,
          roleId
        }));

        await UserRole.bulkCreate(userRoles);
      }

      // Güncellenmiş kullanıcıyı getir
      const updatedUser = await this.getUserById(userId);

      return {
        success: true,
        message: 'Kullanıcı rolleri başarıyla güncellendi',
        user: updatedUser.user
      };

    } catch (error) {
      console.error('UserService updateUserRoles hatası:', error);
      return {
        success: false,
        error: 'Kullanıcı rolleri güncellenirken hata oluştu',
        code: 'UPDATE_USER_ROLES_ERROR'
      };
    }
  }

  /**
   * Kullanıcı aktivasyon/deaktivasyon
   */
  async toggleUserStatus(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      // Durumu değiştir
      await user.update({ isActive: !user.isActive });

      // Güncellenmiş kullanıcıyı getir
      const updatedUser = await this.getUserById(userId);

      return {
        success: true,
        message: `Kullanıcı ${user.isActive ? 'aktif' : 'pasif'} hale getirildi`,
        user: updatedUser.user
      };

    } catch (error) {
      console.error('UserService toggleUserStatus hatası:', error);
      return {
        success: false,
        error: 'Kullanıcı durumu değiştirilirken hata oluştu',
        code: 'TOGGLE_USER_STATUS_ERROR'
      };
    }
  }

  /**
   * Kullanıcı şifre sıfırlama (admin)
   */
  async resetUserPassword(userId, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      // Şifreyi güncelle (model'de hash'lenecek)
      await user.update({ 
        passwordHash: newPassword,
        passwordChangedAt: new Date()
      });

      return {
        success: true,
        message: 'Kullanıcı şifresi başarıyla sıfırlandı'
      };

    } catch (error) {
      console.error('UserService resetUserPassword hatası:', error);
      return {
        success: false,
        error: 'Şifre sıfırlanırken hata oluştu',
        code: 'RESET_PASSWORD_ERROR'
      };
    }
  }
}

module.exports = UserService;