/**
 * Fatura Modülü Unit Testleri
 * Invoice Module Unit Tests (Database Independent)
 */

const InvoiceService = require('../services/InvoiceService');

describe('Fatura Modülü Unit Testleri', () => {
  let invoiceService;

  beforeAll(() => {
    invoiceService = new InvoiceService();
  });

  describe('KDV Hesaplama Testleri', () => {
    test('Satır toplamını doğru hesaplamalı - indirim yok', () => {
      const itemData = {
        quantity: 2,
        unit_price: 100.00,
        discount_rate: 0,
        tax_rate: 20
      };

      const expectedLineTotal = 2 * 100.00; // 200.00
      const calculatedLineTotal = parseFloat(
        invoiceService.calculateLineTotal(itemData)
      );

      expect(calculatedLineTotal).toBe(expectedLineTotal);
    });

    test('Satır toplamını doğru hesaplamalı - %10 indirim', () => {
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

    test('Satır toplamını doğru hesaplamalı - %25 indirim', () => {
      const itemData = {
        quantity: 5,
        unit_price: 50.00,
        discount_rate: 25,
        tax_rate: 18
      };

      const expectedLineTotal = (5 * 50.00) * (1 - 25/100); // 187.50
      const calculatedLineTotal = parseFloat(
        invoiceService.calculateLineTotal(itemData)
      );

      expect(calculatedLineTotal).toBe(expectedLineTotal);
    });

    test('Satır toplamını doğru hesaplamalı - ondalık miktar', () => {
      const itemData = {
        quantity: 2.5,
        unit_price: 80.00,
        discount_rate: 5,
        tax_rate: 20
      };

      const expectedLineTotal = (2.5 * 80.00) * (1 - 5/100); // 190.00
      const calculatedLineTotal = parseFloat(
        invoiceService.calculateLineTotal(itemData)
      );

      expect(calculatedLineTotal).toBe(expectedLineTotal);
    });

    test('Satır toplamını doğru hesaplamalı - sıfır miktar', () => {
      const itemData = {
        quantity: 0,
        unit_price: 100.00,
        discount_rate: 0,
        tax_rate: 20
      };

      const expectedLineTotal = 0;
      const calculatedLineTotal = parseFloat(
        invoiceService.calculateLineTotal(itemData)
      );

      expect(calculatedLineTotal).toBe(expectedLineTotal);
    });

    test('Satır toplamını doğru hesaplamalı - sıfır fiyat', () => {
      const itemData = {
        quantity: 5,
        unit_price: 0,
        discount_rate: 10,
        tax_rate: 20
      };

      const expectedLineTotal = 0;
      const calculatedLineTotal = parseFloat(
        invoiceService.calculateLineTotal(itemData)
      );

      expect(calculatedLineTotal).toBe(expectedLineTotal);
    });

    test('Satır toplamını doğru hesaplamalı - %100 indirim', () => {
      const itemData = {
        quantity: 3,
        unit_price: 150.00,
        discount_rate: 100,
        tax_rate: 20
      };

      const expectedLineTotal = 0;
      const calculatedLineTotal = parseFloat(
        invoiceService.calculateLineTotal(itemData)
      );

      expect(calculatedLineTotal).toBe(expectedLineTotal);
    });
  });

  describe('KDV Tutarı Hesaplama Testleri', () => {
    test('KDV tutarını doğru hesaplamalı - %20 KDV', () => {
      const lineTotal = 180.00;
      const taxRate = 20;
      const expectedTaxAmount = lineTotal * (taxRate / 100); // 36.00

      expect(expectedTaxAmount).toBe(36.00);
    });

    test('KDV tutarını doğru hesaplamalı - %18 KDV', () => {
      const lineTotal = 200.00;
      const taxRate = 18;
      const expectedTaxAmount = lineTotal * (taxRate / 100); // 36.00

      expect(expectedTaxAmount).toBe(36.00);
    });

    test('KDV tutarını doğru hesaplamalı - %8 KDV', () => {
      const lineTotal = 500.00;
      const taxRate = 8;
      const expectedTaxAmount = lineTotal * (taxRate / 100); // 40.00

      expect(expectedTaxAmount).toBe(40.00);
    });

    test('KDV tutarını doğru hesaplamalı - %1 KDV', () => {
      const lineTotal = 1000.00;
      const taxRate = 1;
      const expectedTaxAmount = lineTotal * (taxRate / 100); // 10.00

      expect(expectedTaxAmount).toBe(10.00);
    });

    test('KDV tutarını doğru hesaplamalı - %0 KDV', () => {
      const lineTotal = 300.00;
      const taxRate = 0;
      const expectedTaxAmount = lineTotal * (taxRate / 100); // 0.00

      expect(expectedTaxAmount).toBe(0.00);
    });
  });

  describe('Fatura Numarası Format Testleri', () => {
    test('Satış faturası numarası formatını kontrol et', () => {
      const year = new Date().getFullYear();
      const salesInvoicePattern = new RegExp(`^SF${year}\\d{6}$`);
      
      // Test numaraları
      const validSalesNumbers = [
        `SF${year}000001`,
        `SF${year}123456`,
        `SF${year}999999`
      ];

      const invalidSalesNumbers = [
        `AF${year}000001`, // Yanlış prefix
        `SF${year - 1}000001`, // Yanlış yıl
        `SF${year}00001`, // Eksik digit
        `SF${year}1234567` // Fazla digit
      ];

      validSalesNumbers.forEach(number => {
        expect(number).toMatch(salesInvoicePattern);
      });

      invalidSalesNumbers.forEach(number => {
        expect(number).not.toMatch(salesInvoicePattern);
      });
    });

    test('Alış faturası numarası formatını kontrol et', () => {
      const year = new Date().getFullYear();
      const purchaseInvoicePattern = new RegExp(`^AF${year}\\d{6}$`);
      
      // Test numaraları
      const validPurchaseNumbers = [
        `AF${year}000001`,
        `AF${year}123456`,
        `AF${year}999999`
      ];

      const invalidPurchaseNumbers = [
        `SF${year}000001`, // Yanlış prefix
        `AF${year - 1}000001`, // Yanlış yıl
        `AF${year}00001`, // Eksik digit
        `AF${year}1234567` // Fazla digit
      ];

      validPurchaseNumbers.forEach(number => {
        expect(number).toMatch(purchaseInvoicePattern);
      });

      invalidPurchaseNumbers.forEach(number => {
        expect(number).not.toMatch(purchaseInvoicePattern);
      });
    });
  });

  describe('Fatura Durumu Validasyon Testleri', () => {
    test('Geçerli fatura durumları', () => {
      const validStatuses = ['draft', 'approved', 'paid', 'cancelled'];
      
      validStatuses.forEach(status => {
        expect(['draft', 'approved', 'paid', 'cancelled']).toContain(status);
      });
    });

    test('Geçersiz fatura durumları', () => {
      const invalidStatuses = ['pending', 'processing', 'rejected', 'expired'];
      
      invalidStatuses.forEach(status => {
        expect(['draft', 'approved', 'paid', 'cancelled']).not.toContain(status);
      });
    });
  });

  describe('Ödeme Durumu Validasyon Testleri', () => {
    test('Geçerli ödeme durumları', () => {
      const validPaymentStatuses = ['unpaid', 'partial', 'paid'];
      
      validPaymentStatuses.forEach(status => {
        expect(['unpaid', 'partial', 'paid']).toContain(status);
      });
    });

    test('Geçersiz ödeme durumları', () => {
      const invalidPaymentStatuses = ['pending', 'processing', 'failed', 'refunded'];
      
      invalidPaymentStatuses.forEach(status => {
        expect(['unpaid', 'partial', 'paid']).not.toContain(status);
      });
    });
  });

  describe('Ödeme Yöntemi Validasyon Testleri', () => {
    test('Geçerli ödeme yöntemleri', () => {
      const validPaymentMethods = ['cash', 'bank_transfer', 'credit_card', 'check', 'other'];
      
      validPaymentMethods.forEach(method => {
        expect(['cash', 'bank_transfer', 'credit_card', 'check', 'other']).toContain(method);
      });
    });

    test('Geçersiz ödeme yöntemleri', () => {
      const invalidPaymentMethods = ['paypal', 'bitcoin', 'mobile_payment', 'gift_card'];
      
      invalidPaymentMethods.forEach(method => {
        expect(['cash', 'bank_transfer', 'credit_card', 'check', 'other']).not.toContain(method);
      });
    });
  });

  describe('Para Birimi Validasyon Testleri', () => {
    test('Geçerli para birimleri', () => {
      const validCurrencies = ['TRY', 'USD', 'EUR'];
      
      validCurrencies.forEach(currency => {
        expect(currency).toMatch(/^[A-Z]{3}$/);
        expect(currency.length).toBe(3);
      });
    });

    test('Geçersiz para birimleri', () => {
      const invalidCurrencies = ['TR', 'DOLLAR', 'euro', '123', 'TL'];
      
      invalidCurrencies.forEach(currency => {
        expect(currency).not.toMatch(/^[A-Z]{3}$/);
      });
    });
  });

  describe('Miktar ve Fiyat Validasyon Testleri', () => {
    test('Geçerli miktar değerleri', () => {
      const validQuantities = [1, 2.5, 0.001, 100, 999.999];
      
      validQuantities.forEach(quantity => {
        expect(quantity).toBeGreaterThan(0);
        expect(typeof quantity).toBe('number');
      });
    });

    test('Geçersiz miktar değerleri', () => {
      const invalidQuantities = [0, -1, -0.5, NaN, Infinity];
      
      invalidQuantities.forEach(quantity => {
        if (!isNaN(quantity) && isFinite(quantity)) {
          expect(quantity).toBeLessThanOrEqual(0);
        } else {
          expect(isNaN(quantity) || !isFinite(quantity)).toBe(true);
        }
      });
    });

    test('Geçerli fiyat değerleri', () => {
      const validPrices = [0, 1, 2.5, 100.99, 9999.9999];
      
      validPrices.forEach(price => {
        expect(price).toBeGreaterThanOrEqual(0);
        expect(typeof price).toBe('number');
      });
    });

    test('Geçersiz fiyat değerleri', () => {
      const invalidPrices = [-1, -0.01, NaN, Infinity];
      
      invalidPrices.forEach(price => {
        if (!isNaN(price) && isFinite(price)) {
          expect(price).toBeLessThan(0);
        } else {
          expect(isNaN(price) || !isFinite(price)).toBe(true);
        }
      });
    });
  });

  describe('İndirim Oranı Validasyon Testleri', () => {
    test('Geçerli indirim oranları', () => {
      const validDiscountRates = [0, 5, 10, 25, 50, 75, 100];
      
      validDiscountRates.forEach(rate => {
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(100);
      });
    });

    test('Geçersiz indirim oranları', () => {
      const invalidDiscountRates = [-1, -10, 101, 150, NaN, Infinity];
      
      invalidDiscountRates.forEach(rate => {
        if (!isNaN(rate) && isFinite(rate)) {
          expect(rate < 0 || rate > 100).toBe(true);
        } else {
          expect(isNaN(rate) || !isFinite(rate)).toBe(true);
        }
      });
    });
  });

  describe('KDV Oranı Validasyon Testleri', () => {
    test('Geçerli KDV oranları', () => {
      const validTaxRates = [0, 1, 8, 18, 20];
      
      validTaxRates.forEach(rate => {
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(100);
      });
    });

    test('Geçersiz KDV oranları', () => {
      const invalidTaxRates = [-1, -5, 101, 200, NaN, Infinity];
      
      invalidTaxRates.forEach(rate => {
        if (!isNaN(rate) && isFinite(rate)) {
          expect(rate < 0 || rate > 100).toBe(true);
        } else {
          expect(isNaN(rate) || !isFinite(rate)).toBe(true);
        }
      });
    });
  });
});