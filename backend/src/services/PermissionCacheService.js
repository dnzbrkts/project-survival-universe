/**
 * Yetki Cache Servisi
 * Kullanıcı yetkilerini Redis'te cache'leme ve performans optimizasyonu
 */

const { cache } = require('../config/redis');

class PermissionCacheService {
  constructor() {
    this.cachePrefix = 'permissions:';
    this.userPermissionsTTL = 3600; // 1 saat
    this.rolePermissionsTTL = 7200; // 2 saat
    this.modulePermissionsTTL = 14400; // 4 saat
  }

  /**
   * Kullanıcı yetkilerini cache'e kaydetme
   * @param {number} userId - Kullanıcı ID
   * @param {Array} permissions - Yetki listesi
   * @param {Array} roles - Rol listesi
   */
  async cacheUserPermissions(userId, permissions, roles) {
    try {
      const cacheKey = `${this.cachePrefix}user:${userId}`;
      const cacheData = {
        permissions: permissions || [],
        roles: roles || [],
        cachedAt: new Date().toISOString()
      };

      await cache.set(cacheKey, cacheData, this.userPermissionsTTL);
      return true;

    } catch (error) {
      console.error('Kullanıcı yetki cache hatası:', error);
      return false;
    }
  }

  /**
   * Kullanıcı yetkilerini cache'den getirme
   * @param {number} userId - Kullanıcı ID
   * @returns {Object|null} Cache'lenmiş yetkiler
   */
  async getUserPermissionsFromCache(userId) {
    try {
      const cacheKey = `${this.cachePrefix}user:${userId}`;
      return await cache.get(cacheKey);

    } catch (error) {
      console.error('Kullanıcı yetki cache getirme hatası:', error);
      return null;
    }
  }

