const request = require('supertest');
const { app } = require('../server');
const { 
  AccountingEntry, 
  AccountingMovement, 
  AccountingAccount,
  User,
  Invoice,
  Customer
} = require('../models');

// Test veritabanı kurulumu
const { setupTestDatabase, cleanupTestDatabase } = require('./helpers/testDatabase');

describe('Accounting API Integration Tests', () => {
  let authToken;
  let testUser;
  let testCustomer;
  let testInvoice;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    // Test kullanıcısı oluştur
    testUser = await User.create({
      username: 'accountant_test',
      email: 'accountant@test.com',
      password_hash: 'hashed_password',
      first_name: 'Test',
      last_name: 'Accountant',
      is_active: true
    });

    // Test müşterisi oluştur
    testCustomer = await Customer.create({
      customer_code: 'CUST001',
      company_name: 'Test Müşteri A.Ş.',
      customer_type: 'customer',
      tax_number: '1234567890',
      is_active: true
    });

    // Test faturası oluştur
    testInvoice = await Invoice.create({
      invoice_number: 'SAT-2024-001',
      invoice_type: 'sales',
      customer_id: testCustomer.id,
      invoice_date: new Date(),
      subtotal: 1000.00,
      tax_amount: 200.00,
      total_amount: 1200.00,
      status: 'approved',
      created_by: testUser.id
    });

    // Auth token oluştur (mock)
    authToken = 'Bearer mock_jwt_token';
  });

  afterEach(async () => {
    // Test verilerini temizle
    await AccountingMovement.destroy({ where: {} });
    await AccountingEntry.destroy({ where: {} });
    await Invoice.destroy({ where: {} });
    await Customer.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('POST /api/accounting/entries', () => {
    it('should create accounting entry successfully', async () => {
      const entryData = {
        description: 'Test muhasebe kaydı',
        total_debit: 1000.00,
        total_credit: 1000.00,
        account_movements: [
          {
            account_code: '100.01',
            account_name: 'Kasa',
            debit_amount: 1000.00,
            credit_amount: 0.00,
            description: 'Kasa girişi'
          },
          {
            account_code: '600.01',
            account_name: 'Satışlar',
            debit_amount: 0.00,
            credit_amount: 1000.00,
            description: 'Satış geliri'
          }
        ]
      };

      const response = await request(app)
        .post('/api/accounting/entries')
        .set('Authorization', authToken)
        .send(entryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('entry_number');
      expect(response.body.data.description).toBe(entryData.description);

      // Veritabanında kayıt kontrolü
      const entry = await AccountingEntry.findByPk(response.body.data.id, {
        include: [{ model: AccountingMovement, as: 'movements' }]
      });

      expect(entry).toBeTruthy();
      expect(entry.movements).toHaveLength(2);
      expect(entry.total_debit).toBe('1000.0000');
      expect(entry.total_credit).toBe('1000.0000');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        description: '', // Boş açıklama
        total_debit: -100, // Negatif tutar
        account_movements: [] // Boş hareketler
      };

      const response = await request(app)
        .post('/api/accounting/entries')
        .set('Authorization', authToken)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return unauthorized without token', async () => {
      const entryData = {
        description: 'Test entry',
        total_debit: 1000,
        total_credit: 1000,
        account_movements: []
      };

      await request(app)
        .post('/api/accounting/entries')
        .send(entryData)
        .expect(401);
    });
  });

  describe('GET /api/accounting/entries', () => {
    beforeEach(async () => {
      // Test muhasebe kayıtları oluştur
      const entry1 = await AccountingEntry.create({
        entry_number: 'YEV2024110001',
        entry_date: new Date('2024-11-01'),
        description: 'Test entry 1',
        total_debit: 1000,
        total_credit: 1000,
        created_by: testUser.id
      });

      const entry2 = await AccountingEntry.create({
        entry_number: 'YEV2024110002',
        entry_date: new Date('2024-11-02'),
        description: 'Test entry 2',
        total_debit: 2000,
        total_credit: 2000,
        created_by: testUser.id
      });

      // Hareketler ekle
      await AccountingMovement.bulkCreate([
        {
          accounting_entry_id: entry1.id,
          account_code: '100.01',
          account_name: 'Kasa',
          debit_amount: 1000,
          credit_amount: 0
        },
        {
          accounting_entry_id: entry1.id,
          account_code: '600.01',
          account_name: 'Satışlar',
          debit_amount: 0,
          credit_amount: 1000
        }
      ]);
    });

    it('should get accounting entries list', async () => {
      const response = await request(app)
        .get('/api/accounting/entries')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.entries).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should filter entries by date range', async () => {
      const response = await request(app)
        .get('/api/accounting/entries')
        .query({
          start_date: '2024-11-01',
          end_date: '2024-11-01'
        })
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.entries).toHaveLength(1);
      expect(response.body.data.entries[0].entry_date).toBe('2024-11-01');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/accounting/entries')
        .query({
          page: 1,
          limit: 1
        })
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.entries).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });
  });

  describe('POST /api/accounting/entries/automatic/invoice/:id', () => {
    it('should create automatic entry for sales invoice', async () => {
      const response = await request(app)
        .post(`/api/accounting/entries/automatic/invoice/${testInvoice.id}`)
        .set('Authorization', authToken)
        .send({})
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');

      // Oluşturulan kayıt kontrolü
      const entry = await AccountingEntry.findByPk(response.body.data.id, {
        include: [{ model: AccountingMovement, as: 'movements' }]
      });

      expect(entry.reference_type).toBe('invoice');
      expect(entry.reference_id).toBe(testInvoice.id);
      expect(entry.movements).toHaveLength(3); // Alıcılar, Satışlar, KDV
      
      // Borç-alacak dengesi kontrolü
      const totalDebit = entry.movements.reduce((sum, m) => sum + parseFloat(m.debit_amount), 0);
      const totalCredit = entry.movements.reduce((sum, m) => sum + parseFloat(m.credit_amount), 0);
      expect(totalDebit).toBe(totalCredit);
    });

    it('should return error for non-existent invoice', async () => {
      const response = await request(app)
        .post('/api/accounting/entries/automatic/invoice/99999')
        .set('Authorization', authToken)
        .send({})
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('bulunamadı');
    });
  });

  describe('GET /api/accounting/reports/balance-sheet', () => {
    beforeEach(async () => {
      // Test hesapları oluştur
      await AccountingAccount.bulkCreate([
        {
          account_code: '100.01',
          account_name: 'Kasa',
          account_type: 'asset',
          account_level: 3,
          normal_balance: 'debit',
          is_active: true
        },
        {
          account_code: '320.01',
          account_name: 'Satıcılar',
          account_type: 'liability',
          account_level: 3,
          normal_balance: 'credit',
          is_active: true
        }
      ]);

      // Test muhasebe kaydı oluştur
      const entry = await AccountingEntry.create({
        entry_number: 'YEV2024110001',
        entry_date: new Date(),
        description: 'Test balance sheet entry',
        total_debit: 1000,
        total_credit: 1000,
        created_by: testUser.id
      });

      await AccountingMovement.bulkCreate([
        {
          accounting_entry_id: entry.id,
          account_code: '100.01',
          account_name: 'Kasa',
          debit_amount: 1000,
          credit_amount: 0
        },
        {
          accounting_entry_id: entry.id,
          account_code: '320.01',
          account_name: 'Satıcılar',
          debit_amount: 0,
          credit_amount: 1000
        }
      ]);
    });

    it('should generate balance sheet', async () => {
      const response = await request(app)
        .get('/api/accounting/reports/balance-sheet')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('assets');
      expect(response.body.data).toHaveProperty('liabilities_and_equity');
      expect(response.body.data).toHaveProperty('report_date');
    });

    it('should filter balance sheet by date', async () => {
      const response = await request(app)
        .get('/api/accounting/reports/balance-sheet')
        .query({
          start_date: '2024-11-01',
          end_date: '2024-11-30'
        })
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('assets');
    });
  });

  describe('GET /api/accounting/reports/income-statement', () => {
    beforeEach(async () => {
      // Gelir-gider hesapları oluştur
      await AccountingAccount.bulkCreate([
        {
          account_code: '600.01',
          account_name: 'Satışlar',
          account_type: 'revenue',
          account_level: 3,
          normal_balance: 'credit',
          is_active: true
        },
        {
          account_code: '700.01',
          account_name: 'Personel Giderleri',
          account_type: 'expense',
          account_level: 3,
          normal_balance: 'debit',
          is_active: true
        }
      ]);
    });

    it('should generate income statement', async () => {
      const response = await request(app)
        .get('/api/accounting/reports/income-statement')
        .query({
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        })
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('revenues');
      expect(response.body.data).toHaveProperty('operating_expenses');
      expect(response.body.data).toHaveProperty('gross_profit');
      expect(response.body.data).toHaveProperty('net_profit');
    });
  });

  describe('GET /api/accounting/reports/trial-balance', () => {
    it('should generate trial balance', async () => {
      const response = await request(app)
        .get('/api/accounting/reports/trial-balance')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accounts');
      expect(response.body.data).toHaveProperty('totals');
      expect(response.body.data.totals).toHaveProperty('total_debits');
      expect(response.body.data.totals).toHaveProperty('total_credits');
    });
  });

  describe('GET /api/accounting/account-balances', () => {
    it('should get account balances', async () => {
      const response = await request(app)
        .get('/api/accounting/account-balances')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by account type', async () => {
      const response = await request(app)
        .get('/api/accounting/account-balances')
        .query({ account_type: 'asset' })
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});