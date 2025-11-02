/**
 * Stok Yönetimi Modülü
 * Inventory Management Module Definition
 */

const InventoryController = require('../../controllers/InventoryController');
const InventoryService = require('../../services/InventoryService');

/**
 * Stok Yönetimi Modül Tanımı
 */
const InventoryModule = {
  code: 'INVENTORY',
  name: 'Stok Yönetimi',
  version: '1.0.0',
  category: 'OPERASYON',
  icon: 'inventory_2',
  color: '#2196F3',
  description: 'Ürün ve stok yönetimi, kategori organizasyonu, stok hareketleri takibi',
  
  dependencies: ['AUTH', 'SYSTEM'],
  
  permissions: [
    'stok.urun.liste',
    'stok.urun.detay',
    'stok.urun.ekle',
    'stok.urun.duzenle',
    'stok.urun.sil',
    'stok.kategori.liste',
    'stok.kategori.detay',
    'stok.kategori.ekle',
    'stok.kategori.duzenle',
    'stok.kategori.sil',
    'stok.hareket.liste',
    'stok.hareket.detay',
    'stok.hareket.ekle',
    'stok.hareket.duzenle',
    'stok.seviye.goruntule',
    'stok.uyari.goruntule',
    'stok.rapor.goruntule',
    'stok.rapor.export',
    'stok.ozet.goruntule'
  ],
  
  routes: [
    {
      path: '/inventory',
      routeFile: '../../routes/inventoryRoutes',
      description: 'Stok yönetimi API endpoint\'leri'
    }
  ],
  menuItems: [
    {
      title: 'Stok Yönetimi',
      path: '/inventory',
      permission: 'stok.ozet.goruntule',
      icon: 'inventory_2',
      order: 1,
      children: [
        {
          title: 'Ürünler',
          path: '/inventory/products',
          permission: 'stok.urun.liste',
          icon: 'category',
          order: 1
        },
        {
          title: 'Kategoriler',
          path: '/inventory/categories',
          permission: 'stok.kategori.liste',
          icon: 'folder',
          order: 2
        },
        {
          title: 'Stok Hareketleri',
          path: '/inventory/movements',
          permission: 'stok.hareket.liste',
          icon: 'swap_horiz',
          order: 3
        },
        {
          title: 'Stok Seviyeleri',
          path: '/inventory/stock-levels',
          permission: 'stok.seviye.goruntule',
          icon: 'assessment',
          order: 4
        },
        {
          title: 'Kritik Stok Uyarıları',
          path: '/inventory/critical-alerts',
          permission: 'stok.uyari.goruntule',
          icon: 'warning',
          order: 5
        },
        {
          title: 'Stok Raporları',
          path: '/inventory/reports',
          permission: 'stok.rapor.goruntule',
          icon: 'analytics',
          order: 6
        }
      ]
    }
  ],
  
  dashboardWidgets: [
    {
      id: 'inventory-summary',
      title: 'Stok Özeti',
      component: 'InventorySummaryWidget',
      permission: 'stok.ozet.goruntule',
      size: 'medium',
      order: 1,
      refreshInterval: 300000,
      apiEndpoint: '/api/inventory/dashboard/summary'
    },
    {
      id: 'critical-stock-alerts',
      title: 'Kritik Stok Uyarıları',
      component: 'CriticalStockWidget',
      permission: 'stok.uyari.goruntule',
      size: 'small',
      order: 2,
      refreshInterval: 60000,
      apiEndpoint: '/api/inventory/critical-alerts'
    },
    {
      id: 'recent-stock-movements',
      title: 'Son Stok Hareketleri',
      component: 'RecentMovementsWidget',
      permission: 'stok.hareket.liste',
      size: 'large',
      order: 3,
      refreshInterval: 120000,
      apiEndpoint: '/api/inventory/movements?limit=10'
    }
  ],
  
  config: {
    defaults: {
      defaultCurrency: 'TRY',
      criticalStockThreshold: 10,
      autoGenerateProductCode: true,
      productCodePrefix: 'PRD',
      enableBarcodeIntegration: true,
      stockMovementApprovalRequired: false,
      enableStockAlerts: true,
      alertCheckInterval: 3600000,
      reportFormats: ['json', 'excel', 'pdf'],
      maxProductsPerPage: 50,
      maxMovementsPerPage: 100
    },
    
    schema: {
      defaultCurrency: {
        type: 'string',
        enum: ['TRY', 'USD', 'EUR'],
        description: 'Varsayılan para birimi'
      },
      criticalStockThreshold: {
        type: 'number',
        min: 0,
        description: 'Genel kritik stok eşiği'
      },
      autoGenerateProductCode: {
        type: 'boolean',
        description: 'Otomatik ürün kodu oluşturma'
      },
      productCodePrefix: {
        type: 'string',
        maxLength: 10,
        description: 'Ürün kodu öneki'
      },
      enableBarcodeIntegration: {
        type: 'boolean',
        description: 'Barkod entegrasyonu aktif mi?'
      },
      stockMovementApprovalRequired: {
        type: 'boolean',
        description: 'Stok hareketleri onay gerektiriyor mu?'
      },
      enableStockAlerts: {
        type: 'boolean',
        description: 'Stok uyarıları aktif mi?'
      },
      alertCheckInterval: {
        type: 'number',
        min: 60000,
        description: 'Uyarı kontrol aralığı (ms)'
      }
    }
  },
  
  services: {
    InventoryService: InventoryService
  },
  
  controllers: {
    InventoryController: InventoryController
  },
  async initialize(moduleSystem) {
    console.log('Stok Yönetimi modülü başlatılıyor...');
    
    try {
      const inventoryService = new InventoryService();
      moduleSystem.registerService('inventory', inventoryService);
      
      if (this.config.defaults.enableStockAlerts) {
        this.startCriticalStockMonitoring(inventoryService);
      }
      
      console.log('Stok Yönetimi modülü başarıyla başlatıldı');
      
      return {
        success: true,
        message: 'Stok Yönetimi modülü aktif',
        services: ['InventoryService'],
        routes: ['/api/inventory'],
        permissions: this.permissions.length
      };
      
    } catch (error) {
      console.error('Stok Yönetimi modülü başlatma hatası:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  async shutdown(moduleSystem) {
    console.log('Stok Yönetimi modülü kapatılıyor...');
    
    try {
      if (this.criticalStockInterval) {
        clearInterval(this.criticalStockInterval);
        this.criticalStockInterval = null;
      }
      
      moduleSystem.unregisterService('inventory');
      
      console.log('Stok Yönetimi modülü kapatıldı');
      
      return {
        success: true,
        message: 'Stok Yönetimi modülü deaktif'
      };
      
    } catch (error) {
      console.error('Stok Yönetimi modülü kapatma hatası:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  startCriticalStockMonitoring(inventoryService) {
    const checkInterval = this.config.defaults.alertCheckInterval;
    
    this.criticalStockInterval = setInterval(async () => {
      try {
        const alerts = await inventoryService.getCriticalStockAlerts();
        
        if (alerts.count > 0) {
          console.log(`Kritik stok uyarısı: ${alerts.count} ürün kritik seviyede`);
        }
        
      } catch (error) {
        console.error('Kritik stok kontrolü hatası:', error);
      }
    }, checkInterval);
    
    console.log(`Kritik stok izleme başlatıldı (${checkInterval}ms aralıklarla)`);
  },

  async healthCheck() {
    try {
      const inventoryService = new InventoryService();
      
      const [
        productCount,
        categoryCount,
        recentMovements
      ] = await Promise.all([
        inventoryService.getProducts({ limit: 1 }),
        inventoryService.getCategories({ limit: 1 }),
        inventoryService.getStockMovements({ limit: 1 })
      ]);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        metrics: {
          totalProducts: productCount.pagination.total,
          totalCategories: categoryCount.pagination.total,
          recentMovementsCount: recentMovements.pagination.total
        },
        services: {
          InventoryService: 'active'
        }
      };
      
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          InventoryService: 'error'
        }
      };
    }
  }
};

module.exports = InventoryModule;