  /**
   * Kullanıcı yetki cache'ini temizleme
   * @param {number} userId - Kullanıcı ID
   */
  async clearUserPermissionsCache(userId) {
    try {
      const cacheKey = `${this.cachePrefix}user:${userId}`;
      await cache.del(cacheKey);
      return true;

    } catch (error) {
      console.error('Kullanıcı yetki cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Rol yetkilerini cache'e kaydetme
   * @param {number} roleId - Rol ID
   * @param {Array} permissions - Yetki listesi
   */
  async cacheRolePermissions(roleId, permissions) {
    try {
      const cacheKey = `${this.cachePrefix}role:${roleId}`;
      const cacheData = {
        permissions: permissions || [],
        cachedAt: new Date().toISOString()
      };

      await cache.set(cacheKey, cacheData, this.rolePermissionsTTL);
      return true;

    } catch (error) {
      console.error('Rol yetki cache hatası:', error);
      return false;
    }
  }

  /**
   * Rol yetkilerini cache'den getirme
   * @param {number} roleId - Rol ID
   * @returns {Object|null} Cache'lenmiş yetkiler
   */
  async getRolePermissionsFromCache(roleId) {
    try {
      const cacheKey = `${this.cachePrefix}role:${roleId}`;
      return await cache.get(cacheKey);

    } catch (error) {
      console.error('Rol yetki cache getirme hatası:', error);
      return null;
    }
  }

  /**
   * Rol yetki cache'ini temizleme
   * @param {number} roleId - Rol ID
   */
  async clearRolePermissionsCache(roleId) {
    try {
      const cacheKey = `${this.cachePrefix}role:${roleId}`;
      await cache.del(cacheKey);
      return true;

    } catch (error) {
      console.error('Rol yetki cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Modül yetkilerini cache'e kaydetme
   * @param {string} moduleCode - Modül kodu
   * @param {Array} permissions - Yetki listesi
   */
  async cacheModulePermissions(moduleCode, permissions) {
    try {
      const cacheKey = `${this.cachePrefix}module:${moduleCode}`;
      const cacheData = {
        permissions: permissions || [],
        cachedAt: new Date().toISOString()
      };

      await cache.set(cacheKey, cacheData, this.modulePermissionsTTL);
      return true;

    } catch (error) {
      console.error('Modül yetki cache hatası:', error);
      return false;
    }
  }

  /**
   * Modül yetkilerini cache'den getirme
   * @param {string} moduleCode - Modül kodu
   * @returns {Object|null} Cache'lenmiş yetkiler
   */
  async getModulePermissionsFromCache(moduleCode) {
    try {
      const cacheKey = `${this.cachePrefix}module:${moduleCode}`;
      return await cache.get(cacheKey);

    } catch (error) {
      console.error('Modül yetki cache getirme hatası:', error);
      return null;
    }
  }

  /**
   * Modül yetki cache'ini temizleme
   * @param {string} moduleCode - Modül kodu
   */
  async clearModulePermissionsCache(moduleCode) {
    try {
      const cacheKey = `${this.cachePrefix}module:${moduleCode}`;
      await cache.del(cacheKey);
      return true;

    } catch (error) {
      console.error('Modül yetki cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Kullanıcı menüsünü cache'e kaydetme
   * @param {number} userId - Kullanıcı ID
   * @param {Array} menu - Menü verisi
   */
  async cacheUserMenu(userId, menu) {
    try {
      const cacheKey = `${this.cachePrefix}menu:${userId}`;
      const cacheData = {
        menu: menu || [],
        cachedAt: new Date().toISOString()
      };

      await cache.set(cacheKey, cacheData, this.userPermissionsTTL);
      return true;

    } catch (error) {
      console.error('Kullanıcı menü cache hatası:', error);
      return false;
    }
  }

  /**
   * Kullanıcı menüsünü cache'den getirme
   * @param {number} userId - Kullanıcı ID
   * @returns {Object|null} Cache'lenmiş menü
   */
  async getUserMenuFromCache(userId) {
    try {
      const cacheKey = `${this.cachePrefix}menu:${userId}`;
      return await cache.get(cacheKey);

    } catch (error) {
      console.error('Kullanıcı menü cache getirme hatası:', error);
      return null;
    }
  }

  /**
   * Kullanıcı menü cache'ini temizleme
   * @param {number} userId - Kullanıcı ID
   */
  async clearUserMenuCache(userId) {
    try {
      const cacheKey = `${this.cachePrefix}menu:${userId}`;
      await cache.del(cacheKey);
      return true;

    } catch (error) {
      console.error('Kullanıcı menü cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Yetki kontrolü sonucunu cache'e kaydetme
   * @param {number} userId - Kullanıcı ID
   * @param {string} permission - Yetki kodu
   * @param {boolean} hasPermission - Yetki var mı?
   */
  async cachePermissionCheck(userId, permission, hasPermission) {
    try {
      const cacheKey = `${this.cachePrefix}check:${userId}:${permission}`;
      const cacheData = {
        hasPermission,
        cachedAt: new Date().toISOString()
      };

      // Kısa TTL - yetki değişiklikleri hızlı yansısın
      await cache.set(cacheKey, cacheData, 300); // 5 dakika
      return true;

    } catch (error) {
      console.error('Yetki kontrolü cache hatası:', error);
      return false;
    }
  }

  /**
   * Yetki kontrolü sonucunu cache'den getirme
   * @param {number} userId - Kullanıcı ID
   * @param {string} permission - Yetki kodu
   * @returns {Object|null} Cache'lenmiş sonuç
   */
  async getPermissionCheckFromCache(userId, permission) {
    try {
      const cacheKey = `${this.cachePrefix}check:${userId}:${permission}`;
      return await cache.get(cacheKey);

    } catch (error) {
      console.error('Yetki kontrolü cache getirme hatası:', error);
      return null;
    }
  }

  /**
   * Kullanıcının tüm cache'lerini temizleme
   * @param {number} userId - Kullanıcı ID
   */
  async clearAllUserCaches(userId) {
    try {
      const patterns = [
        `${this.cachePrefix}user:${userId}`,
        `${this.cachePrefix}menu:${userId}`,
        `${this.cachePrefix}check:${userId}:*`
      ];

      for (const pattern of patterns) {
        if (pattern.includes('*')) {
          // Pattern ile eşleşen anahtarları bul ve sil
          const keys = await cache.keys(pattern);
          for (const key of keys) {
            await cache.del(key);
          }
        } else {
          await cache.del(pattern);
        }
      }

      return true;

    } catch (error) {
      console.error('Kullanıcı cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Rol değişikliğinde ilgili kullanıcıların cache'lerini temizleme
   * @param {number} roleId - Rol ID
   * @param {Array} userIds - Etkilenen kullanıcı ID'leri
   */
  async clearCacheForRoleChange(roleId, userIds = []) {
    try {
      // Rol cache'ini temizle
      await this.clearRolePermissionsCache(roleId);

      // Etkilenen kullanıcıların cache'lerini temizle
      for (const userId of userIds) {
        await this.clearAllUserCaches(userId);
      }

      return true;

    } catch (error) {
      console.error('Rol değişikliği cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Modül değişikliğinde ilgili cache'leri temizleme
   * @param {string} moduleCode - Modül kodu
   */
  async clearCacheForModuleChange(moduleCode) {
    try {
      // Modül cache'ini temizle
      await this.clearModulePermissionsCache(moduleCode);

      // Tüm kullanıcı menü cache'lerini temizle (modül değişikliği menüyü etkiler)
      const menuKeys = await cache.keys(`${this.cachePrefix}menu:*`);
      for (const key of menuKeys) {
        await cache.del(key);
      }

      return true;

    } catch (error) {
      console.error('Modül değişikliği cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Tüm yetki cache'lerini temizleme
   */
  async clearAllPermissionCaches() {
    try {
      const keys = await cache.keys(`${this.cachePrefix}*`);
      for (const key of keys) {
        await cache.del(key);
      }

      return true;

    } catch (error) {
      console.error('Tüm yetki cache temizleme hatası:', error);
      return false;
    }
  }

  /**
   * Cache istatistikleri
   * @returns {Object} Cache istatistikleri
   */
  async getCacheStats() {
    try {
      const userKeys = await cache.keys(`${this.cachePrefix}user:*`);
      const roleKeys = await cache.keys(`${this.cachePrefix}role:*`);
      const moduleKeys = await cache.keys(`${this.cachePrefix}module:*`);
      const menuKeys = await cache.keys(`${this.cachePrefix}menu:*`);
      const checkKeys = await cache.keys(`${this.cachePrefix}check:*`);

      return {
        totalKeys: userKeys.length + roleKeys.length + moduleKeys.length + menuKeys.length + checkKeys.length,
        userPermissions: userKeys.length,
        rolePermissions: roleKeys.length,
        modulePermissions: moduleKeys.length,
        userMenus: menuKeys.length,
        permissionChecks: checkKeys.length
      };

    } catch (error) {
      console.error('Cache istatistik hatası:', error);
      return {
        totalKeys: 0,
        userPermissions: 0,
        rolePermissions: 0,
        modulePermissions: 0,
        userMenus: 0,
        permissionChecks: 0
      };
    }
  }
}

module.exports = PermissionCacheService;