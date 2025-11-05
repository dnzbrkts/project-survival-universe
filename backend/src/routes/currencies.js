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
  CurrencyController.getAllCurrencies.bind(CurrencyController)
);

router.get('/active', 
  authMiddleware.authenticateToken(), 
  CurrencyController.getActiveCurrencies.bind(CurrencyController)
);

router.get('/base', 
  authMiddleware.authenticateToken(), 
  CurrencyController.getBaseCurrency.bind(CurrencyController)
);

router.get('/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.currencyCodeParam,
  CurrencyController.getCurrencyByCode.bind(CurrencyController)
);

router.post('/', 
  authMiddleware.authenticateToken(), 
  currencyValidation.createCurrency,
  CurrencyController.createCurrency.bind(CurrencyController)
);

router.put('/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.updateCurrency,
  CurrencyController.updateCurrency.bind(CurrencyController)
);

router.delete('/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.currencyCodeParam,
  CurrencyController.deleteCurrency.bind(CurrencyController)
);

// Döviz kuru yönetimi route'ları
router.get('/rates/current', 
  authMiddleware.authenticateToken(), 
  ExchangeRateController.getCurrentRates.bind(ExchangeRateController)
);

router.get('/rates/list', 
  authMiddleware.authenticateToken(), 
  currencyValidation.listQuery,
  ExchangeRateController.getExchangeRates.bind(ExchangeRateController)
);

router.get('/rates/:currencyCode', 
  authMiddleware.authenticateToken(), 
  currencyValidation.currencyCodeParam,
  ExchangeRateController.getExchangeRateByDate.bind(ExchangeRateController)
);

router.post('/rates', 
  authMiddleware.authenticateToken(), 
  currencyValidation.createExchangeRate,
  ExchangeRateController.createOrUpdateExchangeRate.bind(ExchangeRateController)
);

router.post('/rates/bulk', 
  authMiddleware.authenticateToken(), 
  currencyValidation.bulkUpdateRates,
  ExchangeRateController.bulkUpdateRates.bind(ExchangeRateController)
);

router.post('/rates/fetch-tcmb', 
  authMiddleware.authenticateToken(), 
  ExchangeRateController.fetchTCMBRates.bind(ExchangeRateController)
);

router.delete('/rates/:id', 
  authMiddleware.authenticateToken(), 
  ExchangeRateController.deleteExchangeRate.bind(ExchangeRateController)
);

// Para birimi çevirme ve hesaplama route'ları
router.post('/convert', 
  authMiddleware.authenticateToken(), 
  currencyValidation.convertCurrency,
  ExchangeRateController.convertCurrency.bind(ExchangeRateController)
);

router.post('/calculate-price', 
  authMiddleware.authenticateToken(), 
  currencyValidation.calculatePrice,
  ExchangeRateController.calculatePrice.bind(ExchangeRateController)
);

module.exports = router;