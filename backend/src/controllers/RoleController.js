/**
 * Rol Yönetimi Controller
 * Role Management API endpoint'leri
 */

const { body, query, validationResult } = require('express-validator');
const RoleService = require('../services/RoleService');

class RoleController {
  constructor() {
    this.roleService = new RoleService();
  }

  /**
   * Rol listesi (filtreleme ve sayfalama ile)
   */
  async getRoles(req, res) {
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
        isSystemRole: req.query.isSystemRole,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.roleService.getRoles(filters);

      res.json({
        success: true,
        data: result.roles,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get roles controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Aktif roller listesi (dropdown için)
   */
  async getActiveRoles(req, res) {
    try {
      const result = await this.roleService.getActiveRoles();

      res.json({
        success: true,
        data: result.roles
      });

    } catch (error) {
      console.error('Get active roles controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Rol detayı
   */
  async getRoleById(req, res) {
    try {
      const roleId = parseInt(req.params.id);

      if (!roleId || isNaN(roleId)) {
        return res.status(400).json({
          error: 'Geçersiz rol ID',
          code: 'INVALID_ROLE_ID'
        });
      }

      const result = await this.roleService.getRoleById(roleId);

      if (!result.success) {
        return res.status(404).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        data: result.role
      });

    } catch (error) {
      console.error('Get role by id controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Yeni rol oluşturma
   */
  async createRole(req, res) {
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

      const roleData = req.body;

      const result = await this.roleService.createRole(roleData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.role
      });

    } catch (error) {
      console.error('Create role controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Rol güncelleme
   */
  async updateRole(req, res) {
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

      const roleId = parseInt(req.params.id);
      const updateData = req.body;

      if (!roleId || isNaN(roleId)) {
        return res.status(400).json({
          error: 'Geçersiz rol ID',
          code: 'INVALID_ROLE_ID'
        });
      }

      const result = await this.roleService.updateRole(roleId, updateData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.role
      });

    } catch (error) {
      console.error('Update role controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Rol silme
   */
  async deleteRole(req, res) {
    try {
      const roleId = parseInt(req.params.id);

      if (!roleId || isNaN(roleId)) {
        return res.status(400).json({
          error: 'Geçersiz rol ID',
          code: 'INVALID_ROLE_ID'
        });
      }

      const result = await this.roleService.deleteRole(roleId);

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
      console.error('Delete role controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Rol yetkilerini güncelleme
   */
  async updateRolePermissions(req, res) {
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

      const roleId = parseInt(req.params.id);
      const { permissionIds } = req.body;

      if (!roleId || isNaN(roleId)) {
        return res.status(400).json({
          error: 'Geçersiz rol ID',
          code: 'INVALID_ROLE_ID'
        });
      }

      const result = await this.roleService.updateRolePermissions(roleId, permissionIds);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.role
      });

    } catch (error) {
      console.error('Update role permissions controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Rol aktivasyon/deaktivasyon
   */
  async toggleRoleStatus(req, res) {
    try {
      const roleId = parseInt(req.params.id);

      if (!roleId || isNaN(roleId)) {
        return res.status(400).json({
          error: 'Geçersiz rol ID',
          code: 'INVALID_ROLE_ID'
        });
      }

      const result = await this.roleService.toggleRoleStatus(roleId);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.role
      });

    } catch (error) {
      console.error('Toggle role status controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Rol kullanıcıları listesi
   */
  async getRoleUsers(req, res) {
    try {
      const roleId = parseInt(req.params.id);

      if (!roleId || isNaN(roleId)) {
        return res.status(400).json({
          error: 'Geçersiz rol ID',
          code: 'INVALID_ROLE_ID'
        });
      }

      const result = await this.roleService.getRoleUsers(roleId);

      if (!result.success) {
        return res.status(404).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        data: result.users
      });

    } catch (error) {
      console.error('Get role users controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Rol yetkilerini görüntüleme
   */
  async getRolePermissions(req, res) {
    try {
      const roleId = parseInt(req.params.id);

      if (!roleId || isNaN(roleId)) {
        return res.status(400).json({
          error: 'Geçersiz rol ID',
          code: 'INVALID_ROLE_ID'
        });
      }

      const result = await this.roleService.getRolePermissions(roleId);

      if (!result.success) {
        return res.status(404).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        data: result.permissions
      });

    } catch (error) {
      console.error('Get role permissions controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // Validation Rules

  /**
   * Rol listesi filtreleme validation rules
   */
  static getRolesValidation() {
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
      
      query('isSystemRole')
        .optional()
        .isBoolean()
        .withMessage('isSystemRole boolean değer olmalı')
    ];
  }

  /**
   * Rol oluşturma validation rules
   */
  static getCreateRoleValidation() {
    return [
      body('roleCode')
        .notEmpty()
        .withMessage('Rol kodu gerekli')
        .isLength({ min: 2, max: 50 })
        .withMessage('Rol kodu 2-50 karakter arası olmalı')
        .matches(/^[A-Z_]+$/)
        .withMessage('Rol kodu sadece büyük harf ve alt çizgi içerebilir'),
      
      body('roleName')
        .notEmpty()
        .withMessage('Rol adı gerekli')
        .isLength({ min: 2, max: 100 })
        .withMessage('Rol adı 2-100 karakter arası olmalı')
        .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Açıklama en fazla 500 karakter olabilir')
        .trim(),
      
      body('permissionIds')
        .optional()
        .isArray()
        .withMessage('Yetkiler dizi formatında olmalı')
        .custom((permissionIds) => {
          if (permissionIds && permissionIds.length > 0) {
            return permissionIds.every(id => Number.isInteger(id) && id > 0);
          }
          return true;
        })
        .withMessage('Yetki ID\'leri pozitif sayılar olmalı')
    ];
  }

  /**
   * Rol güncelleme validation rules
   */
  static getUpdateRoleValidation() {
    return [
      body('roleName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Rol adı 2-100 karakter arası olmalı')
        .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Açıklama en fazla 500 karakter olabilir')
        .trim()
    ];
  }

  /**
   * Rol yetkilerini güncelleme validation rules
   */
  static getUpdateRolePermissionsValidation() {
    return [
      body('permissionIds')
        .isArray()
        .withMessage('Yetkiler dizi formatında olmalı')
        .custom((permissionIds) => {
          return permissionIds.every(id => Number.isInteger(id) && id > 0);
        })
        .withMessage('Yetki ID\'leri pozitif sayılar olmalı')
    ];
  }
}

module.exports = RoleController;