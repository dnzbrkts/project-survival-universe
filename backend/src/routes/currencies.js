const express = require('express');
const router = express.Router();
const CurrencyController = require('../controllers/CurrencyController');
const ExchangeRateController = require('../controllers/ExchangeRateController');
const currencyValidation = require('../middleware/currencyValidation');
const authMiddleware = require('../middleware/authMiddleware');

// Para birimi yönetimi route'ları
router.get('/', 
  authMiddleware.authenticateToken(), 
  currencyValidation.listQuery,
  CurrencyController.getAllCurrencies
);

router.get('/active', 
  authMiddleware.authenticateToken(), 
  CurrencyController.getActiveCurrencies
);

router.get('/base', 
  authMiddleware.authenticateToken(), 
  CurrencyController.getBaseCurrency
);

router.get('/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.currencyCodeParam,
  CurrencyController.getCurrencyByCode
);

router.post('/', 
  authMiddleware.authenticateToken(), 
  currencyValidation.createCurrency,
  CurrencyController.createCurrency
);

router.put('/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.updateCurrency,
  CurrencyController.updateCurrency
);

router.delete('/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.currencyCodeParam,
  CurrencyController.deleteCurrency
);

// Döviz kuru yönetimi route'ları
router.get('/rates/current', 
  authMiddleware.authenticateToken(), 
  ExchangeRateController.getCurrentRates
);

router.get('/rates/list', 
  authMiddleware.authenticateToken(), 
  currencyValidation.listQuery,
  ExchangeRateController.getExchangeRates
);

router.get('/rates/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.currencyCodeParam,
  ExchangeRateController.getExchangeRateByDate
);

router.post('/rates', 
  authMiddleware.authenticateToken(), 
  currencyValidation.createExchangeRate,
  ExchangeRateController.createOrUpdateExchangeRate
);

router.post('/rates/bulk', 
  authMiddleware.authenticateToken(), 
  currencyValidation.bulkUpdateRates,
  ExchangeRateController.bulkUpdateRates
);

router.post('/rates/fetch-tcmb', 
  authMiddleware.authenticateToken(), 
  ExchangeRateController.fetchTCMBRates
);

router.delete('/rates/:id', 
  authMiddleware.authenticateToken(), 
  ExchangeRateController.deleteExchangeRate
);

// Para birimi çevirme ve hesaplama route'ları
router.post('/convert', 
  authMiddleware.authenticateToken(), 
  currencyValidation.convertCurrency,
  ExchangeRateController.convertCurrency
);

router.post('/calculate-price', 
  authMiddleware.authenticateToken(), 
  currencyValidation.calculatePrice,
  ExchangeRateController.calculatePrice
);

module.exports = router;