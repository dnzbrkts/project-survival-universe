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
const roleMiddleware = require('../middleware/roleMiddleware');

const accountingController = new AccountingController();

// Tüm route'lar için authentication gerekli
router.use(authMiddleware);

// Muhasebe kayıtları yönetimi
router.post('/entries', 
  roleMiddleware(['admin', 'accountant']),
  accountingEntryValidation,
  accountingController.createAccountingEntry.bind(accountingController)
);

router.get('/entries',
  roleMiddleware(['admin', 'accountant', 'manager']),
  [...paginationValidation, ...reportDateValidation],
  accountingController.getAccountingEntries.bind(accountingController)
);

router.get('/entries/:id',
  roleMiddleware(['admin', 'accountant', 'manager']),
  accountingController.getAccountingEntryById.bind(accountingController)
);

// Otomatik yevmiye kaydı oluşturma
router.post('/entries/automatic/:reference_type/:reference_id',
  roleMiddleware(['admin', 'accountant']),
  automaticEntryValidation,
  accountingController.createAutomaticEntry.bind(accountingController)
);

// Raporlar
router.get('/reports/balance-sheet',
  roleMiddleware(['admin', 'accountant', 'manager']),
  reportDateValidation,
  accountingController.generateBalanceSheet.bind(accountingController)
);

router.get('/reports/income-statement',
  roleMiddleware(['admin', 'accountant', 'manager']),
  reportDateValidation,
  accountingController.generateIncomeStatement.bind(accountingController)
);

router.get('/reports/trial-balance',
  roleMiddleware(['admin', 'accountant', 'manager']),
  reportDateValidation,
  accountingController.generateTrialBalance.bind(accountingController)
);

router.get('/reports/periodical',
  roleMiddleware(['admin', 'accountant', 'manager']),
  periodicalReportValidation,
  accountingController.generatePeriodicalReports.bind(accountingController)
);

// Hesap bakiyeleri
router.get('/account-balances',
  roleMiddleware(['admin', 'accountant', 'manager']),
  accountBalanceValidation,
  accountingController.getAccountBalances.bind(accountingController)
);

module.exports = router;