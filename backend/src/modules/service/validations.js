const { body, param, query } = require('express-validator');

// Servis talebi oluşturma validasyonu
const createServiceRequestValidation = [
  body('customer_id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir müşteri ID gereklidir'),
  
  body('product_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Geçerli bir ürün ID gereklidir'),
  
  body('issue_description')
    .notEmpty()
    .withMessage('Sorun açıklaması gereklidir')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Sorun açıklaması 10-2000 karakter arasında olmalıdır'),
  
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Öncelik low, normal, high veya urgent olmalıdır'),
  
  body('estimated_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tahmini maliyet 0 veya pozitif bir sayı olmalıdır')
];

// Servis talebi güncelleme validasyonu
const updateServiceRequestValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir servis talebi ID gereklidir'),
  
  body('customer_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Geçerli bir müşteri ID gereklidir'),
  
  body('product_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Geçerli bir ürün ID gereklidir'),
  
  body('issue_description')
    .optional()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Sorun açıklaması 10-2000 karakter arasında olmalıdır'),
  
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Öncelik low, normal, high veya urgent olmalıdır'),
  
  body('estimated_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tahmini maliyet 0 veya pozitif bir sayı olmalıdır'),
  
  body('actual_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Gerçek maliyet 0 veya pozitif bir sayı olmalıdır')
];

// Servis durumu güncelleme validasyonu
const updateStatusValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir servis talebi ID gereklidir'),
  
  body('status')
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Durum pending, in_progress, completed veya cancelled olmalıdır'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notlar 500 karakterden fazla olamaz')
];

// Teknisyen atama validasyonu
const assignTechnicianValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir servis talebi ID gereklidir'),
  
  body('technician_id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir teknisyen ID gereklidir'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notlar 500 karakterden fazla olamaz')
];

// Servis aktivitesi ekleme validasyonu
const addActivityValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir servis talebi ID gereklidir'),
  
  body('activity_type')
    .notEmpty()
    .withMessage('Aktivite türü gereklidir')
    .isLength({ max: 50 })
    .withMessage('Aktivite türü 50 karakterden fazla olamaz'),
  
  body('description')
    .notEmpty()
    .withMessage('Açıklama gereklidir')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Açıklama 5-1000 karakter arasında olmalıdır'),
  
  body('duration_minutes')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Süre pozitif bir sayı olmalıdır'),
  
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maliyet 0 veya pozitif bir sayı olmalıdır')
];

// Servis parçası ekleme validasyonu
const addPartsValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir servis talebi ID gereklidir'),
  
  body('parts')
    .isArray({ min: 1 })
    .withMessage('En az bir parça gereklidir'),
  
  body('parts.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir ürün ID gereklidir'),
  
  body('parts.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Miktar pozitif bir sayı olmalıdır'),
  
  body('parts.*.unit_price')
    .isFloat({ min: 0 })
    .withMessage('Birim fiyat 0 veya pozitif bir sayı olmalıdır')
];

// ID parametresi validasyonu
const idParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir ID gereklidir')
];

// Sayfalama validasyonu
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası pozitif bir sayı olmalıdır'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalıdır')
];

// Rapor filtreleri validasyonu
const reportFiltersValidation = [
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Başlangıç tarihi geçerli bir tarih formatında olmalıdır'),
  
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('Bitiş tarihi geçerli bir tarih formatında olmalıdır'),
  
  query('customer_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Müşteri ID pozitif bir sayı olmalıdır'),
  
  query('technician_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Teknisyen ID pozitif bir sayı olmalıdır'),
  
  query('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Durum geçerli bir değer olmalıdır'),
  
  query('format')
    .optional()
    .isIn(['json', 'excel', 'pdf'])
    .withMessage('Format json, excel veya pdf olmalıdır')
];

module.exports = {
  createServiceRequestValidation,
  updateServiceRequestValidation,
  updateStatusValidation,
  assignTechnicianValidation,
  addActivityValidation,
  addPartsValidation,
  idParamValidation,
  paginationValidation,
  reportFiltersValidation
};