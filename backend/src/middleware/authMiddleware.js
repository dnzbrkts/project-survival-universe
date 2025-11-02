/**
 * Kimlik Doğrulama Middleware'leri
 * JWT token doğrulama ve yetkilendirme kontrolü
 */

const AuthService = require('../services/AuthService');
const { PermissionManager } = require('../core');

class AuthMiddleware {
  constructor() {
    this.authService = new AuthService();
    this.permissionManager = null; // DynamicModuleSystem'den alınacak
  }

  /**
   * Permission Manager'ı set etme
   * @param {PermissionManager} permissionManager - Permission Manager instance
   */
  setPermissionManager(permissionManager) {
    this.permissionManager = permissionManager;
  }

  /**
   * JWT Token doğrulama middleware'i
   * @returns {Function} Express middleware
   */
  authenticateToken() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
          return res.status(401).json({
            error: 'Authorization header gerekli',
            code: 'MISSING_AUTH_HEADER'
          });
        }

        const token = authHeader.startsWith('Bearer ') 
          ? authHeader.slice(7) 
          : authHeader;

        if (!token) {
          return res.status(401).json({
            error: 'Token gerekli',
            code: 'MISSING_TOKEN'
          });
        }

        // Token doğrulama
        const verificationResult = await this.authService.verifyToken(token);
        
        if (!verificationResult.success) {
          return res.status(401).json({
            error: verificationResult.error,
            code: verificationResult.code
          });
        }

        // Kullanıcı bilgilerini request'e ekle
        req.user = verificationResult.user;
        req.token = token;

        // Permission Manager'a kullanıcı yetkilerini yükle
        if (this.permissionManager) {
          this.permissionManager.loadUserPermissions(
            req.user.id,
            req.user.allPermissions || [],
            req.user.roles || []
          );
        }

        next();

      } catch (error) {
        console.error('Auth middleware hatası:', error);
        return res.status(500).json({
          error: 'Kimlik doğrulama hatası',
          code: 'AUTH_ERROR'
        });
      }
    };
  }

  /**
   * Opsiyonel kimlik doğrulama (token varsa doğrula, yoksa devam et)
   * @returns {Function} Express middleware
   */
  optionalAuth() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
          return next();
        }

        const token = authHeader.startsWith('Bearer ') 
          ? authHeader.slice(7) 
          : authHeader;

        if (!token) {
          return next();
        }

        // Token doğrulama
        const verificationResult = await this.authService.verifyToken(token);
        
        if (verificationResult.success) {
          req.user = verificationResult.user;
          req.token = token;

          // Permission Manager'a kullanıcı yetkilerini yükle
          if (this.permissionManager) {
            this.permissionManager.loadUserPermissions(
              req.user.id,
              req.user.allPermissions || [],
              req.user.roles || []
            );
          }
        }

        next();

      } catch (error) {
        // Opsiyonel auth'da hata olursa sadece devam et
        next();
      }
    };
  }

  /**
   * Rol kontrolü middleware'i
   * @param {string|Array} requiredRoles - Gerekli roller
   * @returns {Function} Express middleware
   */
  requireRoles(requiredRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      const userRoles = req.user.roleCodes || [];
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      const hasRequiredRole = roles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({
          error: 'Yetkisiz erişim - Gerekli rol yok',
          code: 'INSUFFICIENT_ROLE',
          requiredRoles: roles,
          userRoles
        });
      }

      next();
    };
  }

  /**
   * Yetki kontrolü middleware'i
   * @param {string|Array} requiredPermissions - Gerekli yetkiler
   * @param {string} operator - 'AND' veya 'OR' (varsayılan: 'AND')
   * @returns {Function} Express middleware
   */
  requirePermissions(requiredPermissions, operator = 'AND') {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (!this.permissionManager) {
        console.warn('Permission Manager bulunamadı, yetki kontrolü atlanıyor');
        return next();
      }

      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      try {
        let hasPermission = false;

        if (operator === 'OR') {
          hasPermission = await this.permissionManager.hasAnyPermission(req.user.id, permissions);
        } else {
          hasPermission = await this.permissionManager.hasAllPermissions(req.user.id, permissions);
        }

        if (!hasPermission) {
          return res.status(403).json({
            error: 'Yetkisiz erişim - Gerekli yetki yok',
            code: 'INSUFFICIENT_PERMISSIONS',
            requiredPermissions: permissions,
            operator
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
   * Modül erişim kontrolü middleware'i
   * @param {string} moduleCode - Modül kodu
   * @returns {Function} Express middleware
   */
  requireModuleAccess(moduleCode) {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (!this.permissionManager) {
        console.warn('Permission Manager bulunamadı, modül erişim kontrolü atlanıyor');
        return next();
      }

      try {
        const hasAccess = await this.permissionManager.hasModuleAccess(req.user.id, moduleCode);

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

  /**
   * Sayfa erişim kontrolü middleware'i
   * @param {string} moduleCode - Modül kodu
   * @param {string} page - Sayfa adı
   * @returns {Function} Express middleware
   */
  requirePageAccess(moduleCode, page) {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (!this.permissionManager) {
        console.warn('Permission Manager bulunamadı, sayfa erişim kontrolü atlanıyor');
        return next();
      }

      try {
        const hasAccess = await this.permissionManager.hasPageAccess(req.user.id, moduleCode, page);

        if (!hasAccess) {
          return res.status(403).json({
            error: 'Sayfa erişim yetkisi yok',
            code: 'PAGE_ACCESS_DENIED',
            module: moduleCode,
            page
          });
        }

        next();
      } catch (error) {
        console.error('Sayfa erişim kontrolü hatası:', error);
        return res.status(500).json({
          error: 'Sayfa erişim kontrolü sırasında hata oluştu',
          code: 'PAGE_ACCESS_CHECK_ERROR'
        });
      }
    };
  }

  /**
   * İşlem yetkisi kontrolü middleware'i
   * @param {string} moduleCode - Modül kodu
   * @param {string} action - İşlem adı
   * @param {string} resource - Kaynak adı (opsiyonel)
   * @returns {Function} Express middleware
   */
  requireActionPermission(moduleCode, action, resource = null) {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (!this.permissionManager) {
        console.warn('Permission Manager bulunamadı, işlem yetki kontrolü atlanıyor');
        return next();
      }

      try {
        const hasPermission = await this.permissionManager.hasActionPermission(
          req.user.id, 
          moduleCode, 
          action, 
          resource
        );

        if (!hasPermission) {
          return res.status(403).json({
            error: 'İşlem yetkisi yok',
            code: 'ACTION_PERMISSION_DENIED',
            module: moduleCode,
            action,
            resource
          });
        }

        next();
      } catch (error) {
        console.error('İşlem yetki kontrolü hatası:', error);
        return res.status(500).json({
          error: 'İşlem yetki kontrolü sırasında hata oluştu',
          code: 'ACTION_PERMISSION_CHECK_ERROR'
        });
      }
    };
  }

  /**
   * Veri seviyesi erişim kontrolü middleware'i
   * @param {string} moduleCode - Modül kodu
   * @param {string} dataLevel - Veri seviyesi (own, department, all)
   * @returns {Function} Express middleware
   */
  requireDataLevelAccess(moduleCode, dataLevel) {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (!this.permissionManager) {
        console.warn('Permission Manager bulunamadı, veri seviyesi kontrolü atlanıyor');
        return next();
      }

      try {
        const hasAccess = await this.permissionManager.hasDataLevelAccess(
          req.user.id, 
          moduleCode, 
          dataLevel
        );

        if (!hasAccess) {
          return res.status(403).json({
            error: 'Veri seviyesi erişim yetkisi yok',
            code: 'DATA_LEVEL_ACCESS_DENIED',
            module: moduleCode,
            dataLevel
          });
        }

        // Veri seviyesini request'e ekle
        req.dataLevel = dataLevel;
        
        next();
      } catch (error) {
        console.error('Veri seviyesi erişim kontrolü hatası:', error);
        return res.status(500).json({
          error: 'Veri seviyesi erişim kontrolü sırasında hata oluştu',
          code: 'DATA_LEVEL_ACCESS_CHECK_ERROR'
        });
      }
    };
  }

  /**
   * Admin yetkisi kontrolü
   * @returns {Function} Express middleware
   */
  requireAdmin() {
    return this.requireRoles(['ADMIN', 'SUPER_ADMIN']);
  }

  /**
   * Super Admin yetkisi kontrolü
   * @returns {Function} Express middleware
   */
  requireSuperAdmin() {
    return this.requireRoles('SUPER_ADMIN');
  }

  /**
   * Kullanıcının kendi verilerine erişim kontrolü
   * @param {string} userIdParam - Request parametresindeki user ID field adı
   * @returns {Function} Express middleware
   */
  requireOwnDataOrAdmin(userIdParam = 'userId') {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Kimlik doğrulama gerekli',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      const requestedUserId = parseInt(req.params[userIdParam]);
      const currentUserId = req.user.id;
      const userRoles = req.user.roleCodes || [];

      // Admin veya Super Admin ise tüm verilere erişebilir
      if (userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN')) {
        return next();
      }

      // Kendi verisi mi kontrol et
      if (requestedUserId === currentUserId) {
        return next();
      }

      return res.status(403).json({
        error: 'Sadece kendi verilerinize erişebilirsiniz',
        code: 'OWN_DATA_ACCESS_ONLY'
      });
    };
  }
}

// Singleton instance
const authMiddleware = new AuthMiddleware();

module.exports = authMiddleware;