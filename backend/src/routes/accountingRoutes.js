const express = require('express');
const router = express.Router();
const { AccountingController } = require('../modules/accounting');
const { 
  accountingEntryValidation,
  automaticEntryValidation,
  reportDateValidation,
  periodicalReportValidation,
  accountBalanceValidation,
  paginationValidation
} = require('../modules/accounting/validations');
const authMiddleware = require('../middleware/authMiddleware');

const accountingController = new AccountingController();

// Tüm route'lar için authentication gerekli
router.use(authMiddleware.authenticateToken());

// Muhasebe kayıtları yönetimi
router.post('/entries', 
  authMiddleware.requireRoles(['admin', 'accountant']),
  accountingEntryValidation,
  accountingController.createAccountingEntry.bind(accountingController)
);

router.get('/entries',
  authMiddleware.requireRoles(['admin', 'accountant', 'manager']),
  [...paginationValidation, ...reportDateValidation],
  accountingController.getAccountingEntries.bind(accountingController)
);

router.get('/entries/:id',
  authMiddleware.requireRoles(['admin', 'accountant', 'manager']),
  accountingController.getAccountingEntryById.bind(accountingController)
);

// Otomatik yevmiye kaydı oluşturma
router.post('/entries/automatic/:reference_type/:reference_id',
  authMiddleware.requireRoles(['admin', 'accountant']),
  automaticEntryValidation,
  accountingController.createAutomaticEntry.bind(accountingController)
);

// Raporlar
router.get('/reports/balance-sheet',
  authMiddleware.requireRoles(['admin', 'accountant', 'manager']),
  reportDateValidation,
  accountingController.generateBalanceSheet.bind(accountingController)
);

router.get('/reports/income-statement',
  authMiddleware.requireRoles(['admin', 'accountant', 'manager']),
  reportDateValidation,
  accountingController.generateIncomeStatement.bind(accountingController)
);

router.get('/reports/trial-balance',
  authMiddleware.requireRoles(['admin', 'accountant', 'manager']),
  reportDateValidation,
  accountingController.generateTrialBalance.bind(accountingController)
);

router.get('/reports/periodical',
  authMiddleware.requireRoles(['admin', 'accountant', 'manager']),
  periodicalReportValidation,
  accountingController.generatePeriodicalReports.bind(accountingController)
);

// Hesap bakiyeleri
router.get('/account-balances',
  authMiddleware.requireRoles(['admin', 'accountant', 'manager']),
  accountBalanceValidation,
  accountingController.getAccountBalances.bind(accountingController)
);

module.exports = router;