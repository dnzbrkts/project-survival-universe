const express = require('express')
const router = express.Router()
const DashboardController = require('../controllers/DashboardController')
const { authMiddleware } = require('../middleware')

// Dashboard ana verileri
router.get('/', authMiddleware, DashboardController.getDashboardData)

// Dashboard istatistikleri
router.get('/stats', authMiddleware, DashboardController.getDashboardStats)

// Son aktiviteler
router.get('/activities', authMiddleware, DashboardController.getRecentActivities)

// Hızlı erişim öğeleri
router.get('/quick-access', authMiddleware, DashboardController.getQuickAccessItems)

// Kritik stok öğeleri
router.get('/critical-stock', authMiddleware, DashboardController.getCriticalStockItemsEndpoint)

module.exports = router