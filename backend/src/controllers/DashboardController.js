const { Op } = require('sequelize')
const { 
  Product, 
  Customer, 
  Invoice, 
  ServiceRequest, 
  StockMovement,
  Payment,
  User,
  SystemModule,
  sequelize
} = require('../models')

class DashboardController {
  /**
   * Dashboard ana verilerini getir
   */
  async getDashboardData(req, res) {
    try {
      const [stats, recentActivities, quickAccess, criticalStock] = await Promise.all([
        this.getStats(),
        this.fetchRecentActivities(10),
        this.getQuickAccessItems(req.user),
        this.getCriticalStockItems()
      ])

      res.json({
        stats,
        recentActivities,
        quickAccess,
        criticalStockItems: criticalStock,
        upcomingTasks: [] // TODO: Implement upcoming tasks
      })
    } catch (error) {
      console.error('Dashboard data error:', error)
      res.status(500).json({
        success: false,
        message: 'Dashboard verileri yüklenirken hata oluştu',
        error: error.message
      })
    }
  }

  /**
   * Dashboard istatistiklerini getir
   */
  async getDashboardStats(req, res) {
    try {
      const stats = await this.getStats()
      res.json(stats)
    } catch (error) {
      console.error('Dashboard stats error:', error)
      res.status(500).json({
        success: false,
        message: 'İstatistikler yüklenirken hata oluştu',
        error: error.message
      })
    }
  }

