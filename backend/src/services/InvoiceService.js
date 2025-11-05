/**
 * Fatura Yönetimi Servisi
 * Invoice Management Service
 */

const { Invoice, InvoiceItem, Payment, Customer, Product, User } = require('../models');
const { Op } = require('sequelize');
const PDFService = require('./PDFService');

class InvoiceService {
  /**
   * Fatura listesi getir
   * @param {Object} filters - Filtreleme parametreleri
   * @returns {Object} Fatura listesi ve sayfalama bilgisi
   */
  async getInvoices(filters = {}) {
    const {
      invoice_type,
      status,
      payment_status,
      customer_id,
      start_date,
      end_date,
      search,
      page = 1,
      limit = 50,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = filters;

    const where = {};
    
    if (invoice_type) {
      where.invoice_type = invoice_type;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (payment_status) {
      where.payment_status = payment_status;
    }
    
    if (customer_id) {
      where.customer_id = customer_id;
    }
    
    if (start_date && end_date) {
      where.invoice_date = {
        [Op.between]: [start_date, end_date]
      };
    } else if (start_date) {
      where.invoice_date = {
        [Op.gte]: start_date
      };
    } else if (end_date) {
      where.invoice_date = {
        [Op.lte]: end_date
      };
    }
    
    if (search) {
      where[Op.or] = [
        { invoice_number: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'customer_code', 'company_name', 'customer_type']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'first_name', 'last_name']
        }
      ],
      order: [[sort_by, sort_order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      invoices: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Fatura detayı getir
   * @param {number} invoiceId - Fatura ID
   * @returns {Object} Fatura detayı
   */
  async getInvoiceById(invoiceId) {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'first_name', 'last_name']
        },
        {
          model: InvoiceItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'product_code', 'product_name', 'unit']
            }
          ]
        },
        {
          model: Payment,
          as: 'payments',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'username', 'first_name', 'last_name']
            }
          ]
        }
      ]
    });

    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    return invoice;
  }

  /**
   * Yeni fatura oluştur
   * @param {Object} invoiceData - Fatura verileri
   * @param {Array} items - Fatura kalemleri
   * @param {number} userId - Oluşturan kullanıcı ID
   * @returns {Object} Oluşturulan fatura
   */
  async createInvoice(invoiceData, items, userId) {
    const transaction = await Invoice.sequelize.transaction();

    try {
      // Fatura numarası oluştur
      if (!invoiceData.invoice_number) {
        invoiceData.invoice_number = await Invoice.generateInvoiceNumber(invoiceData.invoice_type);
      }

      // Vade tarihi hesapla
      if (!invoiceData.due_date && invoiceData.invoice_date) {
        const customer = await Customer.findByPk(invoiceData.customer_id);
        const paymentTerms = customer?.payment_terms || 30;
        const dueDate = new Date(invoiceData.invoice_date);
        dueDate.setDate(dueDate.getDate() + paymentTerms);
        invoiceData.due_date = dueDate.toISOString().split('T')[0];
      }

      // Fatura oluştur
      const invoice = await Invoice.create({
        ...invoiceData,
        created_by: userId,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0
      }, { transaction });

      // Fatura kalemlerini oluştur
      if (items && items.length > 0) {
        const invoiceItems = items.map(item => ({
          ...item,
          invoice_id: invoice.id,
          line_total: this.calculateLineTotal(item)
        }));

        await InvoiceItem.bulkCreate(invoiceItems, { transaction });
      }

      // Toplamları hesapla ve güncelle
      const totals = await this.calculateInvoiceTotals(invoice.id, transaction);
      await invoice.update(totals, { transaction });

      await transaction.commit();

      return await this.getInvoiceById(invoice.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Fatura güncelle
   * @param {number} invoiceId - Fatura ID
   * @param {Object} invoiceData - Güncellenecek fatura verileri
   * @returns {Object} Güncellenmiş fatura
   */
  async updateInvoice(invoiceId, invoiceData) {
    const invoice = await Invoice.findByPk(invoiceId);
    
    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    if (invoice.status === 'approved' || invoice.status === 'paid') {
      throw new Error('Onaylanmış veya ödenmiş fatura güncellenemez');
    }

    await invoice.update(invoiceData);
    return await this.getInvoiceById(invoiceId);
  }

  /**
   * Fatura sil
   * @param {number} invoiceId - Fatura ID
   */
  async deleteInvoice(invoiceId) {
    const invoice = await Invoice.findByPk(invoiceId);
    
    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    if (invoice.status === 'approved' || invoice.status === 'paid') {
      throw new Error('Onaylanmış veya ödenmiş fatura silinemez');
    }

    const transaction = await Invoice.sequelize.transaction();

    try {
      // Fatura kalemlerini sil
      await InvoiceItem.destroy({
        where: { invoice_id: invoiceId },
        transaction
      });

      // Faturayı sil
      await invoice.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Fatura onayla
   * @param {number} invoiceId - Fatura ID
   * @returns {Object} Onaylanmış fatura
   */
  async approveInvoice(invoiceId) {
    const invoice = await Invoice.findByPk(invoiceId);
    
    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    if (invoice.status !== 'draft') {
      throw new Error('Sadece taslak faturalar onaylanabilir');
    }

    await invoice.update({ status: 'approved' });
    return await this.getInvoiceById(invoiceId);
  }

  /**
   * Fatura iptal et
   * @param {number} invoiceId - Fatura ID
   * @returns {Object} İptal edilmiş fatura
   */
  async cancelInvoice(invoiceId) {
    const invoice = await Invoice.findByPk(invoiceId);
    
    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    if (invoice.payment_status === 'paid') {
      throw new Error('Ödenmiş fatura iptal edilemez');
    }

    await invoice.update({ status: 'cancelled' });
    return await this.getInvoiceById(invoiceId);
  }

  /**
   * Fatura kalemi ekle
   * @param {number} invoiceId - Fatura ID
   * @param {Object} itemData - Kalem verileri
   * @returns {Object} Eklenen kalem
   */
  async addInvoiceItem(invoiceId, itemData) {
    const invoice = await Invoice.findByPk(invoiceId);
    
    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    if (invoice.status === 'approved' || invoice.status === 'paid') {
      throw new Error('Onaylanmış veya ödenmiş faturaya kalem eklenemez');
    }

    const transaction = await Invoice.sequelize.transaction();

    try {
      const item = await InvoiceItem.create({
        ...itemData,
        invoice_id: invoiceId,
        line_total: this.calculateLineTotal(itemData)
      }, { transaction });

      // Fatura toplamlarını güncelle
      const totals = await this.calculateInvoiceTotals(invoiceId, transaction);
      await invoice.update(totals, { transaction });

      await transaction.commit();

      return await InvoiceItem.findByPk(item.id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'product_code', 'product_name', 'unit']
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Fatura kalemi güncelle
   * @param {number} itemId - Kalem ID
   * @param {Object} itemData - Güncellenecek kalem verileri
   * @returns {Object} Güncellenmiş kalem
   */
  async updateInvoiceItem(itemId, itemData) {
    const item = await InvoiceItem.findByPk(itemId, {
      include: [{ model: Invoice, as: 'invoice' }]
    });
    
    if (!item) {
      throw new Error('Fatura kalemi bulunamadı');
    }

    if (item.invoice.status === 'approved' || item.invoice.status === 'paid') {
      throw new Error('Onaylanmış veya ödenmiş fatura kalemi güncellenemez');
    }

    const transaction = await Invoice.sequelize.transaction();

    try {
      await item.update({
        ...itemData,
        line_total: this.calculateLineTotal({ ...item.toJSON(), ...itemData })
      }, { transaction });

      // Fatura toplamlarını güncelle
      const totals = await this.calculateInvoiceTotals(item.invoice_id, transaction);
      await item.invoice.update(totals, { transaction });

      await transaction.commit();

      return await InvoiceItem.findByPk(itemId, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'product_code', 'product_name', 'unit']
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Fatura kalemi sil
   * @param {number} itemId - Kalem ID
   */
  async deleteInvoiceItem(itemId) {
    const item = await InvoiceItem.findByPk(itemId, {
      include: [{ model: Invoice, as: 'invoice' }]
    });
    
    if (!item) {
      throw new Error('Fatura kalemi bulunamadı');
    }

    if (item.invoice.status === 'approved' || item.invoice.status === 'paid') {
      throw new Error('Onaylanmış veya ödenmiş fatura kalemi silinemez');
    }

    const transaction = await Invoice.sequelize.transaction();

    try {
      await item.destroy({ transaction });

      // Fatura toplamlarını güncelle
      const totals = await this.calculateInvoiceTotals(item.invoice_id, transaction);
      await item.invoice.update(totals, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Ödeme ekle
   * @param {Object} paymentData - Ödeme verileri
   * @param {number} userId - Oluşturan kullanıcı ID
   * @returns {Object} Oluşturulan ödeme
   */
  async addPayment(paymentData, userId) {
    const transaction = await Payment.sequelize.transaction();

    try {
      // Ödeme numarası oluştur
      if (!paymentData.payment_number) {
        paymentData.payment_number = await Payment.generatePaymentNumber();
      }

      const payment = await Payment.create({
        ...paymentData,
        created_by: userId
      }, { transaction });

      // Fatura ödeme durumunu güncelle
      if (paymentData.invoice_id) {
        const invoice = await Invoice.findByPk(paymentData.invoice_id);
        if (invoice) {
          await invoice.updatePaymentStatus();
        }
      }

      await transaction.commit();

      return await Payment.findByPk(payment.id, {
        include: [
          {
            model: Invoice,
            as: 'invoice',
            attributes: ['id', 'invoice_number', 'total_amount']
          },
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'customer_code', 'company_name']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'first_name', 'last_name']
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Ödeme listesi getir
   * @param {Object} filters - Filtreleme parametreleri
   * @returns {Object} Ödeme listesi ve sayfalama bilgisi
   */
  async getPayments(filters = {}) {
    const {
      invoice_id,
      customer_id,
      payment_method,
      start_date,
      end_date,
      search,
      page = 1,
      limit = 50,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = filters;

    const where = {};
    
    if (invoice_id) {
      where.invoice_id = invoice_id;
    }
    
    if (customer_id) {
      where.customer_id = customer_id;
    }
    
    if (payment_method) {
      where.payment_method = payment_method;
    }
    
    if (start_date && end_date) {
      where.payment_date = {
        [Op.between]: [start_date, end_date]
      };
    } else if (start_date) {
      where.payment_date = {
        [Op.gte]: start_date
      };
    } else if (end_date) {
      where.payment_date = {
        [Op.lte]: end_date
      };
    }
    
    if (search) {
      where[Op.or] = [
        { payment_number: { [Op.iLike]: `%${search}%` } },
        { reference_number: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: Invoice,
          as: 'invoice',
          attributes: ['id', 'invoice_number', 'total_amount']
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'customer_code', 'company_name']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'first_name', 'last_name']
        }
      ],
      order: [[sort_by, sort_order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      payments: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Vadesi geçen faturalar
   * @returns {Array} Vadesi geçen faturalar
   */
  async getOverdueInvoices() {
    const today = new Date().toISOString().split('T')[0];
    
    return await Invoice.findAll({
      where: {
        due_date: {
          [Op.lt]: today
        },
        payment_status: {
          [Op.ne]: 'paid'
        },
        status: {
          [Op.ne]: 'cancelled'
        }
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'customer_code', 'company_name']
        }
      ],
      order: [['due_date', 'ASC']]
    });
  }

  /**
   * Dashboard özet bilgileri
   * @returns {Object} Özet bilgiler
   */
  async getDashboardSummary() {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const [
      totalSalesInvoices,
      totalPurchaseInvoices,
      monthlyRevenue,
      overdueInvoices,
      unpaidInvoices
    ] = await Promise.all([
      Invoice.count({ where: { invoice_type: 'sales', status: { [Op.ne]: 'cancelled' } } }),
      Invoice.count({ where: { invoice_type: 'purchase', status: { [Op.ne]: 'cancelled' } } }),
      Invoice.sum('total_amount', {
        where: {
          invoice_type: 'sales',
          status: 'approved',
          invoice_date: { [Op.like]: `${thisMonth}%` }
        }
      }),
      Invoice.count({
        where: {
          due_date: { [Op.lt]: today },
          payment_status: { [Op.ne]: 'paid' },
          status: { [Op.ne]: 'cancelled' }
        }
      }),
      Invoice.count({
        where: {
          payment_status: 'unpaid',
          status: { [Op.ne]: 'cancelled' }
        }
      })
    ]);

    return {
      totalSalesInvoices,
      totalPurchaseInvoices,
      monthlyRevenue: monthlyRevenue || 0,
      overdueInvoices,
      unpaidInvoices
    };
  }

  /**
   * Fatura PDF oluştur
   * @param {number} invoiceId - Fatura ID
   * @returns {Buffer} PDF buffer
   */
  async generateInvoicePDF(invoiceId) {
    const invoice = await this.getInvoiceById(invoiceId);
    
    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    const pdfService = new PDFService();
    return await pdfService.generateInvoicePDF(invoice);
  }

  /**
   * Satır toplamı hesapla
   * @param {Object} item - Fatura kalemi
   * @returns {number} Satır toplamı
   */
  calculateLineTotal(item) {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unit_price) || 0;
    const discountRate = parseFloat(item.discount_rate) || 0;
    
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discountRate / 100);
    
    return (subtotal - discountAmount).toFixed(4);
  }

  /**
   * Fatura toplamlarını hesapla
   * @param {number} invoiceId - Fatura ID
   * @param {Object} transaction - Veritabanı transaction
   * @returns {Object} Hesaplanan toplamlar
   */
  async calculateInvoiceTotals(invoiceId, transaction = null) {
    const items = await InvoiceItem.findAll({
      where: { invoice_id: invoiceId },
      transaction
    });

    let subtotal = 0;
    let taxAmount = 0;

    items.forEach(item => {
      const lineTotal = parseFloat(item.line_total);
      const taxRate = parseFloat(item.tax_rate) || 0;
      const lineTax = lineTotal * (taxRate / 100);
      
      subtotal += lineTotal;
      taxAmount += lineTax;
    });

    return {
      subtotal: subtotal.toFixed(4),
      tax_amount: taxAmount.toFixed(4),
      total_amount: (subtotal + taxAmount).toFixed(4)
    };
  }
}

module.exports = InvoiceService;