/**
 * Cari Hesap Yönetimi Modülü
 * Customer Account Management Module Definition
 */

const CustomerController = require('../../controllers/CustomerController');
const CustomerService = require('../../services/CustomerService');

/**
 * Cari Hesap Yönetimi Modül Tanımı
 */
const CustomerModule = {
  code: 'CUSTOMER',
  name: 'Cari Hesap Yönetimi',
  version: '1.0.0',
  category: 'FINANS',
  icon: 'account_balance',
  color: '#4CAF50',
  description: 'Müşteri ve tedarikçi hesap yönetimi, bakiye takibi, vadeli alacak yönetimi',
  
  dependencies: ['AUTH', 'SYSTEM'],
  
  permissions: [
    'cari.liste',
    'cari.detay',
    'cari.ekle',
    'cari.duzenle',
    'cari.sil',
    'cari.bakiye.goruntule',
    'cari.ekstre.goruntule',
    'cari.vadeli.alacak.goruntule',
    'cari.rapor.goruntule',
    'cari.rapor.export',
    'cari.ozet.goruntule',
    'cari.kredi.limit.yonet',
    'cari.odeme.vade.yonet'
  ],
  
  routes: [
    {
      path: '/customers',
      routeFile: '../../routes/customerRoutes',
      description: 'Cari hesap yönetimi API endpoint\'leri'
    }
  ],
  
  menuItems: [
    {
      title: 'Cari Hesap Yönetimi',
      path: '/customers',
      permission: 'cari.ozet.goruntule',
      icon: 'account_balance',
      order: 1,
      children: [
        {
          title: 'Müşteriler',
          path: '/customers/list?type=customer',
          permission: 'cari.liste',
          icon: 'people',
          order: 1
        },
        {
          title: 'Tedarikçiler',
          path: '/customers/list?type=supplier',
          permission: 'cari.liste',
          icon: 'business',
          order: 2
        },
        {
          title: 'Tüm Cari Hesaplar',
          path: '/customers/list',
          permission: 'cari.liste',
          icon: 'list',
          order: 3
        },
        {
          title: 'Bakiye Durumu',
          path: '/customers/balances',
          permission: 'cari.bakiye.goruntule',
          icon: 'account_balance_wallet',
          order: 4
        },
        {
          title: 'Vadesi Geçen Alacaklar',
          path: '/customers/overdue',
          permission: 'cari.vadeli.alacak.goruntule',
          icon: 'schedule',
          order: 5
        },
        {
          title: 'Cari Hesap Raporları',
          path: '/customers/reports',
          permission: 'cari.rapor.goruntule',
          icon: 'analytics',
          order: 6
        }
      ]
    }
  ],
  
  dashboardWidgets: [
    {
      id: 'customer-summary',
      title: 'Cari Hesap Özeti',
      component: 'CustomerSummaryWidget',
      permission: 'cari.ozet.goruntule',
      size: 'medium',
      order: 1,
      refreshInterval: 300000, // 5 dakika
      apiEndpoint: '/api/customers/dashboard/summary'
    },
    {
      id: 'overdue-receivables',
      title: 'Vadesi Geçen Alacaklar',
      component: 'OverdueReceivablesWidget',
      permission: 'cari.vadeli.alacak.goruntule',
      size: 'medium',
      order: 2,
      refreshInterval: 600000, // 10 dakika
      apiEndpoint: '/api/customers/overdue/receivables?limit=5'
    },
    {
      id: 'credit-limit-alerts',
      title: 'Kredi Limiti Uyarıları',
      component: 'CreditLimitAlertsWidget',
      permission: 'cari.kredi.limit.yonet',
      size: 'small',
      order: 3,
      refreshInterval: 900000, // 15 dakika
      apiEndpoint: '/api/customers/credit-limit-alerts'
    },
    {
      id: 'recent-customers',
      title: 'Son Eklenen Müşteriler',
      component: 'RecentCustomersWidget',
      permission: 'cari.liste',
      size: 'large',
      order: 4,
      refreshInterval: 1800000, // 30 dakika
      apiEndpoint: '/api/customers?limit=10&sort_by=created_at&sort_order=DESC'
    }
  ],
  
  config: {
    defaults: {
      defaultCurrency: 'TRY',
      autoGenerateCustomerCode: true,
      customerCodePrefix: 'CUS',
      supplierCodePrefix: 'SUP',
      defaultPaymentTerms: 30,
      defaultCreditLimit: 0,
      enableCreditLimitCheck: true,
      enableOverdueAlerts: true,
      overdueAlertDays: [7, 15, 30, 60],
      statementDefaultPeriod: 90, // gün
      balanceCalculationMethod: 'real_time', // 'real_time' veya 'cached'
      cacheBalanceInterval: 3600000, // 1 saat
      reportFormats: ['json', 'excel', 'pdf'],
      maxCustomersPerPage: 50,
      maxTransactionsPerStatement: 1000
    },
    
    schema: {
      defaultCurrency: {
        type: 'string',
        enum: ['TRY', 'USD', 'EUR'],
        description: 'Varsayılan para birimi'
      },
      autoGenerateCustomerCode: {
        type: 'boolean',
        description: 'Otomatik müşteri kodu oluşturma'
      },
      customerCodePrefix: {
        type: 'string',
        maxLength: 10,
        description: 'Müşteri kodu öneki'
      },
      supplierCodePrefix: {
        type: 'string',
        maxLength: 10,
        description: 'Tedarikçi kodu öneki'
      },
      defaultPaymentTerms: {
        type: 'number',
        min: 0,
        description: 'Varsayılan ödeme vadesi (gün)'
      },
      defaultCreditLimit: {
        type: 'number',
        min: 0,
        description: 'Varsayılan kredi limiti'
      },
      enableCreditLimitCheck: {
        type: 'boolean',
        description: 'Kredi limiti kontrolü aktif mi?'
      },
      enableOverdueAlerts: {
        type: 'boolean',
        description: 'Vade aşım uyarıları aktif mi?'
      },
      statementDefaultPeriod: {
        type: 'number',
        min: 1,
        description: 'Ekstre varsayılan dönem (gün)'
      },
      balanceCalculationMethod: {
        type: 'string',
        enum: ['real_time', 'cached'],
        description: 'Bakiye hesaplama yöntemi'
      }
    }
  },
  
  services: {
    CustomerService: CustomerService
  },
  
  controllers: {
    CustomerController: CustomerController
  },

  async initialize(moduleSystem) {
    console.log('Cari Hesap Yönetimi modülü başlatılıyor...');
    
    try {
      const customerService = new CustomerService();
      moduleSystem.registerService('customer', customerService);
      
      // Kredi limiti kontrolü aktifse monitoring başlat
      if (this.config.defaults.enableCreditLimitCheck) {
        this.startCreditLimitMonitoring(customerService);
      }
      
      // Vade aşım uyarıları aktifse monitoring başlat
      if (this.config.defaults.enableOverdueAlerts) {
        this.startOverdueMonitoring(customerService);
      }
      
      // Bakiye cache sistemi aktifse başlat
      if (this.config.defaults.balanceCalculationMethod === 'cached') {
        this.startBalanceCaching(customerService);
      }
      
      console.log('Cari Hesap Yönetimi modülü başarıyla başlatıldı');
      
      return {
        success: true,
        message: 'Cari Hesap Yönetimi modülü aktif',
        services: ['CustomerService'],
        routes: ['/api/customers'],
        permissions: this.permissions.length
      };
      
    } catch (error) {
      console.error('Cari Hesap Yönetimi modülü başlatma hatası:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  async shutdown(moduleSystem) {
    console.log('Cari Hesap Yönetimi modülü kapatılıyor...');
    
    try {
      // Monitoring interval'larını temizle
      if (this.creditLimitInterval) {
        clearInterval(this.creditLimitInterval);
        this.creditLimitInterval = null;
      }
      
      if (this.overdueInterval) {
        clearInterval(this.overdueInterval);
        this.overdueInterval = null;
      }
      
      if (this.balanceCacheInterval) {
        clearInterval(this.balanceCacheInterval);
        this.balanceCacheInterval = null;
      }
      
      moduleSystem.unregisterService('customer');
      
      console.log('Cari Hesap Yönetimi modülü kapatıldı');
      
      return {
        success: true,
        message: 'Cari Hesap Yönetimi modülü deaktif'
      };
      
    } catch (error) {
      console.error('Cari Hesap Yönetimi modülü kapatma hatası:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  startCreditLimitMonitoring(customerService) {
    const checkInterval = 3600000; // 1 saat
    
    this.creditLimitInterval = setInterval(async () => {
      try {
        const overLimitCount = await customerService.getCustomersOverCreditLimit();
        
        if (overLimitCount > 0) {
          console.log(`Kredi limiti uyarısı: ${overLimitCount} müşteri kredi limitini aşmış`);
          // Burada notification servisi çağrılabilir
        }
        
      } catch (error) {
        console.error('Kredi limiti kontrolü hatası:', error);
      }
    }, checkInterval);
    
    console.log(`Kredi limiti izleme başlatıldı (${checkInterval}ms aralıklarla)`);
  },

  startOverdueMonitoring(customerService) {
    const checkInterval = 86400000; // 24 saat
    
    this.overdueInterval = setInterval(async () => {
      try {
        const overdueResult = await customerService.getOverdueReceivables({ limit: 1 });
        
        if (overdueResult.pagination.total > 0) {
          console.log(`Vade aşım uyarısı: ${overdueResult.pagination.total} vadesi geçmiş fatura`);
          // Burada notification servisi çağrılabilir
        }
        
      } catch (error) {
        console.error('Vade aşım kontrolü hatası:', error);
      }
    }, checkInterval);
    
    console.log(`Vade aşım izleme başlatıldı (${checkInterval}ms aralıklarla)`);
  },

  startBalanceCaching(customerService) {
    const cacheInterval = this.config.defaults.cacheBalanceInterval;
    
    this.balanceCacheInterval = setInterval(async () => {
      try {
        console.log('Müşteri bakiyeleri cache\'leniyor...');
        // Burada bakiye cache işlemi yapılabilir
        // Redis veya başka bir cache sistemi kullanılabilir
        
      } catch (error) {
        console.error('Bakiye cache hatası:', error);
      }
    }, cacheInterval);
    
    console.log(`Bakiye cache sistemi başlatıldı (${cacheInterval}ms aralıklarla)`);
  },

  async healthCheck() {
    try {
      const customerService = new CustomerService();
      
      const [
        customerCount,
        supplierCount,
        statistics
      ] = await Promise.all([
        customerService.getCustomers({ customer_type: 'customer', limit: 1 }),
        customerService.getCustomers({ customer_type: 'supplier', limit: 1 }),
        customerService.getCustomerStatistics()
      ]);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        metrics: {
          totalCustomers: customerCount.pagination.total,
          totalSuppliers: supplierCount.pagination.total,
          activeCustomers: statistics.active_customers,
          customersWithOverdue: statistics.customers_with_overdue,
          customersOverCreditLimit: statistics.customers_over_credit_limit
        },
        services: {
          CustomerService: 'active'
        }
      };
      
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          CustomerService: 'error'
        }
      };
    }
  }
};

module.exports = CustomerModule;