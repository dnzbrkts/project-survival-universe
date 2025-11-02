/**
 * Yetki Yönetim Sistemi
 * Granüler yetki kontrolü ve rol bazlı erişim yönetimi
 */

const PermissionCacheService = require('../services/PermissionCacheService');

class PermissionManager {
  constructor(moduleRegistry) {
    this.moduleRegistry = moduleRegistry;
    this.userPermissions = new Map(); // userId -> Set of permissions
    this.rolePermissions = new Map(); // roleId -> Set of permissions
    this.userRoles = new Map(); // userId -> Set of roleIds
    this.permissionCache = new Map(); // Local cache for performance
    this.cacheService = new PermissionCacheService(); // Redis cache service
    this.cacheEnabled = true; // Cache kullanımı aktif mi?
  }

  /**
   * Kullanıcı yetkilerini yükleme
   * @param {number} userId - Kullanıcı ID
   * @param {Array} permissions - Yetki listesi
   * @param {Array} roles - Rol listesi
   */
  loadUserPermissions(userId, permissions = [], roles = []) {
    // Direkt yetkiler
    this.userPermissions.set(userId, new Set(permissions));
    
    // Roller
    this.userRoles.set(userId, new Set(roles.map(role => role.id)));
    
    // Rol yetkilerini yükle
    roles.forEach(role => {
      if (!this.rolePermissions.has(role.id)) {
        this.rolePermissions.set(role.id, new Set(role.permissions || []));
      }
    });

    // Cache'i temizle
    this.clearUserCache(userId);
  }

