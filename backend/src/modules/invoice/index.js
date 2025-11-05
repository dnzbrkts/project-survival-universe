/**
 * Fatura Yönetimi Modülü
 * Invoice Management Module Definition
 */

const InvoiceController = require('../../controllers/InvoiceController');
const InvoiceService = require('../../services/InvoiceService');

/**
 * Fatura Yönetimi Modül Tanımı
 */
const InvoiceModule = {
  code: 'INVOICE',
  name: 'Fatura Yönetimi',
  version: '1.0.0',
  category: 'FINANS',
  icon: 'receipt_long',
  color: '#4CAF50',
  description: 'Satış ve alış faturası oluşturma, KDV hesaplama, ödeme takibi',
  
  dependencies: ['AUTH', 'SYSTEM', 'CUSTOMER', 'INVENTORY'],
  
  permissions: [
    'fatura.liste',
    'fatura.detay',
    'fatura.ekle',
    'fatura.duzenle',
    'fatura.sil',
    'fatura.onay',
    'fatura.iptal',
    'fatura.yazdır',
    'fatura.kalemi.ekle',
    'fatura.kalemi.duzenle',
    'fatura.kalemi.sil',
    'fatura.odeme.ekle',
    'fatura.odeme.liste',
    'fatura.rapor.goruntule',
    'fatura.rapor.export',
    'fatura.ozet.goruntule'
  ],
  
  routes: [
    {
      path: '/invoices',
      routeFile: '../../routes/invoiceRoutes',
      description: 'Fatura yönetimi API endpoint\'leri'
    }
  ],
  
  menuItems: [
    {
      title: 'Fatura Yönetimi',
      path: '/invoices',
      permission: 'fatura.ozet.goruntule',
      icon: 'receipt_long',
      order: 1,
      children: [
        {
          title: 'Satış Faturaları',
          path: '/invoices/sales',
          permission: 'fatura.liste',
          icon: 'sell',
          order: 1
        },
        {
          title: 'Alış Faturaları',
          path: '/invoices/purchases',
          permission: 'fatura.liste',
          icon: 'shopping_cart',
          order: 2
        },
        {
          title: 'Yeni Fatura',
          path: '/invoices/create',
          permission: 'fatura.ekle',
          icon: 'add_circle',
          order: 3
        },
        {
          title: 'Ödemeler',
          path: '/invoices/payments',
          permission: 'fatura.odeme.liste',
          icon: 'payment',
          order: 4
        },
        {
          title: 'Fatura Raporları',
          path: '/invoices/reports',
          permission: 'fatura.rapor.goruntule',
          icon: 'analytics',
          order: 5
        }
      ]
    }
  ],
  
  dashboardWidgets: [
    {
      id: 'invoice-summary',
      title: 'Fatura Özeti',
      component: 'InvoiceSummaryWidget',
      permission: 'fatura.ozet.goruntule',
      size: 'medium',
      order: 1,
      refreshInterval: 300000,
      apiEndpoint: '/api/invoices/dashboard/summary'
    },
    {
      id: 'overdue-invoices',
      title: 'Vadesi Geçen Faturalar',
      component: 'OverdueInvoicesWidget',
      permission: 'fatura.liste',
      size: 'small',
      order: 2,
      refreshInterval: 3600000,
      apiEndpoint: '/api/invoices/overdue'
    },
    {
      id: 'recent-payments',
      title: 'Son Ödemeler',
      component: 'RecentPaymentsWidget',
      permission: 'fatura.odeme.liste',
      size: 'large',
      order: 3,
      refreshInterval: 120000,
      apiEndpoint: '/api/invoices/payments?limit=10'
    }
  ],
  
  config: {
    defaults: {
      defaultCurrency: 'TRY',
      defaultTaxRate: 20.00,
      autoGenerateInvoiceNumber: true,
      salesInvoicePrefix: 'SF',
      purchaseInvoicePrefix: 'AF',
      paymentTermsDays: 30,
      enableEInvoice: false,
      enableEArchive: false,
      invoiceNumberLength: 6,
      maxInvoiceItemsPerInvoice: 100,
      allowNegativeQuantity: false,
      requireApprovalForLargeAmounts: false,
      largeAmountThreshold: 10000,
      reportFormats: ['json', 'excel', 'pdf'],
      maxInvoicesPerPage: 50
    },
    
    schema: {
      defaultCurrency: {
        type: 'string',
        enum: ['TRY', 'USD', 'EUR'],
        description: 'Varsayılan para birimi'
      },
      defaultTaxRate: {
        type: 'number',
        min: 0,
        max: 100,
        description: 'Varsayılan KDV oranı (%)'
      },
      autoGenerateInvoiceNumber: {
        type: 'boolean',
        description: 'Otomatik fatura numarası oluşturma'
      },
      salesInvoicePrefix: {
        type: 'string',
        maxLength: 5,
        description: 'Satış faturası öneki'
      },
      purchaseInvoicePrefix: {
        type: 'string',
        maxLength: 5,
        description: 'Alış faturası öneki'
      },
      paymentTermsDays: {
        type: 'number',
        min: 0,
        description: 'Varsayılan ödeme vadesi (gün)'
      },
      enableEInvoice: {
        type: 'boolean',
        description: 'E-fatura entegrasyonu aktif mi?'
      },
      enableEArchive: {
        type: 'boolean',
        description: 'E-arşiv entegrasyonu aktif mi?'
      }
    }
  },
  
  services: {
    InvoiceService: InvoiceService
  },
  
  controllers: {
    InvoiceController: InvoiceController
  },

  async initialize(moduleSystem) {
    console.log('Fatura Yönetimi modülü başlatılıyor...');
    
    try {
      const invoiceService = new InvoiceService();
      moduleSystem.registerService('invoice', invoiceService);
      
      console.log('Fatura Yönetimi modülü başarıyla başlatıldı');
      
      return {
        success: true,
        message: 'Fatura Yönetimi modülü aktif',
        services: ['InvoiceService'],
        routes: ['/api/invoices'],
        permissions: this.permissions.length
      };
      
    } catch (error) {
      console.error('Fatura Yönetimi modülü başlatma hatası:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  async shutdown(moduleSystem) {
    console.log('Fatura Yönetimi modülü kapatılıyor...');
    
    try {
      moduleSystem.unregisterService('invoice');
      
      console.log('Fatura Yönetimi modülü kapatıldı');
      
      return {
        success: true,
        message: 'Fatura Yönetimi modülü deaktif'
      };
      
    } catch (error) {
      console.error('Fatura Yönetimi modülü kapatma hatası:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  async healthCheck() {
    try {
      const invoiceService = new InvoiceService();
      
      const [
        salesInvoices,
        purchaseInvoices,
        recentPayments
      ] = await Promise.all([
        invoiceService.getInvoices({ invoice_type: 'sales', limit: 1 }),
        invoiceService.getInvoices({ invoice_type: 'purchase', limit: 1 }),
        invoiceService.getPayments({ limit: 1 })
      ]);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        metrics: {
          totalSalesInvoices: salesInvoices.pagination.total,
          totalPurchaseInvoices: purchaseInvoices.pagination.total,
          recentPaymentsCount: recentPayments.pagination.total
        },
        services: {
          InvoiceService: 'active'
        }
      };
      
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          InvoiceService: 'error'
        }
      };
    }
  }
};

module.exports = InvoiceModule;