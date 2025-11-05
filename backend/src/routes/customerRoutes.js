'use strict';

const express = require('express');
const { body, param, query } = require('express-validator');
const CustomerController = require('../controllers/CustomerController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

const router = express.Router();

// Validation rules
const customerValidationRules = () => {
  return [
    body('customer_code')
      .optional()
      .isLength({ min: 1, max: 20 })
      .withMessage('Müşteri kodu 1-20 karakter arasında olmalıdır'),
    
    body('company_name')
      .notEmpty()
      .withMessage('Şirket adı gereklidir')
      .isLength({ min: 1, max: 200 })
      .withMessage('Şirket adı 1-200 karakter arasında olmalıdır'),
    
    body('customer_type')
      .isIn(['customer', 'supplier', 'both'])
      .withMessage('Geçersiz müşteri tipi'),
    
    body('tax_number')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Vergi numarası en fazla 20 karakter olabilir'),
    
    body('tax_office')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Vergi dairesi en fazla 100 karakter olabilir'),
    
    body('phone')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Telefon numarası en fazla 20 karakter olabilir'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Geçersiz email formatı')
      .isLength({ max: 100 })
      .withMessage('Email en fazla 100 karakter olabilir'),
    
    body('contact_person')
      .optional()
      .isLength({ max: 100 })
      .withMessage('İletişim kişisi en fazla 100 karakter olabilir'),
    
    body('payment_terms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Ödeme vadesi 0 veya pozitif bir sayı olmalıdır'),
    
    body('credit_limit')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Kredi limiti 0 veya pozitif bir sayı olmalıdır')
  ];
};

const idValidationRules = () => {
  return [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Geçersiz müşteri ID')
  ];
};

// Tüm route'lar için authentication gerekli
router.use(authMiddleware.authenticateToken());

/**
 * @route   GET /api/customers
 * @desc    Tüm cari hesapları listele
 * @access  Private (cari.liste permission)
 */
router.get('/', 
  permissionMiddleware('cari.liste'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Sayfa numarası geçersiz'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit geçersiz'),
    query('customer_type').optional().isIn(['customer', 'supplier', 'both']).withMessage('Geçersiz müşteri tipi'),
    query('is_active').optional().isBoolean().withMessage('Aktiflik durumu boolean olmalıdır')
  ],
  CustomerController.getCustomers.bind(CustomerController)
);

/**
 * @route   GET /api/customers/:id
 * @desc    Cari hesap detayını getir
 * @access  Private (cari.detay permission)
 */
router.get('/:id',
  permissionMiddleware('cari.detay'),
  idValidationRules(),
  CustomerController.getCustomer.bind(CustomerController)
);

/**
 * @route   POST /api/customers
 * @desc    Yeni cari hesap oluştur
 * @access  Private (cari.ekle permission)
 */
router.post('/',
  permissionMiddleware('cari.ekle'),
  customerValidationRules(),
  CustomerController.createCustomer.bind(CustomerController)
);

/**
 * @route   PUT /api/customers/:id
 * @desc    Cari hesap güncelle
 * @access  Private (cari.duzenle permission)
 */
router.put('/:id',
  permissionMiddleware('cari.duzenle'),
  idValidationRules(),
  customerValidationRules(),
  CustomerController.updateCustomer.bind(CustomerController)
);

/**
 * @route   DELETE /api/customers/:id
 * @desc    Cari hesap sil (soft delete)
 * @access  Private (cari.sil permission)
 */
router.delete('/:id',
  permissionMiddleware('cari.sil'),
  idValidationRules(),
  CustomerController.deleteCustomer.bind(CustomerController)
);

/**
 * @route   GET /api/customers/:id/balance
 * @desc    Cari hesap bakiyesini getir
 * @access  Private (cari.bakiye.goruntule permission)
 */
router.get('/:id/balance',
  permissionMiddleware('cari.bakiye.goruntule'),
  idValidationRules(),
  CustomerController.getCustomerBalance.bind(CustomerController)
);

/**
 * @route   GET /api/customers/:id/statement
 * @desc    Cari hesap ekstresini getir
 * @access  Private (cari.ekstre.goruntule permission)
 */
router.get('/:id/statement',
  permissionMiddleware('cari.ekstre.goruntule'),
  [
    ...idValidationRules(),
    query('start_date').optional().isISO8601().withMessage('Geçersiz başlangıç tarihi'),
    query('end_date').optional().isISO8601().withMessage('Geçersiz bitiş tarihi'),
    query('page').optional().isInt({ min: 1 }).withMessage('Sayfa numarası geçersiz'),
    query('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit geçersiz')
  ],
  CustomerController.getCustomerStatement.bind(CustomerController)
);

/**
 * @route   GET /api/customers/dashboard/summary
 * @desc    Dashboard için cari hesap özeti
 * @access  Private (cari.ozet.goruntule permission)
 */
router.get('/dashboard/summary',
  permissionMiddleware('cari.ozet.goruntule'),
  CustomerController.getDashboardSummary.bind(CustomerController)
);

/**
 * @route   GET /api/customers/credit-limit-alerts
 * @desc    Kredi limiti uyarıları
 * @access  Private (cari.kredi.limit.yonet permission)
 */
router.get('/credit-limit-alerts',
  permissionMiddleware('cari.kredi.limit.yonet'),
  CustomerController.getCreditLimitAlerts.bind(CustomerController)
);

/**
 * @route   GET /api/customers/overdue/receivables
 * @desc    Vadesi geçen alacakları getir
 * @access  Private (cari.vadeli.alacak.goruntule permission)
 */
router.get('/overdue/receivables',
  permissionMiddleware('cari.vadeli.alacak.goruntule'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Sayfa numarası geçersiz'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit geçersiz'),
    query('customer_id').optional().isInt({ min: 1 }).withMessage('Geçersiz müşteri ID'),
    query('days_overdue').optional().isInt({ min: 1 }).withMessage('Geçersiz vade aşım günü')
  ],
  CustomerController.getOverdueReceivables.bind(CustomerController)
);

module.exports = router;