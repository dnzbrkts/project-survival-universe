/**
 * Kimlik Doğrulama Controller
 * Auth API endpoint'leri
 */

const { body, validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Kullanıcı girişi
   */
  async login(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { identifier, password } = req.body;

      const result = await this.authService.login(identifier, password);

      if (!result.success) {
        return res.status(401).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        user: result.user,
        tokens: result.tokens
      });

    } catch (error) {
      console.error('Login controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı kaydı
   */
  async register(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const userData = req.body;

      const result = await this.authService.register(userData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        user: result.user,
        tokens: result.tokens
      });

    } catch (error) {
      console.error('Register controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Token yenileme
   */
  async refreshToken(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { refreshToken } = req.body;

      const result = await this.authService.refreshToken(refreshToken);

      if (!result.success) {
        return res.status(401).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        user: result.user,
        tokens: result.tokens
      });

    } catch (error) {
      console.error('Refresh token controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı profili
   */
  async profile(req, res) {
    try {
      // Kullanıcı bilgileri middleware'den geliyor
      const user = req.user;

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Profile controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Şifre değiştirme
   */
  async changePassword(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const result = await this.authService.changePassword(userId, currentPassword, newPassword);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Change password controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Çıkış (logout)
   * Client-side'da token'ı silmek yeterli, server-side blacklist implementasyonu opsiyonel
   */
  async logout(req, res) {
    try {
      // Basit logout - client token'ı silecek
      // İleride token blacklist implementasyonu eklenebilir
      
      res.json({
        success: true,
        message: 'Çıkış başarılı'
      });

    } catch (error) {
      console.error('Logout controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Token doğrulama
   */
  async verifyToken(req, res) {
    try {
      // Middleware'den gelen kullanıcı bilgileri
      const user = req.user;

      res.json({
        success: true,
        valid: true,
        user
      });

    } catch (error) {
      console.error('Verify token controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı menüsü
   */
  async getUserMenu(req, res) {
    try {
      const userId = req.user.id;
      
      // Permission Manager'dan menü al
      // Bu DynamicModuleSystem'den alınacak
      const menu = await req.app.locals.moduleSystem?.generateUserMenu(
        userId,
        req.user.allPermissions || [],
        req.user.roles || []
      ) || [];

      res.json({
        success: true,
        menu
      });

    } catch (error) {
      console.error('Get user menu controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı yetki özeti
   */
  async getUserPermissions(req, res) {
    try {
      const userId = req.user.id;
      
      // Permission Manager'dan yetki özeti al
      const permissionSummary = await req.app.locals.moduleSystem?.permissionManager?.getUserPermissionSummary(userId) || {
        totalPermissions: 0,
        permissions: [],
        accessibleModules: [],
        roles: []
      };

      res.json({
        success: true,
        permissions: permissionSummary
      });

    } catch (error) {
      console.error('Get user permissions controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Login validation rules
   */
  static getLoginValidation() {
    return [
      body('identifier')
        .notEmpty()
        .withMessage('Kullanıcı adı veya email gerekli')
        .isLength({ min: 3, max: 100 })
        .withMessage('Kullanıcı adı veya email 3-100 karakter arası olmalı'),
      
      body('password')
        .notEmpty()
        .withMessage('Şifre gerekli')
        .isLength({ min: 6 })
        .withMessage('Şifre en az 6 karakter olmalı')
    ];
  }

  /**
   * Register validation rules
   */
  static getRegisterValidation() {
    return [
      body('username')
        .notEmpty()
        .withMessage('Kullanıcı adı gerekli')
        .isLength({ min: 3, max: 50 })
        .withMessage('Kullanıcı adı 3-50 karakter arası olmalı')
        .isAlphanumeric()
        .withMessage('Kullanıcı adı sadece harf ve rakam içerebilir'),
      
      body('email')
        .notEmpty()
        .withMessage('Email gerekli')
        .isEmail()
        .withMessage('Geçerli bir email adresi girin')
        .normalizeEmail(),
      
      body('password')
        .notEmpty()
        .withMessage('Şifre gerekli')
        .isLength({ min: 6, max: 100 })
        .withMessage('Şifre 6-100 karakter arası olmalı')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermeli'),
      
      body('firstName')
        .notEmpty()
        .withMessage('Ad gerekli')
        .isLength({ min: 1, max: 50 })
        .withMessage('Ad 1-50 karakter arası olmalı')
        .trim(),
      
      body('lastName')
        .notEmpty()
        .withMessage('Soyad gerekli')
        .isLength({ min: 1, max: 50 })
        .withMessage('Soyad 1-50 karakter arası olmalı')
        .trim()
    ];
  }

  /**
   * Change password validation rules
   */
  static getChangePasswordValidation() {
    return [
      body('currentPassword')
        .notEmpty()
        .withMessage('Mevcut şifre gerekli'),
      
      body('newPassword')
        .notEmpty()
        .withMessage('Yeni şifre gerekli')
        .isLength({ min: 6, max: 100 })
        .withMessage('Yeni şifre 6-100 karakter arası olmalı')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Yeni şifre en az bir küçük harf, bir büyük harf ve bir rakam içermeli')
    ];
  }

  /**
   * Refresh token validation rules
   */
  static getRefreshTokenValidation() {
    return [
      body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token gerekli')
    ];
  }
}

module.exports = AuthController;