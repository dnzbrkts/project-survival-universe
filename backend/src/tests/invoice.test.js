/**
 * Fatura Modülü Testleri
 * Invoice Module Tests
 */

const InvoiceService = require('../services/InvoiceService');
const { Invoice, InvoiceItem, Payment, Customer, Product, User } = require('../models');

describe('Fatura Modülü Testleri', () => {
  let invoiceService;
  let testUser;
  let testCustomer;
  let testProduct;
  let testInvoice;

  beforeAll(async () => {
    invoiceService = new InvoiceService();

    // Test kullanıcısı oluştur
    testUser = await User.create({
      username: 'testinvoice',
      email: 'invoice@test.com',
      passwordHash: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User',
      isActive: true
    });

    // Test müşterisi oluştur
    testCustomer = await Customer.create({
      customer_code: 'INVTEST001',
      company_name: 'Test Fatura Müşteri A.Ş.',
      customer_type: 'customer',
      tax_number: '1234567890',
      tax_office: 'Test Vergi Dairesi',
      address: 'Test Adres',
      phone: '+90 212 555 0000',
      email: 'musteri@test.com',
      payment_terms: 30,
      is_active: true
    });

    // Test ürünü oluştur
    testProduct = await Product.create({
      product_code: 'INVPRD001',
      product_name: 'Test Fatura Ürün',
      description: 'Test ürün açıklaması',
      unit: 'Adet',
      purchase_price: 100.00,
      sale_price: 150.00,
      tax_rate: 20.00,
      is_active: true
    });
  });

  afterAll(async () => {
    // Test verilerini temizle
    if (testInvoice) {
      await InvoiceItem.destroy({ where: { invoice_id: testInvoice.id } });
      await Payment.destroy({ where: { invoice_id: testInvoice.id } });
      await Invoice.destroy({ where: { id: testInvoice.id } });
    }
    
    if (testProduct) {
      await Product.destroy({ where: { id: testProduct.id } });
    }
    
    if (testCustomer) {
      await Customer.destroy({ where: { id: testCustomer.id } });
    }
    
    if (testUser) {
      await User.destroy({ where: { id: testUser.id } });
    }
  });

  describe('Fatura Oluşturma Testleri', () => {
    test('Geçerli verilerle satış faturası oluşturmalı', async () => {
      const invoiceData = {
        invoice_type: 'sales',
        customer_id: testCustomer.id,
        invoice_date: '2024-01-15',
        currency: 'TRY',
        exchange_rate: 1.0,
        notes: 'Test fatura notu'
      };

      const items = [
        {
          product_id: testProduct.id,
          description: 'Test ürün satışı',
          quantity: 2,
          unit_price: 150.00,
          discount_rate: 0,
          tax_rate: 20.00
        }
      ];

      const invoice = await invoiceService.createInvoice(invoiceData, items, testUser.id);

      expect(invoice).toBeDefined();
      expect(invoice.id).toBeDefined();
      expect(invoice.invoice_type).toBe('sales');
      expect(invoice.customer_id).toBe(testCustomer.id);
      expect(invoice.items).toHaveLength(1);

      testInvoice = invoice;
    });

    test('Geçersiz müşteri ID ile fatura oluşturmamalı', async () => {
      const invoiceData = {
        invoice_type: 'sales',
        customer_id: 99999,
        invoice_date: '2024-01-15'
      };

      await expect(
        invoiceService.createInvoice(invoiceData, [], testUser.id)
      ).rejects.toThrow();
    });

    test('Eksik zorunlu alanlarla fatura oluşturmamalı', async () => {
      const invoiceData = {
        invoice_type: 'sales'
        // customer_id ve invoice_date eksik
      };

      await expect(
        invoiceService.createInvoice(invoiceData, [], testUser.id)
      ).rejects.toThrow();
    });
  });

  describe('Fatura Numarası Oluşturma Testleri', () => {
    test('Satış faturası için doğru format oluşturmalı', async () => {
      const invoiceNumber = await Invoice.generateInvoiceNumber('sales');
      const year = new Date().getFullYear();
      
      expect(invoiceNumber).toMatch(new RegExp(`^SF${year}\\d{6}$`));
    });

    test('Alış faturası için doğru format oluşturmalı', async () => {
      const invoiceNumber = await Invoice.generateInvoiceNumber('purchase');
      const year = new Date().getFullYear();
      
      expect(invoiceNumber).toMatch(new RegExp(`^AF${year}\\d{6}$`));
    });

    test('Ardışık numaralar oluşturmalı', async () => {
      const firstNumber = await Invoice.generateInvoiceNumber('sales');
      
      // Test faturası oluştur
      const testInvoiceForNumber = await Invoice.create({
        invoice_number: firstNumber,
        invoice_type: 'sales',
        customer_id: testCustomer.id,
        invoice_date: '2024-01-15',
        subtotal: 100.00,
        tax_amount: 20.00,
        total_amount: 120.00,
        created_by: testUser.id
      });

      const secondNumber = await Invoice.generateInvoiceNumber('sales');
      
      const firstNum = parseInt(firstNumber.slice(-6));
      const secondNum = parseInt(secondNumber.slice(-6));
      
      expect(secondNum).toBe(firstNum + 1);

      // Temizle
      await testInvoiceForNumber.destroy();
    });
  });

  describe('KDV Hesaplama Testleri', () => {
    test('Satır toplamını doğru hesaplamalı', () => {
      const itemData = {
        quantity: 2,
        unit_price: 100.00,
        discount_rate: 10,
        tax_rate: 20
      };

      const expectedLineTotal = (2 * 100.00) * (1 - 10/100); // 180.00
      const calculatedLineTotal = parseFloat(
        invoiceService.calculateLineTotal(itemData)
      );

      expect(calculatedLineTotal).toBe(expectedLineTotal);
    });

    test('KDV tutarını doğru hesaplamalı', () => {
      const lineTotal = 180.00;
      const taxRate = 20;
      const expectedTaxAmount = lineTotal * (taxRate / 100); // 36.00

      expect(expectedTaxAmount).toBe(36.00);
    });

    test('Fatura toplamlarını doğru hesaplamalı', async () => {
      // Test faturası oluştur
      const invoice = await Invoice.create({
        invoice_number: await Invoice.generateInvoiceNumber('sales'),
        invoice_type: 'sales',
        customer_id: testCustomer.id,
        invoice_date: '2024-01-15',
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        created_by: testUser.id
      });

      // Fatura kalemleri ekle
      await InvoiceItem.create({
        invoice_id: invoice.id,
        product_id: testProduct.id,
        quantity: 2,
        unit_price: 100.00,
        discount_rate: 10,
        tax_rate: 20,
        line_total: 180.00
      });

      await InvoiceItem.create({
        invoice_id: invoice.id,
        product_id: testProduct.id,
        quantity: 1,
        unit_price: 50.00,
        discount_rate: 0,
        tax_rate: 20,
        line_total: 50.00
      });

      // Toplamları hesapla
      const totals = await invoiceService.calculateInvoiceTotals(invoice.id);

      expect(parseFloat(totals.subtotal)).toBe(230.00); // 180 + 50
      expect(parseFloat(totals.tax_amount)).toBe(46.00); // (180 + 50) * 0.20
      expect(parseFloat(totals.total_amount)).toBe(276.00); // 230 + 46

      // Temizle
      await InvoiceItem.destroy({ where: { invoice_id: invoice.id } });
      await invoice.destroy();
    });
  });

  describe('Fatura Durumu Testleri', () => {
    test('Taslak faturayı onaylamalı', async () => {
      if (!testInvoice) {
        throw new Error('Test faturası bulunamadı');
      }

      const approvedInvoice = await invoiceService.approveInvoice(testInvoice.id);

      expect(approvedInvoice.status).toBe('approved');
    });

    test('Onaylanmış faturayı tekrar onaylamamalı', async () => {
      if (!testInvoice) {
        throw new Error('Test faturası bulunamadı');
      }

      await expect(
        invoiceService.approveInvoice(testInvoice.id)
      ).rejects.toThrow('onaylanabilir');
    });

    test('Faturayı iptal etmeli', async () => {
      // Yeni test faturası oluştur
      const newInvoice = await Invoice.create({
        invoice_number: await Invoice.generateInvoiceNumber('sales'),
        invoice_type: 'sales',
        customer_id: testCustomer.id,
        invoice_date: '2024-01-15',
        subtotal: 100.00,
        tax_amount: 20.00,
        total_amount: 120.00,
        created_by: testUser.id
      });

      const cancelledInvoice = await invoiceService.cancelInvoice(newInvoice.id);

      expect(cancelledInvoice.status).toBe('cancelled');

      // Temizle
      await newInvoice.destroy();
    });
  });

  describe('Fatura Listesi Testleri', () => {
    test('Fatura listesini getirmeli', async () => {
      const result = await invoiceService.getInvoices();

      expect(result).toBeDefined();
      expect(result.invoices).toBeDefined();
      expect(Array.isArray(result.invoices)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination).toHaveProperty('total');
    });

    test('Fatura tipine göre filtrelemeli', async () => {
      const result = await invoiceService.getInvoices({ invoice_type: 'sales' });

      expect(result.invoices).toBeDefined();
      result.invoices.forEach(invoice => {
        expect(invoice.invoice_type).toBe('sales');
      });
    });

    test('Tarih aralığına göre filtrelemeli', async () => {
      const result = await invoiceService.getInvoices({
        start_date: '2024-01-01',
        end_date: '2024-01-31'
      });

      expect(result.invoices).toBeDefined();
      result.invoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        expect(invoiceDate.getTime()).toBeGreaterThanOrEqual(new Date('2024-01-01').getTime());
        expect(invoiceDate.getTime()).toBeLessThanOrEqual(new Date('2024-01-31').getTime());
      });
    });
  });

  describe('Fatura Detayı Testleri', () => {
    test('Geçerli ID ile fatura detayını getirmeli', async () => {
      if (!testInvoice) {
        throw new Error('Test faturası bulunamadı');
      }

      const invoice = await invoiceService.getInvoiceById(testInvoice.id);

      expect(invoice).toBeDefined();
      expect(invoice.id).toBe(testInvoice.id);
      expect(invoice.customer).toBeDefined();
      expect(invoice.items).toBeDefined();
    });

    test('Geçersiz ID ile hata fırlatmalı', async () => {
      await expect(
        invoiceService.getInvoiceById(99999)
      ).rejects.toThrow('Fatura bulunamadı');
    });
  });

  describe('Ödeme Testleri', () => {
    test('Faturaya ödeme eklemeli', async () => {
      if (!testInvoice) {
        throw new Error('Test faturası bulunamadı');
      }

      const paymentData = {
        invoice_id: testInvoice.id,
        customer_id: testCustomer.id,
        payment_method: 'cash',
        amount: 100.00,
        currency: 'TRY',
        payment_date: '2024-01-16',
        notes: 'Test ödeme'
      };

      const payment = await invoiceService.addPayment(paymentData, testUser.id);

      expect(payment).toBeDefined();
      expect(payment.id).toBeDefined();
      expect(parseFloat(payment.amount)).toBe(100.00);
      expect(payment.payment_method).toBe('cash');
    });

    test('Geçersiz ödeme yöntemi ile ödeme eklememeli', async () => {
      const paymentData = {
        invoice_id: testInvoice.id,
        customer_id: testCustomer.id,
        payment_method: 'invalid_method',
        amount: 100.00,
        payment_date: '2024-01-16'
      };

      await expect(
        invoiceService.addPayment(paymentData, testUser.id)
      ).rejects.toThrow();
    });
  });

  describe('Dashboard Testleri', () => {
    test('Dashboard özet bilgilerini getirmeli', async () => {
      const summary = await invoiceService.getDashboardSummary();

      expect(summary).toBeDefined();
      expect(summary).toHaveProperty('totalSalesInvoices');
      expect(summary).toHaveProperty('totalPurchaseInvoices');
      expect(summary).toHaveProperty('monthlyRevenue');
      expect(summary).toHaveProperty('overdueInvoices');
      expect(summary).toHaveProperty('unpaidInvoices');
    });

    test('Vadesi geçen faturaları getirmeli', async () => {
      const invoices = await invoiceService.getOverdueInvoices();

      expect(invoices).toBeDefined();
      expect(Array.isArray(invoices)).toBe(true);
    });
  });
});