  /**
   * Son aktiviteleri getir
   */
  async getRecentActivities(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10
      const activities = await this.fetchRecentActivities(limit)
      res.json(activities)
    } catch (error) {
      console.error('Recent activities error:', error)
      res.status(500).json({
        success: false,
        message: 'Son aktiviteler yüklenirken hata oluştu',
        error: error.message
      })
    }
  }

  /**
   * Hızlı erişim öğelerini getir
   */
  async getQuickAccessItems(req, res) {
    try {
      const items = await this.getQuickAccessItems(req.user)
      res.json(items)
    } catch (error) {
      console.error('Quick access error:', error)
      res.status(500).json({
        success: false,
        message: 'Hızlı erişim öğeleri yüklenirken hata oluştu',
        error: error.message
      })
    }
  }

  /**
   * Kritik stok öğelerini getir
   */
  async getCriticalStockItemsEndpoint(req, res) {
    try {
      const items = await this.getCriticalStockItems()
      res.json(items)
    } catch (error) {
      console.error('Critical stock error:', error)
      res.status(500).json({
        success: false,
        message: 'Kritik stok öğeleri yüklenirken hata oluştu',
        error: error.message
      })
    }
  }

  // Private helper methods

  /**
   * İstatistikleri hesapla
   */
  async getStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Paralel olarak tüm istatistikleri getir
    const [
      totalProducts,
      totalCustomers,
      monthlyInvoices,
      lastMonthInvoices,
      criticalStockCount,
      monthlyRevenue,
      lastMonthRevenue,
      pendingServices,
      completedServices
    ] = await Promise.all([
      // Toplam ürün sayısı
      Product.count({ where: { is_active: true } }),
      
      // Toplam müşteri sayısı
      Customer.count({ where: { is_active: true } }),
      
      // Bu ay fatura sayısı
      Invoice.count({
        where: {
          invoice_date: { [Op.gte]: startOfMonth },
          status: { [Op.ne]: 'cancelled' }
        }
      }),
      
      // Geçen ay fatura sayısı
      Invoice.count({
        where: {
          invoice_date: { 
            [Op.gte]: startOfLastMonth,
            [Op.lte]: endOfLastMonth
          },
          status: { [Op.ne]: 'cancelled' }
        }
      }),
      
      // Kritik stok sayısı
      sequelize.query(`
        SELECT COUNT(*) as count
        FROM (
          SELECT p.id
          FROM products p
          LEFT JOIN stock_movements sm ON p.id = sm.product_id
          WHERE p.is_active = true
          GROUP BY p.id, p.critical_stock_level
          HAVING COALESCE(SUM(
            CASE 
              WHEN sm.movement_type IN ('in', 'adjustment') THEN sm.quantity 
              WHEN sm.movement_type = 'out' THEN -sm.quantity 
              ELSE 0 
            END
          ), 0) <= p.critical_stock_level
        ) as critical_products
      `, { type: sequelize.QueryTypes.SELECT }),
      
      // Bu ay gelir
      Invoice.sum('total_amount', {
        where: {
          invoice_date: { [Op.gte]: startOfMonth },
          invoice_type: 'sales',
          status: { [Op.ne]: 'cancelled' }
        }
      }),
      
      // Geçen ay gelir
      Invoice.sum('total_amount', {
        where: {
          invoice_date: { 
            [Op.gte]: startOfLastMonth,
            [Op.lte]: endOfLastMonth
          },
          invoice_type: 'sales',
          status: { [Op.ne]: 'cancelled' }
        }
      }),
      
      // Bekleyen servis talepleri
      ServiceRequest.count({
        where: { status: { [Op.in]: ['pending', 'in_progress'] } }
      }),
      
      // Tamamlanan servis talepleri (bu ay)
      ServiceRequest.count({
        where: {
          status: 'completed',
          completed_at: { [Op.gte]: startOfMonth }
        }
      })
    ])

    return {
      totalProducts: totalProducts || 0,
      totalCustomers: totalCustomers || 0,
      monthlyInvoices: monthlyInvoices || 0,
      criticalStock: criticalStockCount[0]?.count || 0,
      totalRevenue: monthlyRevenue || 0,
      monthlyRevenue: monthlyRevenue || 0,
      pendingServices: pendingServices || 0,
      completedServices: completedServices || 0,
      // Değişim yüzdeleri
      invoiceChange: this.calculatePercentageChange(monthlyInvoices, lastMonthInvoices),
      revenueChange: this.calculatePercentageChange(monthlyRevenue, lastMonthRevenue)
    }
  }

  /**
   * Son aktiviteleri getir
   */
  async fetchRecentActivities(limit = 10) {
    // Geçici olarak boş array döndür
    return []
  }

  /**
   * Hızlı erişim öğelerini getir
   */
  async getQuickAccessItems(user) {
    // Kullanıcının erişebileceği modülleri getir
    const activeModules = await SystemModule.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC']]
    })

    const quickAccessItems = [
      {
        id: 'inventory',
        title: 'Stok Yönetimi',
        description: 'Ürün ve stok işlemleri',
        icon: 'inventory',
        path: '/modules/inventory',
        color: '#2196F3',
        moduleCode: 'INVENTORY'
      },
      {
        id: 'customers',
        title: 'Müşteri Yönetimi',
        description: 'Müşteri ve cari hesaplar',
        icon: 'people',
        path: '/modules/customers',
        color: '#4CAF50',
        moduleCode: 'CUSTOMERS'
      },
      {
        id: 'invoices',
        title: 'Fatura İşlemleri',
        description: 'Satış ve alış faturaları',
        icon: 'receipt',
        path: '/modules/invoices',
        color: '#FF9800',
        moduleCode: 'INVOICES'
      },
      {
        id: 'services',
        title: 'Servis Yönetimi',
        description: 'Servis talepleri ve takip',
        icon: 'build',
        path: '/modules/services',
        color: '#9C27B0',
        moduleCode: 'SERVICES'
      },
      {
        id: 'reports',
        title: 'Raporlar',
        description: 'Analitik ve raporlama',
        icon: 'assessment',
        path: '/modules/reports',
        color: '#607D8B',
        moduleCode: 'REPORTS'
      },
      {
        id: 'pos',
        title: 'POS Sistemi',
        description: 'Satış noktası işlemleri',
        icon: 'shopping_cart',
        path: '/modules/pos',
        color: '#E91E63',
        moduleCode: 'POS'
      }
    ]

    // Aktif modüllere göre filtrele
    const activeModuleCodes = activeModules.map(m => m.module_code)
    return quickAccessItems.filter(item => 
      !item.moduleCode || activeModuleCodes.includes(item.moduleCode)
    )
  }

  /**
   * Kritik stok öğelerini getir
   */
  async getCriticalStockItems() {
    const criticalItems = await sequelize.query(`
      SELECT 
        p.id,
        p.product_code,
        p.product_name,
        p.critical_stock_level,
        p.unit,
        COALESCE(SUM(
          CASE 
            WHEN sm.movement_type IN ('in', 'adjustment') THEN sm.quantity 
            WHEN sm.movement_type = 'out' THEN -sm.quantity 
            ELSE 0 
          END
        ), 0) as current_stock
      FROM products p
      LEFT JOIN stock_movements sm ON p.id = sm.product_id
      WHERE p.is_active = true
      GROUP BY p.id, p.product_code, p.product_name, p.critical_stock_level, p.unit
      HAVING COALESCE(SUM(
        CASE 
          WHEN sm.movement_type IN ('in', 'adjustment') THEN sm.quantity 
          WHEN sm.movement_type = 'out' THEN -sm.quantity 
          ELSE 0 
        END
      ), 0) <= p.critical_stock_level
      ORDER BY current_stock ASC
      LIMIT 20
    `, { type: sequelize.QueryTypes.SELECT })

    return criticalItems.map(item => ({
      id: item.id,
      productCode: item.product_code,
      productName: item.product_name,
      currentStock: parseInt(item.current_stock),
      criticalLevel: item.critical_stock_level,
      unit: item.unit
    }))
  }

  /**
   * Yüzdelik değişim hesapla
   */
  calculatePercentageChange(current, previous) {
    if (!previous || previous === 0) {
      return current > 0 ? 100 : 0
    }
    return Math.round(((current - previous) / previous) * 100)
  }
}

module.exports = new DashboardController()