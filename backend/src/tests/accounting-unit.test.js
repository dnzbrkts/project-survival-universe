const { AccountingService } = require('../modules/accounting');
const { 
  AccountingEntry, 
  AccountingMovement, 
  AccountingAccount, 
  Invoice, 
  Customer, 
  Payment 
} = require('../models');

// Mock'ları kur
jest.mock('../models');
jest.mock('../config/database', () => ({
  transaction: jest.fn(() => ({
    commit: jest.fn(),
    rollback: jest.fn()
  }))
}));

describe('AccountingService Unit Tests', () => {
  let accountingService;

  beforeEach(() => {
    accountingService = new AccountingService();
    jest.clearAllMocks();
  });

  describe('createAccountingEntry', () => {
    it('should create accounting entry with movements', async () => {
      const mockEntry = {
        id: 1,
        entry_number: 'YEV2024110001',
        description: 'Test entry'
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      const sequelize = require('../config/database');
      sequelize.transaction.mockResolvedValue(mockTransaction);

      AccountingEntry.create.mockResolvedValue(mockEntry);
      AccountingMovement.bulkCreate.mockResolvedValue([]);
      
      // Mock getAccountingEntryById
      accountingService.getAccountingEntryById = jest.fn().mockResolvedValue(mockEntry);
      accountingService.generateEntryNumber = jest.fn().mockResolvedValue('YEV2024110001');

      const entryData = {
        description: 'Test entry',
        total_debit: 1000,
        total_credit: 1000,
        account_movements: [
          {
            account_code: '100.01',
            account_name: 'Kasa',
            debit_amount: 1000,
            credit_amount: 0
          },
          {
            account_code: '600.01',
            account_name: 'Satışlar',
            debit_amount: 0,
            credit_amount: 1000
          }
        ],
        created_by: 1
      };

      const result = await accountingService.createAccountingEntry(entryData);

      expect(AccountingEntry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          entry_number: 'YEV2024110001',
          description: 'Test entry',
          total_debit: 1000,
          total_credit: 1000,
          created_by: 1
        }),
        { transaction: mockTransaction }
      );

      expect(AccountingMovement.bulkCreate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            account_code: '100.01',
            accounting_entry_id: 1
          })
        ]),
        { transaction: mockTransaction }
      );

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(mockEntry);
    });

    it('should rollback transaction on error', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      const sequelize = require('../config/database');
      sequelize.transaction.mockResolvedValue(mockTransaction);

      AccountingEntry.create.mockRejectedValue(new Error('Database error'));
      accountingService.generateEntryNumber = jest.fn().mockResolvedValue('YEV2024110001');

      const entryData = {
        description: 'Test entry',
        total_debit: 1000,
        total_credit: 1000,
        account_movements: [],
        created_by: 1
      };

      await expect(accountingService.createAccountingEntry(entryData))
        .rejects.toThrow('Database error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('generateEntryNumber', () => {
    it('should generate entry number with correct format', async () => {
      AccountingEntry.findOne.mockResolvedValue(null);

      const entryNumber = await accountingService.generateEntryNumber();

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const expectedPrefix = `YEV${year}${month}`;

      expect(entryNumber).toMatch(new RegExp(`^${expectedPrefix}\\d{4}$`));
      expect(entryNumber).toBe(`${expectedPrefix}0001`);
    });

    it('should increment sequence number', async () => {
      const mockLastEntry = {
        entry_number: 'YEV2024110005'
      };

      AccountingEntry.findOne.mockResolvedValue(mockLastEntry);

      const entryNumber = await accountingService.generateEntryNumber();

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const expectedNumber = `YEV${year}${month}0006`;

      expect(entryNumber).toBe(expectedNumber);
    });
  });

  describe('createInvoiceEntry', () => {
    it('should create sales invoice entry', async () => {
      const mockInvoice = {
        id: 1,
        invoice_number: 'SAT-001',
        invoice_type: 'sales',
        total_amount: 1200,
        subtotal: 1000,
        tax_amount: 200,
        customer: {
          company_name: 'Test Müşteri'
        }
      };

      Invoice.findByPk.mockResolvedValue(mockInvoice);
      accountingService.createAccountingEntry = jest.fn().mockResolvedValue({
        id: 1,
        entry_number: 'YEV2024110001'
      });

      const result = await accountingService.createInvoiceEntry(1, { created_by: 1 });

      expect(accountingService.createAccountingEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Satış Faturası - SAT-001',
          reference_type: 'invoice',
          reference_id: 1,
          total_debit: 1200,
          total_credit: 1200,
          account_movements: expect.arrayContaining([
            expect.objectContaining({
              account_code: '120.01',
              debit_amount: 1200,
              credit_amount: 0
            }),
            expect.objectContaining({
              account_code: '600.01',
              debit_amount: 0,
              credit_amount: 1000
            }),
            expect.objectContaining({
              account_code: '391.01',
              debit_amount: 0,
              credit_amount: 200
            })
          ])
        })
      );

      expect(result).toBeDefined();
    });

    it('should create purchase invoice entry', async () => {
      const mockInvoice = {
        id: 2,
        invoice_number: 'AL-001',
        invoice_type: 'purchase',
        total_amount: 1200,
        subtotal: 1000,
        tax_amount: 200,
        customer: {
          company_name: 'Test Tedarikçi'
        }
      };

      Invoice.findByPk.mockResolvedValue(mockInvoice);
      accountingService.createAccountingEntry = jest.fn().mockResolvedValue({
        id: 2,
        entry_number: 'YEV2024110002'
      });

      const result = await accountingService.createInvoiceEntry(2, { created_by: 1 });

      expect(accountingService.createAccountingEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Alış Faturası - AL-001',
          reference_type: 'invoice',
          reference_id: 2,
          account_movements: expect.arrayContaining([
            expect.objectContaining({
              account_code: '153.01',
              debit_amount: 1000,
              credit_amount: 0
            }),
            expect.objectContaining({
              account_code: '191.01',
              debit_amount: 200,
              credit_amount: 0
            }),
            expect.objectContaining({
              account_code: '320.01',
              debit_amount: 0,
              credit_amount: 1200
            })
          ])
        })
      );

      expect(result).toBeDefined();
    });

    it('should throw error if invoice not found', async () => {
      Invoice.findByPk.mockResolvedValue(null);

      await expect(accountingService.createInvoiceEntry(999, { created_by: 1 }))
        .rejects.toThrow('Fatura bulunamadı');
    });
  });

  describe('generateBalanceSheet', () => {
    it('should generate balance sheet with correct structure', async () => {
      const mockAssets = [
        { account_code: '100.01', account_name: 'Kasa', balance: 5000 },
        { account_code: '120.01', account_name: 'Alıcılar', balance: 10000 }
      ];

      const mockLiabilities = [
        { account_code: '320.01', account_name: 'Satıcılar', balance: 3000 }
      ];

      const mockEquity = [
        { account_code: '500.01', account_name: 'Sermaye', balance: 12000 }
      ];

      accountingService.getAccountBalances = jest.fn()
        .mockResolvedValueOnce(mockAssets)
        .mockResolvedValueOnce(mockLiabilities)
        .mockResolvedValueOnce(mockEquity);

      const result = await accountingService.generateBalanceSheet({
        end_date: '2024-11-04'
      });

      expect(result).toHaveProperty('assets');
      expect(result).toHaveProperty('liabilities_and_equity');
      expect(result.assets.total_assets).toBe(15000);
      expect(result.liabilities_and_equity.total_liabilities_and_equity).toBe(15000);
    });
  });

  describe('generateIncomeStatement', () => {
    it('should generate income statement with correct calculations', async () => {
      const mockRevenues = [
        { account_code: '600.01', account_name: 'Satışlar', balance: -50000 }
      ];

      const mockCosts = [
        { account_code: '620.01', account_name: 'Satılan Malın Maliyeti', balance: 30000 }
      ];

      const mockExpenses = [
        { account_code: '700.01', account_name: 'Personel Giderleri', balance: 10000 }
      ];

      accountingService.getAccountBalances = jest.fn()
        .mockResolvedValueOnce(mockRevenues)
        .mockResolvedValueOnce(mockCosts)
        .mockResolvedValueOnce(mockExpenses);

      const result = await accountingService.generateIncomeStatement({
        start_date: '2024-01-01',
        end_date: '2024-11-04'
      });

      expect(result.revenues.total).toBe(50000);
      expect(result.cost_of_goods_sold.total).toBe(30000);
      expect(result.gross_profit).toBe(20000);
      expect(result.operating_expenses.total).toBe(10000);
      expect(result.operating_profit).toBe(10000);
      expect(result.net_profit).toBe(10000);
    });
  });

  describe('getPaymentAccountCode', () => {
    it('should return correct account codes for payment methods', () => {
      expect(accountingService.getPaymentAccountCode('cash')).toBe('100.01');
      expect(accountingService.getPaymentAccountCode('bank_transfer')).toBe('102.01');
      expect(accountingService.getPaymentAccountCode('credit_card')).toBe('108.01');
      expect(accountingService.getPaymentAccountCode('check')).toBe('101.01');
      expect(accountingService.getPaymentAccountCode('unknown')).toBe('100.01');
    });
  });

  describe('getPaymentAccountName', () => {
    it('should return correct account names for payment methods', () => {
      expect(accountingService.getPaymentAccountName('cash')).toBe('Kasa');
      expect(accountingService.getPaymentAccountName('bank_transfer')).toBe('Bankalar');
      expect(accountingService.getPaymentAccountName('credit_card')).toBe('Kredi Kartı Alacakları');
      expect(accountingService.getPaymentAccountName('check')).toBe('Çekler');
      expect(accountingService.getPaymentAccountName('unknown')).toBe('Kasa');
    });
  });
});