'use strict';

/**
 * Permission Middleware
 * Yetki kontrolü middleware'i
 */

/**
 * Belirli bir yetki gerektiren middleware oluşturur
 * @param {string|Array} requiredPermissions - Gerekli yetki(ler)
 * @returns {Function} Express middleware fonksiyonu
 */
function permissionMiddleware(requiredPermissions) {
  return (req, res, next) => {
    try {
      // Kullanıcı authentication kontrolü
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      // Süper admin kontrolü (tüm yetkilere sahip)
      if (req.user.is_super_admin) {
        return next();
      }

      // Gerekli yetkiler array'e çevir
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      // Kullanıcının yetkileri
      const userPermissions = req.user.permissions || [];

      // Yetki kontrolü
      const hasPermission = permissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Bu işlem için yetkiniz bulunmuyor',
          code: 'INSUFFICIENT_PERMISSIONS',
          required_permissions: permissions,
          user_permissions: userPermissions
        });
      }

      // Yetki var, devam et
      next();

    } catch (error) {
      console.error('Permission middleware hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Yetki kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
}

/**
 * Modül erişim kontrolü middleware'i
 * @param {string} moduleCode - Modül kodu
 * @returns {Function} Express middleware fonksiyonu
 */
function moduleAccessMiddleware(moduleCode) {
  return (req, res, next) => {
    try {
      // Kullanıcı authentication kontrolü
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      // Süper admin kontrolü
      if (req.user.is_super_admin) {
        return next();
      }

      // Modül erişim kontrolü
      const userModules = req.user.modules || [];
      
      if (!userModules.includes(moduleCode)) {
        return res.status(403).json({
          success: false,
          message: `${moduleCode} modülüne erişim yetkiniz bulunmuyor`,
          code: 'MODULE_ACCESS_DENIED',
          required_module: moduleCode,
          user_modules: userModules
        });
      }

      // Modül erişimi var, devam et
      next();

    } catch (error) {
      console.error('Module access middleware hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Modül erişim kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
}

/**
 * Rol bazlı erişim kontrolü middleware'i
 * @param {string|Array} requiredRoles - Gerekli rol(ler)
 * @returns {Function} Express middleware fonksiyonu
 */
function roleMiddleware(requiredRoles) {
  return (req, res, next) => {
    try {
      // Kullanıcı authentication kontrolü
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      // Süper admin kontrolü
      if (req.user.is_super_admin) {
        return next();
      }

      // Gerekli roller array'e çevir
      const roles = Array.isArray(requiredRoles) 
        ? requiredRoles 
        : [requiredRoles];

      // Kullanıcının rolleri
      const userRoles = req.user.roles || [];

      // Rol kontrolü
      const hasRole = roles.some(role => 
        userRoles.includes(role)
      );

      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message: 'Bu işlem için gerekli role sahip değilsiniz',
          code: 'INSUFFICIENT_ROLE',
          required_roles: roles,
          user_roles: userRoles
        });
      }

      // Rol var, devam et
      next();

    } catch (error) {
      console.error('Role middleware hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Rol kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
}

/**
 * Çoklu yetki kontrolü (AND logic)
 * Tüm yetkiler gerekli
 * @param {Array} requiredPermissions - Gerekli tüm yetkiler
 * @returns {Function} Express middleware fonksiyonu
 */
function requireAllPermissions(requiredPermissions) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (req.user.is_super_admin) {
        return next();
      }

      const userPermissions = req.user.permissions || [];

      // Tüm yetkiler var mı kontrol et
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        const missingPermissions = requiredPermissions.filter(permission => 
          !userPermissions.includes(permission)
        );

        return res.status(403).json({
          success: false,
          message: 'Eksik yetkiler bulunuyor',
          code: 'MISSING_PERMISSIONS',
          missing_permissions: missingPermissions,
          required_permissions: requiredPermissions
        });
      }

      next();

    } catch (error) {
      console.error('All permissions middleware hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Yetki kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
}

/**
 * Koşullu yetki kontrolü
 * Belirli koşullarda farklı yetkiler gerektirir
 * @param {Function} conditionFn - Koşul fonksiyonu
 * @param {string|Array} truePermissions - Koşul true ise gerekli yetkiler
 * @param {string|Array} falsePermissions - Koşul false ise gerekli yetkiler
 * @returns {Function} Express middleware fonksiyonu
 */
function conditionalPermission(conditionFn, truePermissions, falsePermissions) {
  return (req, res, next) => {
    try {
      const condition = conditionFn(req);
      const requiredPermissions = condition ? truePermissions : falsePermissions;
      
      // Standart permission middleware'i çağır
      return permissionMiddleware(requiredPermissions)(req, res, next);

    } catch (error) {
      console.error('Conditional permission middleware hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Koşullu yetki kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
}

module.exports = permissionMiddleware;
module.exports.moduleAccess = moduleAccessMiddleware;
module.exports.role = roleMiddleware;
module.exports.requireAll = requireAllPermissions;
module.exports.conditional = conditionalPermission;