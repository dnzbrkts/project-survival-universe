const { body, query, param } = require('express-validator');

const accountingEntryValidation = [
  body('description')
    .notEmpty()
    .withMessage('Açıklama gereklidir')
    .isLength({ min: 3, max: 500 })
    .withMessage('Açıklama 3-500 karakter arasında olmalıdır'),
  
  body('entry_date')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir tarih formatı giriniz'),
  
  body('reference_type')
    .optional()
    .isIn(['invoice', 'payment', 'expense', 'adjustment', 'manual'])
    .withMessage('Geçersiz referans tipi'),
  
  body('reference_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Geçerli bir referans ID giriniz'),
  
  body('total_debit')
    .isFloat({ min: 0 })
    .withMessage('Borç tutarı 0 veya pozitif olmalıdır'),
  
  body('total_credit')
    .isFloat({ min: 0 })
    .withMessage('Alacak tutarı 0 veya pozitif olmalıdır'),
  
  body('account_movements')
    .isArray({ min: 1 })
    .withMessage('En az bir hesap hareketi gereklidir'),
  
  body('account_movements.*.account_code')
    .notEmpty()
    .withMessage('Hesap kodu gereklidir')
    .matches(/^\d{3}\.\d{2}$/)
    .withMessage('Hesap kodu formatı: XXX.XX'),
  
  body('account_movements.*.account_name')
    .notEmpty()
    .withMessage('Hesap adı gereklidir')
    .isLength({ min: 2, max: 200 })
    .withMessage('Hesap adı 2-200 karakter arasında olmalıdır'),
  
  body('account_movements.*.debit_amount')
    .isFloat({ min: 0 })
    .withMessage('Borç tutarı 0 veya pozitif olmalıdır'),
  
  body('account_movements.*.credit_amount')
    .isFloat({ min: 0 })
    .withMessage('Alacak tutarı 0 veya pozitif olmalıdır'),
  
  body('account_movements.*.description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Açıklama maksimum 500 karakter olabilir')
];

const automaticEntryValidation = [
  param('reference_type')
    .isIn(['invoice', 'payment', 'expense'])
    .withMessage('Geçersiz referans tipi'),
  
  param('reference_id')
    .isInt({ min: 1 })
    .withMessage('Geçerli bir referans ID giriniz')
];

const reportDateValidation = [
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir başlangıç tarihi formatı giriniz'),
  
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir bitiş tarihi formatı giriniz')
];

const periodicalReportValidation = [
  query('period_type')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly'])
    .withMessage('Geçersiz dönem tipi'),
  
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Geçerli bir yıl giriniz'),
  
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Geçerli bir ay giriniz (1-12)'),
  
  query('quarter')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Geçerli bir çeyrek giriniz (1-4)')
];

const accountBalanceValidation = [
  query('account_type')
    .optional()
    .isIn(['asset', 'liability', 'equity', 'revenue', 'expense'])
    .withMessage('Geçersiz hesap tipi'),
  
  query('account_code_prefix')
    .optional()
    .matches(/^\d{1,3}$/)
    .withMessage('Hesap kodu öneki sadece rakam olmalıdır'),
  
  ...reportDateValidation
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası 1 veya daha büyük olmalıdır'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalıdır')
];

module.exports = {
  accountingEntryValidation,
  automaticEntryValidation,
  reportDateValidation,
  periodicalReportValidation,
  accountBalanceValidation,
  paginationValidation
};