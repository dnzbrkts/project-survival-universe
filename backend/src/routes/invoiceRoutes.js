/**
 * Fatura Yönetimi Routes
 * Invoice Management Routes
 */

const express = require('express');
const { body, param, query } = require('express-validator');
const InvoiceController = require('../controllers/InvoiceController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

const router = express.Router();
const invoiceController = new InvoiceController();

// Tüm route'lar için authentication gerekli
router.use(authMiddleware.authenticateToken());

/**
 * Validation Rules
 */
const invoiceValidationRules = [
  body('invoice_type')
    .isIn(['sales', 'purchase'])
    .withMessage('Fatura tipi sales veya purchase olmalıdır'),
  body('customer_id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir müşteri ID giriniz'),
  body('invoice_date')
    .isISO8601()
    .withMessage('Geçerli bir fatura tarihi giriniz'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Para birimi 3 karakter olmalıdır'),
  body('exchange_rate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Döviz kuru 0\'dan büyük olmalıdır'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notlar 1000 karakterden fazla olamaz')
];

const invoiceItemValidationRules = [
  body('product_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Geçerli bir ürün ID giriniz'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Açıklama 500 karakterden fazla olamaz'),
  body('quantity')
    .isFloat({ min: 0.001 })
    .withMessage('Miktar 0\'dan büyük olmalıdır'),
  body('unit_price')
    .isFloat({ min: 0 })
    .withMessage('Birim fiyat 0\'dan büyük veya eşit olmalıdır'),
  body('discount_rate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('İndirim oranı 0-100 arasında olmalıdır'),
  body('tax_rate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Vergi oranı 0-100 arasında olmalıdır')
];

const paymentValidationRules = [
  body('invoice_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Geçerli bir fatura ID giriniz'),
  body('customer_id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir müşteri ID giriniz'),
  body('payment_method')
    .isIn(['cash', 'bank_transfer', 'credit_card', 'check', 'other'])
    .withMessage('Geçerli bir ödeme yöntemi seçiniz'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Tutar 0\'dan büyük olmalıdır'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Para birimi 3 karakter olmalıdır'),
  body('payment_date')
    .isISO8601()
    .withMessage('Geçerli bir ödeme tarihi giriniz'),
  body('reference_number')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Referans numarası 100 karakterden fazla olamaz')
];

/**
 * Fatura Routes
 */

// Fatura listesi
router.get('/', 
  permissionMiddleware('fatura.liste'),
  invoiceController.getInvoices.bind(invoiceController)
);

// Dashboard özet bilgileri
router.get('/dashboard/summary',
  permissionMiddleware('fatura.ozet.goruntule'),
  invoiceController.getDashboardSummary.bind(invoiceController)
);

// Vadesi geçen faturalar
router.get('/overdue',
  permissionMiddleware('fatura.liste'),
  invoiceController.getOverdueInvoices.bind(invoiceController)
);

// Fatura detayı
router.get('/:id',
  param('id').isInt({ min: 1 }).withMessage('Geçerli bir fatura ID giriniz'),
  permissionMiddleware('fatura.detay'),
  invoiceController.getInvoiceById.bind(invoiceController)
);

// Yeni fatura oluştur
router.post('/',
  invoiceValidationRules,
  body('items').optional().isArray().withMessage('Kalemler dizi formatında olmalıdır'),
  body('items.*.product_id').optional().isInt({ min: 1 }).withMessage('Geçerli bir ürün ID giriniz'),
  body('items.*.quantity').isFloat({ min: 0.001 }).withMessage('Miktar 0\'dan büyük olmalıdır'),
  body('items.*.unit_price').isFloat({ min: 0 }).withMessage('Birim fiyat 0\'dan büyük veya eşit olmalıdır'),
  permissionMiddleware('fatura.ekle'),
  invoiceController.createInvoice.bind(invoiceController)
);

// Fatura güncelle
router.put('/:id',
  param('id').isInt({ min: 1 }).withMessage('Geçerli bir fatura ID giriniz'),
  invoiceValidationRules,
  permissionMiddleware('fatura.duzenle'),
  invoiceController.updateInvoice.bind(invoiceController)
);

// Fatura sil
router.delete('/:id',
  param('id').isInt({ min: 1 }).withMessage('Geçerli bir fatura ID giriniz'),
  permissionMiddleware('fatura.sil'),
  invoiceController.deleteInvoice.bind(invoiceController)
);

// Fatura onayla
router.post('/:id/approve',
  param('id').isInt({ min: 1 }).withMessage('Geçerli bir fatura ID giriniz'),
  permissionMiddleware('fatura.onay'),
  invoiceController.approveInvoice.bind(invoiceController)
);

// Fatura iptal et
router.post('/:id/cancel',
  param('id').isInt({ min: 1 }).withMessage('Geçerli bir fatura ID giriniz'),
  permissionMiddleware('fatura.iptal'),
  invoiceController.cancelInvoice.bind(invoiceController)
);

// Fatura PDF oluştur
router.get('/:id/pdf',
  param('id').isInt({ min: 1 }).withMessage('Geçerli bir fatura ID giriniz'),
  permissionMiddleware('fatura.yazdır'),
  invoiceController.generateInvoicePDF.bind(invoiceController)
);

/**
 * Fatura Kalemi Routes
 */

// Fatura kalemi ekle
router.post('/:id/items',
  param('id').isInt({ min: 1 }).withMessage('Geçerli bir fatura ID giriniz'),
  invoiceItemValidationRules,
  permissionMiddleware('fatura.kalemi.ekle'),
  invoiceController.addInvoiceItem.bind(invoiceController)
);

// Fatura kalemi güncelle
router.put('/items/:itemId',
  param('itemId').isInt({ min: 1 }).withMessage('Geçerli bir kalem ID giriniz'),
  invoiceItemValidationRules,
  permissionMiddleware('fatura.kalemi.duzenle'),
  invoiceController.updateInvoiceItem.bind(invoiceController)
);

// Fatura kalemi sil
router.delete('/items/:itemId',
  param('itemId').isInt({ min: 1 }).withMessage('Geçerli bir kalem ID giriniz'),
  permissionMiddleware('fatura.kalemi.sil'),
  invoiceController.deleteInvoiceItem.bind(invoiceController)
);

/**
 * Ödeme Routes
 */

// Ödeme listesi
router.get('/payments',
  permissionMiddleware('fatura.odeme.liste'),
  invoiceController.getPayments.bind(invoiceController)
);

// Ödeme ekle
router.post('/payments',
  paymentValidationRules,
  permissionMiddleware('fatura.odeme.ekle'),
  invoiceController.addPayment.bind(invoiceController)
);

module.exports = router;