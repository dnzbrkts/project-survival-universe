const express = require('express')
const router = express.Router()
const DashboardController = require('../controllers/DashboardController')
const { authMiddleware } = require('../middleware')

// Dashboard ana verileri
router.get('/', authMiddleware.authenticateToken(), DashboardController.getDashboardData.bind(DashboardController))

// Dashboard istatistikleri
router.get('/stats', authMiddleware.authenticateToken(), DashboardController.getDashboardStats.bind(DashboardController))

// Son aktiviteler
router.get('/activities', authMiddleware.authenticateToken(), DashboardController.getRecentActivities.bind(DashboardController))

// Hızlı erişim öğeleri
router.get('/quick-access', authMiddleware.authenticateToken(), DashboardController.getQuickAccessItems.bind(DashboardController))

// Kritik stok öğeleri
router.get('/critical-stock', authMiddleware.authenticateToken(), DashboardController.getCriticalStockItemsEndpoint.bind(DashboardController))

module.exports = router