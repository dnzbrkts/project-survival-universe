'use strict';

const { Customer, Invoice, Payment } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

/**
 * Cari Hesap Yönetimi Controller
 * Customer Account Management Controller
 */
class CustomerController {
  /**
   * Tüm cari hesapları listele
   * List all customer accounts
   */
  async getCustomers(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        search,
        customer_type,
        is_active,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Arama filtresi
      if (search) {
        whereClause[Op.or] = [
          { customer_code: { [Op.iLike]: `%${search}%` } },
          { company_name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Müşteri tipi filtresi
      if (customer_type) {
        whereClause.customer_type = customer_type;
      }

      // Aktiflik durumu filtresi
      if (is_active !== undefined) {
        whereClause.is_active = is_active === 'true';
      }

      const customers = await Customer.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order.toUpperCase()]],
        include: [
          {
            model: Invoice,
            as: 'invoices',
            attributes: ['id', 'total_amount', 'invoice_type', 'payment_status'],
            required: false
          }
        ]
      });

      // Her müşteri için bakiye hesapla
      const customersWithBalance = await Promise.all(
        customers.rows.map(async (customer) => {
          const balance = await customer.getCurrentBalance();
          return {
            ...customer.toJSON(),
            current_balance: balance
          };
        })
      );

      res.json({
        success: true,
        data: customersWithBalance,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: customers.count,
          total_pages: Math.ceil(customers.count / limit)
        }
      });

    } catch (error) {
      console.error('Cari hesap listesi hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Cari hesaplar listelenirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Cari hesap detayını getir
   * Get customer account details
   */
  async getCustomer(req, res) {
    try {
      const { id } = req.params;

      const customer = await Customer.findByPk(id, {
        include: [
          {
            model: Invoice,
            as: 'invoices',
            include: [
              {
                model: Payment,
                as: 'payments',
                required: false
              }
            ]
          },
          {
            model: Payment,
            as: 'payments'
          }
        ]
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Cari hesap bulunamadı'
        });
      }

      // Bakiye hesapla
      const currentBalance = await customer.getCurrentBalance();
      
      // Vadesi geçen faturalar
      const overdueInvoices = await customer.getOverdueInvoices();
      
      // Kredi limiti kontrolü
      const isCreditLimitExceeded = await customer.isCreditLimitExceeded();

      res.json({
        success: true,
        data: {
          ...customer.toJSON(),
          current_balance: currentBalance,
          overdue_invoices_count: overdueInvoices.length,
          is_credit_limit_exceeded: isCreditLimitExceeded
        }
      });

    } catch (error) {
      console.error('Cari hesap detay hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Cari hesap detayı getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Yeni cari hesap oluştur
   * Create new customer account
   */
  async createCustomer(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const {
        customer_code,
        company_name,
        customer_type,
        tax_number,
        tax_office,
        address,
        phone,
        email,
        contact_person,
        payment_terms = 30,
        credit_limit = 0
      } = req.body;

      // Müşteri kodu benzersizlik kontrolü
      const existingCustomer = await Customer.findOne({
        where: { customer_code }
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Bu müşteri kodu zaten kullanılıyor'
        });
      }

      const customer = await Customer.create({
        customer_code,
        company_name,
        customer_type,
        tax_number,
        tax_office,
        address,
        phone,
        email,
        contact_person,
        payment_terms,
        credit_limit
      });

      res.status(201).json({
        success: true,
        message: 'Cari hesap başarıyla oluşturuldu',
        data: customer
      });

    } catch (error) {
      console.error('Cari hesap oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Cari hesap oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Cari hesap güncelle
   * Update customer account
   */
  async updateCustomer(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Cari hesap bulunamadı'
        });
      }

      // Müşteri kodu değiştiriliyorsa benzersizlik kontrolü
      if (updateData.customer_code && updateData.customer_code !== customer.customer_code) {
        const existingCustomer = await Customer.findOne({
          where: { 
            customer_code: updateData.customer_code,
            id: { [Op.ne]: id }
          }
        });

        if (existingCustomer) {
          return res.status(400).json({
            success: false,
            message: 'Bu müşteri kodu zaten kullanılıyor'
          });
        }
      }

      await customer.update(updateData);

      res.json({
        success: true,
        message: 'Cari hesap başarıyla güncellendi',
        data: customer
      });

    } catch (error) {
      console.error('Cari hesap güncelleme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Cari hesap güncellenirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Cari hesap sil (soft delete)
   * Delete customer account (soft delete)
   */
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Cari hesap bulunamadı'
        });
      }

      // Aktif faturası olan müşteriyi silmeyi engelle
      const activeInvoices = await Invoice.count({
        where: {
          customer_id: id,
          status: { [Op.ne]: 'cancelled' }
        }
      });

      if (activeInvoices > 0) {
        return res.status(400).json({
          success: false,
          message: 'Aktif faturası olan cari hesap silinemez'
        });
      }

      await customer.update({ is_active: false });

      res.json({
        success: true,
        message: 'Cari hesap başarıyla silindi'
      });

    } catch (error) {
      console.error('Cari hesap silme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Cari hesap silinirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Cari hesap bakiyesini getir
   * Get customer account balance
   */
  async getCustomerBalance(req, res) {
    try {
      const { id } = req.params;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Cari hesap bulunamadı'
        });
      }

      const currentBalance = await customer.getCurrentBalance();
      const overdueInvoices = await customer.getOverdueInvoices();
      const isCreditLimitExceeded = await customer.isCreditLimitExceeded();

      // Detaylı bakiye bilgileri
      const invoices = await customer.getInvoices({
        where: { status: { [Op.ne]: 'cancelled' } }
      });
      
      const payments = await customer.getPayments();

      const salesInvoices = invoices.filter(inv => inv.invoice_type === 'sales');
      const purchaseInvoices = invoices.filter(inv => inv.invoice_type === 'purchase');

      const totalSales = salesInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
      const totalPurchases = purchaseInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
      const totalPayments = payments.reduce((sum, pay) => sum + parseFloat(pay.amount), 0);

      res.json({
        success: true,
        data: {
          customer_id: id,
          customer_code: customer.customer_code,
          company_name: customer.company_name,
          current_balance: currentBalance,
          credit_limit: customer.credit_limit,
          available_credit: customer.credit_limit - currentBalance,
          is_credit_limit_exceeded: isCreditLimitExceeded,
          overdue_invoices_count: overdueInvoices.length,
          summary: {
            total_sales: totalSales,
            total_purchases: totalPurchases,
            total_payments: totalPayments,
            net_balance: totalSales - totalPurchases - totalPayments
          }
        }
      });

    } catch (error) {
      console.error('Cari hesap bakiye hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Cari hesap bakiyesi getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Vadesi geçen alacakları getir
   * Get overdue receivables
   */
  async getOverdueReceivables(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        customer_id,
        days_overdue
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {
        due_date: { [Op.lt]: new Date() },
        payment_status: { [Op.ne]: 'paid' },
        status: { [Op.ne]: 'cancelled' },
        invoice_type: 'sales'
      };

      if (customer_id) {
        whereClause.customer_id = customer_id;
      }

      if (days_overdue) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(days_overdue));
        whereClause.due_date = { [Op.lt]: daysAgo };
      }

      const overdueInvoices = await Invoice.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['due_date', 'ASC']],
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'customer_code', 'company_name', 'phone', 'email']
          },
          {
            model: Payment,
            as: 'payments',
            required: false
          }
        ]
      });

      // Her fatura için kalan borç miktarını hesapla
      const invoicesWithBalance = overdueInvoices.rows.map(invoice => {
        const totalPaid = invoice.payments.reduce((sum, payment) => 
          sum + parseFloat(payment.amount), 0);
        const remainingAmount = parseFloat(invoice.total_amount) - totalPaid;
        const daysOverdue = Math.floor((new Date() - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24));

        return {
          ...invoice.toJSON(),
          remaining_amount: remainingAmount,
          days_overdue: daysOverdue
        };
      });

      res.json({
        success: true,
        data: invoicesWithBalance,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: overdueInvoices.count,
          total_pages: Math.ceil(overdueInvoices.count / limit)
        }
      });

    } catch (error) {
      console.error('Vadesi geçen alacaklar hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Vadesi geçen alacaklar getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Dashboard için cari hesap özeti
   * Customer account summary for dashboard
   */
  async getDashboardSummary(req, res) {
    try {
      const customerService = new (require('../services/CustomerService'))();
      const summary = await customerService.getDashboardSummary();

      res.json({
        success: true,
        data: summary
      });

    } catch (error) {
      console.error('Dashboard özet hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Dashboard özeti getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Kredi limiti uyarıları
   * Credit limit alerts
   */
  async getCreditLimitAlerts(req, res) {
    try {
      const customerService = new (require('../services/CustomerService'))();
      
      // Kredi limitini aşan müşterileri getir
      const customers = await customerService.getCustomers({ 
        is_active: true,
        limit: 100 
      });

      const alerts = [];
      
      for (const customer of customers.customers) {
        if (customer.credit_limit > 0) {
          const balance = await customer.getCurrentBalance();
          if (balance > customer.credit_limit) {
            alerts.push({
              customer_id: customer.id,
              customer_code: customer.customer_code,
              company_name: customer.company_name,
              current_balance: balance,
              credit_limit: customer.credit_limit,
              excess_amount: balance - customer.credit_limit
            });
          }
        }
      }

      res.json({
        success: true,
        data: alerts.slice(0, 10), // İlk 10 uyarı
        total: alerts.length
      });

    } catch (error) {
      console.error('Kredi limiti uyarıları hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Kredi limiti uyarıları getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  /**
   * Cari hesap ekstresini getir
   * Get customer account statement
   */
  async getCustomerStatement(req, res) {
    try {
      const { id } = req.params;
      const {
        start_date,
        end_date,
        page = 1,
        limit = 100
      } = req.query;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Cari hesap bulunamadı'
        });
      }

      const offset = (page - 1) * limit;
      const whereClause = { customer_id: id };

      // Tarih aralığı filtresi
      if (start_date || end_date) {
        whereClause.created_at = {};
        if (start_date) {
          whereClause.created_at[Op.gte] = new Date(start_date);
        }
        if (end_date) {
          whereClause.created_at[Op.lte] = new Date(end_date);
        }
      }

      // Faturalar ve ödemeler
      const [invoices, payments] = await Promise.all([
        Invoice.findAll({
          where: whereClause,
          order: [['created_at', 'ASC']]
        }),
        Payment.findAll({
          where: whereClause,
          order: [['created_at', 'ASC']]
        })
      ]);

      // Tüm işlemleri birleştir ve tarihe göre sırala
      const transactions = [];

      invoices.forEach(invoice => {
        transactions.push({
          type: 'invoice',
          date: invoice.created_at,
          reference: invoice.invoice_number,
          description: `${invoice.invoice_type === 'sales' ? 'Satış' : 'Alış'} Faturası`,
          debit: invoice.invoice_type === 'sales' ? parseFloat(invoice.total_amount) : 0,
          credit: invoice.invoice_type === 'purchase' ? parseFloat(invoice.total_amount) : 0,
          balance: 0, // Hesaplanacak
          details: invoice
        });
      });

      payments.forEach(payment => {
        transactions.push({
          type: 'payment',
          date: payment.created_at,
          reference: payment.payment_number,
          description: 'Ödeme',
          debit: 0,
          credit: parseFloat(payment.amount),
          balance: 0, // Hesaplanacak
          details: payment
        });
      });

      // Tarihe göre sırala
      transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Bakiye hesapla
      let runningBalance = 0;
      transactions.forEach(transaction => {
        runningBalance += transaction.debit - transaction.credit;
        transaction.balance = runningBalance;
      });

      // Sayfalama uygula
      const paginatedTransactions = transactions.slice(offset, offset + parseInt(limit));

      res.json({
        success: true,
        data: {
          customer: {
            id: customer.id,
            customer_code: customer.customer_code,
            company_name: customer.company_name
          },
          transactions: paginatedTransactions,
          summary: {
            opening_balance: 0, // İlk işlem öncesi bakiye
            closing_balance: runningBalance,
            total_debit: transactions.reduce((sum, t) => sum + t.debit, 0),
            total_credit: transactions.reduce((sum, t) => sum + t.credit, 0)
          }
        },
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: transactions.length,
          total_pages: Math.ceil(transactions.length / limit)
        }
      });

    } catch (error) {
      console.error('Cari hesap ekstresi hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Cari hesap ekstresi getirilirken hata oluştu',
        error: error.message
      });
    }
  }
}

module.exports = new CustomerController();