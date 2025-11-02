const { body, param, query } = require('express-validator');

const currencyValidation = {
  // Para birimi oluşturma validasyonu
  createCurrency: [
    body('currency_code')
      .isLength({ min: 3, max: 3 })
      .withMessage('Para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Para birimi kodu sadece harf içermelidir')
      .toUpperCase(),
    body('currency_name')
      .isLength({ min: 2, max: 50 })
      .withMessage('Para birimi adı 2-50 karakter arasında olmalıdır')
      .trim(),
    body('symbol')
      .optional()
      .isLength({ max: 10 })
      .withMessage('Sembol en fazla 10 karakter olabilir')
      .trim(),
    body('decimal_places')
      .optional()
      .isInt({ min: 0, max: 8 })
      .withMessage('Ondalık basamak sayısı 0-8 arasında olmalıdır'),
    body('is_base_currency')
      .optional()
      .isBoolean()
      .withMessage('Ana para birimi değeri boolean olmalıdır')
  ],

  // Para birimi güncelleme validasyonu
  updateCurrency: [
    param('currencyCode')
      .isLength({ min: 3, max: 3 })
      .withMessage('Para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Para birimi kodu sadece harf içermelidir'),
    body('currency_name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Para birimi adı 2-50 karakter arasında olmalıdır')
      .trim(),
    body('symbol')
      .optional()
      .isLength({ max: 10 })
      .withMessage('Sembol en fazla 10 karakter olabilir')
      .trim(),
    body('decimal_places')
      .optional()
      .isInt({ min: 0, max: 8 })
      .withMessage('Ondalık basamak sayısı 0-8 arasında olmalıdır'),
    body('is_base_currency')
      .optional()
      .isBoolean()
      .withMessage('Ana para birimi değeri boolean olmalıdır'),
    body('is_active')
      .optional()
      .isBoolean()
      .withMessage('Aktiflik durumu boolean olmalıdır')
  ],

  // Para birimi kodu parametresi validasyonu
  currencyCodeParam: [
    param('currencyCode')
      .isLength({ min: 3, max: 3 })
      .withMessage('Para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Para birimi kodu sadece harf içermelidir')
  ],

  // Döviz kuru oluşturma/güncelleme validasyonu
  createExchangeRate: [
    body('currency_code')
      .isLength({ min: 3, max: 3 })
      .withMessage('Para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Para birimi kodu sadece harf içermelidir')
      .toUpperCase(),
    body('buy_rate')
      .isFloat({ min: 0 })
      .withMessage('Alış kuru pozitif bir sayı olmalıdır'),
    body('sell_rate')
      .isFloat({ min: 0 })
      .withMessage('Satış kuru pozitif bir sayı olmalıdır'),
    body('rate_date')
      .optional()
      .isISO8601()
      .withMessage('Geçerli bir tarih formatı giriniz (YYYY-MM-DD)'),
    body('source')
      .optional()
      .isIn(['manual', 'tcmb', 'api', 'external'])
      .withMessage('Geçersiz kaynak türü')
  ],

  // Toplu kur güncelleme validasyonu
  bulkUpdateRates: [
    body('rates')
      .isArray({ min: 1 })
      .withMessage('En az bir kur bilgisi gönderilmelidir'),
    body('rates.*.currency_code')
      .isLength({ min: 3, max: 3 })
      .withMessage('Para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Para birimi kodu sadece harf içermelidir'),
    body('rates.*.buy_rate')
      .isFloat({ min: 0 })
      .withMessage('Alış kuru pozitif bir sayı olmalıdır'),
    body('rates.*.sell_rate')
      .isFloat({ min: 0 })
      .withMessage('Satış kuru pozitif bir sayı olmalıdır')
  ],

  // Para birimi çevirme validasyonu
  convertCurrency: [
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Miktar pozitif bir sayı olmalıdır'),
    body('fromCurrency')
      .isLength({ min: 3, max: 3 })
      .withMessage('Kaynak para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Kaynak para birimi kodu sadece harf içermelidir'),
    body('toCurrency')
      .isLength({ min: 3, max: 3 })
      .withMessage('Hedef para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Hedef para birimi kodu sadece harf içermelidir'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Geçerli bir tarih formatı giriniz (YYYY-MM-DD)')
  ],

  // Fiyat hesaplama validasyonu
  calculatePrice: [
    body('basePrice')
      .isFloat({ min: 0 })
      .withMessage('Temel fiyat pozitif bir sayı olmalıdır'),
    body('baseCurrency')
      .isLength({ min: 3, max: 3 })
      .withMessage('Temel para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Temel para birimi kodu sadece harf içermelidir'),
    body('targetCurrency')
      .isLength({ min: 3, max: 3 })
      .withMessage('Hedef para birimi kodu 3 karakter olmalıdır')
      .isAlpha()
      .withMessage('Hedef para birimi kodu sadece harf içermelidir'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Geçerli bir tarih formatı giriniz (YYYY-MM-DD)')
  ],

  // Query parametreleri validasyonu
  listQuery: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Sayfa numarası pozitif bir tamsayı olmalıdır'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit 1-100 arasında olmalıdır'),
    query('isActive')
      .optional()
      .isBoolean()
      .withMessage('Aktiflik durumu boolean olmalıdır'),
    query('dateFrom')
      .optional()
      .isISO8601()
      .withMessage('Başlangıç tarihi geçerli bir tarih formatında olmalıdır'),
    query('dateTo')
      .optional()
      .isISO8601()
      .withMessage('Bitiş tarihi geçerli bir tarih formatında olmalıdır')
  ]
};

module.exports = currencyValidation;