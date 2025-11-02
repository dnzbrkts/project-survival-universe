/**
 * Kullanıcı Yönetimi Controller
 * User Management API endpoint'leri
 */

const { body, query, validationResult } = require('express-validator');
const UserService = require('../services/UserService');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Kullanıcı listesi (filtreleme ve sayfalama ile)
   */
  async getUsers(req, res) {
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

      const filters = {
        search: req.query.search,
        isActive: req.query.isActive,
        roleId: req.query.roleId,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.userService.getUsers(filters);

      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get users controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı detayı
   */
  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: 'Geçersiz kullanıcı ID',
          code: 'INVALID_USER_ID'
        });
      }

      const result = await this.userService.getUserById(userId);

      if (!result.success) {
        return res.status(404).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        data: result.user
      });

    } catch (error) {
      console.error('Get user by id controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Yeni kullanıcı oluşturma
   */
  async createUser(req, res) {
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

      const result = await this.userService.createUser(userData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.user
      });

    } catch (error) {
      console.error('Create user controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı güncelleme
   */
  async updateUser(req, res) {
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

      const userId = parseInt(req.params.id);
      const updateData = req.body;

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: 'Geçersiz kullanıcı ID',
          code: 'INVALID_USER_ID'
        });
      }

      const result = await this.userService.updateUser(userId, updateData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });

    } catch (error) {
      console.error('Update user controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı silme (soft delete)
   */
  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: 'Geçersiz kullanıcı ID',
          code: 'INVALID_USER_ID'
        });
      }

      const result = await this.userService.deleteUser(userId);

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
      console.error('Delete user controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı profil güncelleme
   */
  async updateProfile(req, res) {
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

      const userId = req.user.id; // Auth middleware'den gelen kullanıcı
      const profileData = req.body;

      const result = await this.userService.updateProfile(userId, profileData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });

    } catch (error) {
      console.error('Update profile controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı rollerini güncelleme
   */
  async updateUserRoles(req, res) {
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

      const userId = parseInt(req.params.id);
      const { roleIds } = req.body;

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: 'Geçersiz kullanıcı ID',
          code: 'INVALID_USER_ID'
        });
      }

      const result = await this.userService.updateUserRoles(userId, roleIds);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });

    } catch (error) {
      console.error('Update user roles controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı aktivasyon/deaktivasyon
   */
  async toggleUserStatus(req, res) {
    try {
      const userId = parseInt(req.params.id);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: 'Geçersiz kullanıcı ID',
          code: 'INVALID_USER_ID'
        });
      }

      const result = await this.userService.toggleUserStatus(userId);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });

    } catch (error) {
      console.error('Toggle user status controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kullanıcı şifre sıfırlama (admin)
   */
  async resetUserPassword(req, res) {
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

      const userId = parseInt(req.params.id);
      const { newPassword } = req.body;

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: 'Geçersiz kullanıcı ID',
          code: 'INVALID_USER_ID'
        });
      }

      const result = await this.userService.resetUserPassword(userId, newPassword);

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
      console.error('Reset user password controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // Validation Rules

  /**
   * Kullanıcı listesi filtreleme validation rules
   */
  static getUsersValidation() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Sayfa numarası pozitif bir sayı olmalı'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit 1-100 arası olmalı'),
      
      query('search')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Arama terimi 2-100 karakter arası olmalı'),
      
      query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive boolean değer olmalı'),
      
      query('roleId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Rol ID pozitif bir sayı olmalı')
    ];
  }

  /**
   * Kullanıcı oluşturma validation rules
   */
  static getCreateUserValidation() {
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
        .trim(),
      
      body('roleIds')
        .optional()
        .isArray()
        .withMessage('Roller dizi formatında olmalı')
        .custom((roleIds) => {
          if (roleIds && roleIds.length > 0) {
            return roleIds.every(id => Number.isInteger(id) && id > 0);
          }
          return true;
        })
        .withMessage('Rol ID\'leri pozitif sayılar olmalı')
    ];
  }

  /**
   * Kullanıcı güncelleme validation rules
   */
  static getUpdateUserValidation() {
    return [
      body('username')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('Kullanıcı adı 3-50 karakter arası olmalı')
        .isAlphanumeric()
        .withMessage('Kullanıcı adı sadece harf ve rakam içerebilir'),
      
      body('email')
        .optional()
        .isEmail()
        .withMessage('Geçerli bir email adresi girin')
        .normalizeEmail(),
      
      body('firstName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Ad 1-50 karakter arası olmalı')
        .trim(),
      
      body('lastName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Soyad 1-50 karakter arası olmalı')
        .trim()
    ];
  }

  /**
   * Profil güncelleme validation rules
   */
  static getUpdateProfileValidation() {
    return [
      body('firstName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Ad 1-50 karakter arası olmalı')
        .trim(),
      
      body('lastName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Soyad 1-50 karakter arası olmalı')
        .trim(),
      
      body('email')
        .optional()
        .isEmail()
        .withMessage('Geçerli bir email adresi girin')
        .normalizeEmail()
    ];
  }

  /**
   * Kullanıcı rolleri güncelleme validation rules
   */
  static getUpdateUserRolesValidation() {
    return [
      body('roleIds')
        .isArray()
        .withMessage('Roller dizi formatında olmalı')
        .custom((roleIds) => {
          return roleIds.every(id => Number.isInteger(id) && id > 0);
        })
        .withMessage('Rol ID\'leri pozitif sayılar olmalı')
    ];
  }

  /**
   * Şifre sıfırlama validation rules
   */
  static getResetPasswordValidation() {
    return [
      body('newPassword')
        .notEmpty()
        .withMessage('Yeni şifre gerekli')
        .isLength({ min: 6, max: 100 })
        .withMessage('Yeni şifre 6-100 karakter arası olmalı')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Yeni şifre en az bir küçük harf, bir büyük harf ve bir rakam içermeli')
    ];
  }
}

module.exports = UserController;