/**
 * Kimlik Doğrulama Route'ları
 * Auth API endpoint'leri
 */

const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');
const { authRateLimitMiddleware } = require('../middleware');

const router = express.Router();
const authController = new AuthController();

/**
 * POST /api/auth/login
 * Kullanıcı girişi
 */
router.post('/login', 
  authRateLimitMiddleware, // Rate limiting
  authController.login.bind(authController)
);

/**
 * POST /api/auth/register
 * Kullanıcı kaydı
 */
router.post('/register',
  authRateLimitMiddleware, // Rate limiting
  authController.register.bind(authController)
);

/**
 * POST /api/auth/refresh
 * Token yenileme
 */
router.post('/refresh',
  authController.refreshToken.bind(authController)
);

/**
 * POST /api/auth/logout
 * Kullanıcı çıkışı
 */
router.post('/logout',
  authMiddleware.authenticateToken(), // Auth required
  authController.logout.bind(authController)
);

/**
 * GET /api/auth/profile
 * Kullanıcı profili
 */
router.get('/profile',
  authMiddleware.authenticateToken(), // Auth required
  authController.profile.bind(authController)
);

/**
 * POST /api/auth/change-password
 * Şifre değiştirme
 */
router.post('/change-password',
  authMiddleware.authenticateToken(), // Auth required
  authController.changePassword.bind(authController)
);

/**
 * GET /api/auth/verify
 * Token doğrulama
 */
router.get('/verify',
  authMiddleware.authenticateToken(), // Auth required
  authController.verifyToken.bind(authController)
);

/**
 * GET /api/auth/menu
 * Kullanıcı menüsü
 */
router.get('/menu',
  authMiddleware.authenticateToken(), // Auth required
  authController.getUserMenu.bind(authController)
);

/**
 * GET /api/auth/permissions
 * Kullanıcı yetkileri
 */
router.get('/permissions',
  authMiddleware.authenticateToken(), // Auth required
  authController.getUserPermissions.bind(authController)
);

module.exports = router;