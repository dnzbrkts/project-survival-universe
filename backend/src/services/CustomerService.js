'use strict';

const { Customer, Invoice, Payment } = require('../models');
const { Op } = require('sequelize');

/**
 * Cari Hesap Yönetimi Servisi
 * Customer Account Management Service
 */
class CustomerService {
  /**
   * Tüm cari hesapları getir
   * Get all customer accounts
   */
  async getCustomers(options = {}) {
    const {
      page = 1,
      limit = 50,
      search,
      customer_type,
      is_active,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = options;

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
      whereClause.is_active = is_active;
    }

    const result = await Customer.findAndCountAll({
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

    return {
      customers: result.rows,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: result.count,
        total_pages: Math.ceil(result.count / limit)
      }
    };
  }

  /**
   * Cari hesap detayını getir
   * Get customer account details
   */
  async getCustomerById(id) {
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
      throw new Error('Cari hesap bulunamadı');
    }

    return customer;
  }

  /**
   * Yeni cari hesap oluştur
   * Create new customer account
   */
  async createCustomer(customerData) {
    // Müşteri kodu benzersizlik kontrolü
    const existingCustomer = await Customer.findOne({
      where: { customer_code: customerData.customer_code }
    });

    if (existingCustomer) {
      throw new Error('Bu müşteri kodu zaten kullanılıyor');
    }

    // Otomatik müşteri kodu oluşturma (eğer verilmemişse)
    if (!customerData.customer_code) {
      customerData.customer_code = await this.generateCustomerCode(customerData.customer_type);
    }

    const customer = await Customer.create(customerData);
    return customer;
  }

  /**
   * Cari hesap güncelle
   * Update customer account
   */
  async updateCustomer(id, updateData) {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      throw new Error('Cari hesap bulunamadı');
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
        throw new Error('Bu müşteri kodu zaten kullanılıyor');
      }
    }

    await customer.update(updateData);
    return customer;
  }

  /**
   * Cari hesap sil (soft delete)
   * Delete customer account (soft delete)
   */
  async deleteCustomer(id) {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      throw new Error('Cari hesap bulunamadı');
    }

    // Aktif faturası olan müşteriyi silmeyi engelle
    const activeInvoices = await Invoice.count({
      where: {
        customer_id: id,
        status: { [Op.ne]: 'cancelled' }
      }
    });

    if (activeInvoices > 0) {
      throw new Error('Aktif faturası olan cari hesap silinemez');
    }

    await customer.update({ is_active: false });
    return customer;
  }

  /**
   * Cari hesap bakiyesini hesapla
   * Calculate customer account balance
   */
  async getCustomerBalance(id) {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      throw new Error('Cari hesap bulunamadı');
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

    return {
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
    };
  }

  /**
   * Vadesi geçen alacakları getir
   * Get overdue receivables
   */
  async getOverdueReceivables(options = {}) {
    const {
      page = 1,
      limit = 50,
      customer_id,
      days_overdue
    } = options;

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

    const result = await Invoice.findAndCountAll({
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
    const invoicesWithBalance = result.rows.map(invoice => {
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

    return {
      invoices: invoicesWithBalance,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: result.count,
        total_pages: Math.ceil(result.count / limit)
      }
    };
  }

  /**
   * Cari hesap ekstresini getir
   * Get customer account statement
   */
  async getCustomerStatement(id, options = {}) {
    const {
      start_date,
      end_date,
      page = 1,
      limit = 100
    } = options;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      throw new Error('Cari hesap bulunamadı');
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

    return {
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
      },
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: transactions.length,
        total_pages: Math.ceil(transactions.length / limit)
      }
    };
  }

  /**
   * Otomatik müşteri kodu oluştur
   * Generate automatic customer code
   */
  async generateCustomerCode(customerType = 'customer') {
    const prefix = customerType === 'supplier' ? 'SUP' : 'CUS';
    
    // Son müşteri kodunu bul
    const lastCustomer = await Customer.findOne({
      where: {
        customer_code: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['customer_code', 'DESC']]
    });

    let nextNumber = 1;
    if (lastCustomer) {
      const lastNumber = parseInt(lastCustomer.customer_code.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
  }

  /**
   * Cari hesap özet istatistikleri
   * Customer account summary statistics
   */
  async getCustomerStatistics() {
    const [
      totalCustomers,
      totalSuppliers,
      activeCustomers,
      customersWithOverdue,
      customersOverCreditLimit
    ] = await Promise.all([
      Customer.count({ where: { customer_type: { [Op.in]: ['customer', 'both'] } } }),
      Customer.count({ where: { customer_type: { [Op.in]: ['supplier', 'both'] } } }),
      Customer.count({ where: { is_active: true } }),
      this.getCustomersWithOverdueInvoices(),
      this.getCustomersOverCreditLimit()
    ]);

    return {
      total_customers: totalCustomers,
      total_suppliers: totalSuppliers,
      active_customers: activeCustomers,
      customers_with_overdue: customersWithOverdue,
      customers_over_credit_limit: customersOverCreditLimit
    };
  }

  /**
   * Vadesi geçen faturası olan müşteri sayısı
   * Count customers with overdue invoices
   */
  async getCustomersWithOverdueInvoices() {
    const result = await Invoice.findAll({
      where: {
        due_date: { [Op.lt]: new Date() },
        payment_status: { [Op.ne]: 'paid' },
        status: { [Op.ne]: 'cancelled' },
        invoice_type: 'sales'
      },
      attributes: ['customer_id'],
      group: ['customer_id']
    });

    return result.length;
  }

  /**
   * Kredi limitini aşan müşteri sayısı
   * Count customers over credit limit
   */
  async getCustomersOverCreditLimit() {
    const customers = await Customer.findAll({
      where: {
        is_active: true,
        credit_limit: { [Op.gt]: 0 }
      }
    });

    let count = 0;
    for (const customer of customers) {
      const isOverLimit = await customer.isCreditLimitExceeded();
      if (isOverLimit) {
        count++;
      }
    }

    return count;
  }

  /**
   * Dashboard için cari hesap özeti
   * Customer account summary for dashboard
   */
  async getDashboardSummary() {
    const statistics = await this.getCustomerStatistics();
    
    // Son eklenen müşteriler
    const recentCustomers = await Customer.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'customer_code', 'company_name', 'created_at']
    });

    // En yüksek bakiyeli müşteriler
    const customersWithBalance = await Customer.findAll({
      limit: 10,
      include: [
        {
          model: Invoice,
          as: 'invoices',
          attributes: ['total_amount', 'invoice_type'],
          required: false
        }
      ]
    });

    // Bakiye hesapla ve sırala
    const balancePromises = customersWithBalance.map(async (customer) => {
      const balance = await customer.getCurrentBalance();
      return {
        id: customer.id,
        customer_code: customer.customer_code,
        company_name: customer.company_name,
        balance: balance
      };
    });

    const balances = await Promise.all(balancePromises);
    const topBalances = balances
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);

    return {
      statistics,
      recent_customers: recentCustomers,
      top_balances: topBalances
    };
  }
}

module.exports = CustomerService;