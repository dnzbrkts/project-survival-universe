/**
 * Kullanıcı Yönetimi Routes
 * User Management API Routes
 */

const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const userController = new UserController();

// Tüm route'lar için auth middleware
router.use(authMiddleware.authenticateToken());

/**
 * @route   GET /api/users
 * @desc    Kullanıcı listesi (filtreleme ve sayfalama ile)
 * @access  Private (user.list permission)
 */
router.get('/', 
  userController.getUsers.bind(userController)
);

/**
 * @route   GET /api/users/:id
 * @desc    Kullanıcı detayı
 * @access  Private (user.view permission)
 */
router.get('/:id', 
  userController.getUserById.bind(userController)
);

/**
 * @route   POST /api/users
 * @desc    Yeni kullanıcı oluşturma
 * @access  Private (user.create permission)
 */
router.post('/', 
  userController.createUser.bind(userController)
);

/**
 * @route   PUT /api/users/:id
 * @desc    Kullanıcı güncelleme
 * @access  Private (user.update permission)
 */
router.put('/:id', 
  userController.updateUser.bind(userController)
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Kullanıcı silme (soft delete)
 * @access  Private (user.delete permission)
 */
router.delete('/:id', 
  userController.deleteUser.bind(userController)
);

/**
 * @route   PUT /api/users/profile
 * @desc    Kullanıcı profil güncelleme (kendi profili)
 * @access  Private (authenticated user)
 */
router.put('/profile/update', 
  userController.updateProfile.bind(userController)
);

/**
 * @route   PUT /api/users/:id/roles
 * @desc    Kullanıcı rollerini güncelleme
 * @access  Private (user.manage_roles permission)
 */
router.put('/:id/roles', 
  userController.updateUserRoles.bind(userController)
);

/**
 * @route   PATCH /api/users/:id/toggle-status
 * @desc    Kullanıcı aktivasyon/deaktivasyon
 * @access  Private (user.toggle_status permission)
 */
router.patch('/:id/toggle-status', 
  userController.toggleUserStatus.bind(userController)
);

/**
 * @route   POST /api/users/:id/reset-password
 * @desc    Kullanıcı şifre sıfırlama (admin)
 * @access  Private (user.reset_password permission)
 */
router.post('/:id/reset-password', 
  userController.resetUserPassword.bind(userController)
);

module.exports = router;