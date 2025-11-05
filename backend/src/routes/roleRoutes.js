/**
 * Rol Yönetimi Routes
 * Role Management API Routes
 */

const express = require('express');
const RoleController = require('../controllers/RoleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const roleController = new RoleController();

// Tüm route'lar için auth middleware
router.use(authMiddleware.authenticateToken());

/**
 * @route   GET /api/roles
 * @desc    Rol listesi (filtreleme ve sayfalama ile)
 * @access  Private (role.list permission)
 */
router.get('/', 
  roleController.getRoles.bind(roleController)
);

/**
 * @route   GET /api/roles/active
 * @desc    Aktif roller listesi (dropdown için)
 * @access  Private (role.list permission)
 */
router.get('/active', 
  roleController.getActiveRoles.bind(roleController)
);

/**
 * @route   GET /api/roles/:id
 * @desc    Rol detayı
 * @access  Private (role.view permission)
 */
router.get('/:id', 
  roleController.getRoleById.bind(roleController)
);

/**
 * @route   POST /api/roles
 * @desc    Yeni rol oluşturma
 * @access  Private (role.create permission)
 */
router.post('/', 
  roleController.createRole.bind(roleController)
);

/**
 * @route   PUT /api/roles/:id
 * @desc    Rol güncelleme
 * @access  Private (role.update permission)
 */
router.put('/:id', 
  roleController.updateRole.bind(roleController)
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Rol silme
 * @access  Private (role.delete permission)
 */
router.delete('/:id', 
  roleController.deleteRole.bind(roleController)
);

/**
 * @route   PUT /api/roles/:id/permissions
 * @desc    Rol yetkilerini güncelleme
 * @access  Private (role.manage_permissions permission)
 */
router.put('/:id/permissions', 
  roleController.updateRolePermissions.bind(roleController)
);

/**
 * @route   PATCH /api/roles/:id/toggle-status
 * @desc    Rol aktivasyon/deaktivasyon
 * @access  Private (role.toggle_status permission)
 */
router.patch('/:id/toggle-status', 
  roleController.toggleRoleStatus.bind(roleController)
);

/**
 * @route   GET /api/roles/:id/users
 * @desc    Rol kullanıcıları listesi
 * @access  Private (role.view_users permission)
 */
router.get('/:id/users', 
  roleController.getRoleUsers.bind(roleController)
);

/**
 * @route   GET /api/roles/:id/permissions
 * @desc    Rol yetkilerini görüntüleme
 * @access  Private (role.view_permissions permission)
 */
router.get('/:id/permissions', 
  roleController.getRolePermissions.bind(roleController)
);

module.exports = router;