  /**
   * Kullanıcının tüm yetkilerini getirme (direkt + rol bazlı)
   * @param {number} userId - Kullanıcı ID
   * @returns {Promise<Set>} Tüm yetkiler
   */
  async getUserAllPermissions(userId) {
    const cacheKey = `user_${userId}_all_permissions`;
    
    // Local cache kontrolü
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey);
    }

    // Redis cache kontrolü
    if (this.cacheEnabled) {
      try {
        const cachedData = await this.cacheService.getUserPermissionsFromCache(userId);
        if (cachedData && cachedData.permissions) {
          const permissionSet = new Set(cachedData.permissions);
          this.permissionCache.set(cacheKey, permissionSet);
          return permissionSet;
        }
      } catch (error) {
        console.warn('Redis cache okuma hatası, local cache kullanılıyor:', error.message);
      }
    }

    const allPermissions = new Set();

    // Direkt yetkiler
    const userPerms = this.userPermissions.get(userId) || new Set();
    userPerms.forEach(perm => allPermissions.add(perm));

    // Rol bazlı yetkiler
    const userRoles = this.userRoles.get(userId) || new Set();
    userRoles.forEach(roleId => {
      const rolePerms = this.rolePermissions.get(roleId) || new Set();
      rolePerms.forEach(perm => allPermissions.add(perm));
    });

    // Local cache'e kaydet
    this.permissionCache.set(cacheKey, allPermissions);
    
    // Redis cache'e kaydet
    if (this.cacheEnabled) {
      try {
        await this.cacheService.cacheUserPermissions(userId, Array.from(allPermissions), []);
      } catch (error) {
        console.warn('Redis cache yazma hatası:', error.message);
      }
    }
    
    return allPermissions;
  }

  /**
   * Yetki kontrolü
   * @param {number} userId - Kullanıcı ID
   * @param {string} permission - Kontrol edilecek yetki
   * @returns {Promise<boolean>} Yetki var mı?
   */
  async hasPermission(userId, permission) {
    // Redis cache'den yetki kontrolü sonucunu kontrol et
    if (this.cacheEnabled) {
      try {
        const cachedResult = await this.cacheService.getPermissionCheckFromCache(userId, permission);
        if (cachedResult !== null) {
          return cachedResult.hasPermission;
        }
      } catch (error) {
        console.warn('Yetki kontrolü cache okuma hatası:', error.message);
      }
    }

    const userPermissions = await this.getUserAllPermissions(userId);
    const hasPermission = userPermissions.has(permission);

    // Sonucu cache'e kaydet
    if (this.cacheEnabled) {
      try {
        await this.cacheService.cachePermissionCheck(userId, permission, hasPermission);
      } catch (error) {
        console.warn('Yetki kontrolü cache yazma hatası:', error.message);
      }
    }

    return hasPermission;
  }

  /**
   * Çoklu yetki kontrolü (AND)
   * @param {number} userId - Kullanıcı ID
   * @param {Array} permissions - Kontrol edilecek yetkiler
   * @returns {Promise<boolean>} Tüm yetkiler var mı?
   */
  async hasAllPermissions(userId, permissions) {
    const userPermissions = await this.getUserAllPermissions(userId);
    return permissions.every(perm => userPermissions.has(perm));
  }

  /**
   * Çoklu yetki kontrolü (OR)
   * @param {number} userId - Kullanıcı ID
   * @param {Array} permissions - Kontrol edilecek yetkiler
   * @returns {Promise<boolean>} En az bir yetki var mı?
   */
  async hasAnyPermission(userId, permissions) {
    const userPermissions = await this.getUserAllPermissions(userId);
    return permissions.some(perm => userPermissions.has(perm));
  }

  /**
   * Modül erişim kontrolü
   * @param {number} userId - Kullanıcı ID
   * @param {string} moduleCode - Modül kodu
   * @returns {Promise<boolean>} Modüle erişim var mı?
   */
  async hasModuleAccess(userId, moduleCode) {
    // Modül aktif mi kontrol et
    if (!this.moduleRegistry.isModuleActive(moduleCode)) {
      return false;
    }

    const module = this.moduleRegistry.getModule(moduleCode);
    if (!module) {
      return false;
    }

    // Modül yetkilerinden herhangi birine sahip mi?
    if (module.permissions && module.permissions.length > 0) {
      return await this.hasAnyPermission(userId, module.permissions);
    }

    // Modül yetki gerektirmiyorsa, temel modül erişim yetkisini kontrol et
    return await this.hasPermission(userId, `module.${moduleCode.toLowerCase()}.access`);
  }

  /**
   * Sayfa erişim kontrolü
   * @param {number} userId - Kullanıcı ID
   * @param {string} moduleCode - Modül kodu
   * @param {string} page - Sayfa adı
   * @returns {Promise<boolean>} Sayfaya erişim var mı?
   */
  async hasPageAccess(userId, moduleCode, page) {
    // Önce modül erişimini kontrol et
    if (!(await this.hasModuleAccess(userId, moduleCode))) {
      return false;
    }

    // Sayfa yetkisini kontrol et
    const pagePermission = `${moduleCode.toLowerCase()}.${page}.view`;
    return await this.hasPermission(userId, pagePermission);
  }

  /**
   * İşlem yetkisi kontrolü
   * @param {number} userId - Kullanıcı ID
   * @param {string} moduleCode - Modül kodu
   * @param {string} action - İşlem adı (create, read, update, delete)
   * @param {string} resource - Kaynak adı (opsiyonel)
   * @returns {Promise<boolean>} İşlem yetkisi var mı?
   */
  async hasActionPermission(userId, moduleCode, action, resource = null) {
    // Modül erişimini kontrol et
    if (!(await this.hasModuleAccess(userId, moduleCode))) {
      return false;
    }

    // İşlem yetkisini oluştur
    let actionPermission;
    if (resource) {
      actionPermission = `${moduleCode.toLowerCase()}.${resource}.${action}`;
    } else {
      actionPermission = `${moduleCode.toLowerCase()}.${action}`;
    }

    return await this.hasPermission(userId, actionPermission);
  }

  /**
   * Veri seviyesi erişim kontrolü
   * @param {number} userId - Kullanıcı ID
   * @param {string} moduleCode - Modül kodu
   * @param {string} dataLevel - Veri seviyesi (own, department, all)
   * @returns {Promise<boolean>} Veri seviyesi erişimi var mı?
   */
  async hasDataLevelAccess(userId, moduleCode, dataLevel) {
    const dataPermission = `${moduleCode.toLowerCase()}.data.${dataLevel}`;
    return await this.hasPermission(userId, dataPermission);
  }

  /**
   * Dinamik menü oluşturma
   * @param {number} userId - Kullanıcı ID
   * @returns {Promise<Array>} Kullanıcının erişebileceği menü öğeleri
   */
  async generateUserMenu(userId) {
    // Cache'den menü kontrol et
    if (this.cacheEnabled) {
      try {
        const cachedMenu = await this.cacheService.getUserMenuFromCache(userId);
        if (cachedMenu && cachedMenu.menu) {
          return cachedMenu.menu;
        }
      } catch (error) {
        console.warn('Menü cache okuma hatası:', error.message);
      }
    }

    const activeModules = this.moduleRegistry.getActiveModules();
    const userMenu = [];

    for (const module of activeModules) {
      // Modül erişimi var mı?
      if (!(await this.hasModuleAccess(userId, module.code))) {
        continue;
      }

      const moduleMenu = {
        code: module.code,
        name: module.name,
        icon: module.icon,
        color: module.color,
        category: module.category,
        children: []
      };

      // Modül menü öğelerini kontrol et
      if (module.menuItems && module.menuItems.length > 0) {
        for (const menuItem of module.menuItems) {
          // Menü öğesi yetkisi var mı?
          if (menuItem.permission && !(await this.hasPermission(userId, menuItem.permission))) {
            continue;
          }

          moduleMenu.children.push({
            title: menuItem.title,
            path: menuItem.path,
            icon: menuItem.icon,
            permission: menuItem.permission
          });
        }
      }

      // En az bir alt menü varsa ana menüyü ekle
      if (moduleMenu.children.length > 0) {
        userMenu.push(moduleMenu);
      }
    }

    // Kategoriye göre grupla
    const groupedMenu = this.groupMenuByCategory(userMenu);
    
    // Menüyü cache'e kaydet
    if (this.cacheEnabled) {
      try {
        await this.cacheService.cacheUserMenu(userId, groupedMenu);
      } catch (error) {
        console.warn('Menü cache yazma hatası:', error.message);
      }
    }
    
    return groupedMenu;
  }

  /**
   * Menüyü kategoriye göre gruplama
   * @param {Array} menu - Menü öğeleri
   * @returns {Array} Kategoriye göre gruplanmış menü
   */
  groupMenuByCategory(menu) {
    const categories = {};
    
    menu.forEach(item => {
      const category = item.category || 'GENERAL';
      if (!categories[category]) {
        categories[category] = {
          category,
          items: []
        };
      }
      categories[category].items.push(item);
    });

    return Object.values(categories).sort((a, b) => {
      const order = {
        'CORE': 1,
        'OPERASYON': 2,
        'SATIS': 3,
        'MUHASEBE': 4,
        'IK': 5,
        'ENTEGRASYON': 6,
        'SISTEM': 7,
        'GENERAL': 8
      };
      return (order[a.category] || 9) - (order[b.category] || 9);
    });
  }

  /**
   * Kullanıcı yetki özeti
   * @param {number} userId - Kullanıcı ID
   * @returns {Promise<Object>} Yetki özeti
   */
  async getUserPermissionSummary(userId) {
    const allPermissions = await this.getUserAllPermissions(userId);
    const accessibleModules = [];
    
    const activeModules = this.moduleRegistry.getActiveModules();
    for (const module of activeModules) {
      if (await this.hasModuleAccess(userId, module.code)) {
        accessibleModules.push({
          code: module.code,
          name: module.name,
          category: module.category
        });
      }
    }

    return {
      totalPermissions: allPermissions.size,
      permissions: Array.from(allPermissions),
      accessibleModules,
      roles: Array.from(this.userRoles.get(userId) || [])
    };
  }

  /**
   * Kullanıcı cache'ini temizleme
   * @param {number} userId - Kullanıcı ID
   */
  async clearUserCache(userId) {
    // Local cache temizle
    const keysToDelete = [];
    for (const key of this.permissionCache.keys()) {
      if (key.startsWith(`user_${userId}_`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.permissionCache.delete(key));

    // Redis cache temizle
    if (this.cacheEnabled) {
      try {
        await this.cacheService.clearAllUserCaches(userId);
      } catch (error) {
        console.warn('Redis kullanıcı cache temizleme hatası:', error.message);
      }
    }
  }

  /**
   * Tüm cache'i temizleme
   */
  async clearAllCache() {
    // Local cache temizle
    this.permissionCache.clear();

    // Redis cache temizle
    if (this.cacheEnabled) {
      try {
        await this.cacheService.clearAllPermissionCaches();
      } catch (error) {
        console.warn('Redis tüm cache temizleme hatası:', error.message);
      }
    }
  }

  /**
   * Cache'i etkinleştirme/devre dışı bırakma
   * @param {boolean} enabled - Cache aktif mi?
   */
  setCacheEnabled(enabled) {
    this.cacheEnabled = enabled;
  }

  /**
   * Cache istatistikleri
   * @returns {Promise<Object>} Cache istatistikleri
   */
  async getCacheStats() {
    const localStats = {
      localCacheSize: this.permissionCache.size
    };

    if (this.cacheEnabled) {
      try {
        const redisStats = await this.cacheService.getCacheStats();
        return { ...localStats, ...redisStats };
      } catch (error) {
        console.warn('Redis cache istatistik hatası:', error.message);
      }
    }

    return localStats;
  }

  /**
   * Yetki middleware'i oluşturma
   * @param {string|Array} requiredPermissions - Gerekli yetkiler
   * @returns {Function} Express middleware
   */
  requirePermissions(requiredPermissions) {
    return async (req, res, next) => {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      try {
        const hasPermission = await this.hasAllPermissions(userId, permissions);
        
        if (!hasPermission) {
          return res.status(403).json({
            error: 'Yetkisiz erişim',
            code: 'INSUFFICIENT_PERMISSIONS',
            requiredPermissions: permissions
          });
        }

        next();
      } catch (error) {
        console.error('Yetki kontrolü hatası:', error);
        return res.status(500).json({
          error: 'Yetki kontrolü sırasında hata oluştu',
          code: 'PERMISSION_CHECK_ERROR'
        });
      }
    };
  }

  /**
   * Modül erişim middleware'i
   * @param {string} moduleCode - Modül kodu
   * @returns {Function} Express middleware
   */
  requireModuleAccess(moduleCode) {
    return async (req, res, next) => {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      try {
        const hasAccess = await this.hasModuleAccess(userId, moduleCode);
        
        if (!hasAccess) {
          return res.status(403).json({
            error: 'Modül erişim yetkisi yok',
            code: 'MODULE_ACCESS_DENIED',
            module: moduleCode
          });
        }

        next();
      } catch (error) {
        console.error('Modül erişim kontrolü hatası:', error);
        return res.status(500).json({
          error: 'Modül erişim kontrolü sırasında hata oluştu',
          code: 'MODULE_ACCESS_CHECK_ERROR'
        });
      }
    };
  }
}

module.exports = PermissionManager;