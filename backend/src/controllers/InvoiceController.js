/**
 * Fatura Yönetimi Controller
 * Invoice Management Controller
 */

const InvoiceService = require('../services/InvoiceService');
const { validationResult } = require('express-validator');

class InvoiceController {
  constructor() {
    this.invoiceService = new InvoiceService();
  }

  /**
   * Fatura listesi getir
   */
  async getInvoices(req, res) {
    try {
      const result = await this.invoiceService.getInvoices(req.query);
      
      res.json({
        success: true,
        data: result.invoices,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Fatura listesi getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Fatura listesi getirilemedi',
        error: error.message
      });
    }
  }

  /**
   * Fatura detayı getir
   */
  async getInvoiceById(req, res) {
    try {
      const { id } = req.params;
      const invoice = await this.invoiceService.getInvoiceById(id);
      
      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      console.error('Fatura detayı getirme hatası:', error);
      
      if (error.message === 'Fatura bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura detayı getirilemedi',
        error: error.message
      });
    }
  }

  /**
   * Yeni fatura oluştur
   */
  async createInvoice(req, res) {
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

      const { items, ...invoiceData } = req.body;
      const userId = req.user.id;

      const invoice = await this.invoiceService.createInvoice(invoiceData, items, userId);
      
      res.status(201).json({
        success: true,
        message: 'Fatura başarıyla oluşturuldu',
        data: invoice
      });
    } catch (error) {
      console.error('Fatura oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Fatura oluşturulamadı',
        error: error.message
      });
    }
  }

  /**
   * Fatura güncelle
   */
  async updateInvoice(req, res) {
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
      const invoice = await this.invoiceService.updateInvoice(id, req.body);
      
      res.json({
        success: true,
        message: 'Fatura başarıyla güncellendi',
        data: invoice
      });
    } catch (error) {
      console.error('Fatura güncelleme hatası:', error);
      
      if (error.message === 'Fatura bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('güncellenemez')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura güncellenemedi',
        error: error.message
      });
    }
  }

  /**
   * Fatura sil
   */
  async deleteInvoice(req, res) {
    try {
      const { id } = req.params;
      await this.invoiceService.deleteInvoice(id);
      
      res.json({
        success: true,
        message: 'Fatura başarıyla silindi'
      });
    } catch (error) {
      console.error('Fatura silme hatası:', error);
      
      if (error.message === 'Fatura bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('silinemez')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura silinemedi',
        error: error.message
      });
    }
  }

  /**
   * Fatura onayla
   */
  async approveInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await this.invoiceService.approveInvoice(id);
      
      res.json({
        success: true,
        message: 'Fatura başarıyla onaylandı',
        data: invoice
      });
    } catch (error) {
      console.error('Fatura onaylama hatası:', error);
      
      if (error.message === 'Fatura bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('onaylanabilir')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura onaylanamadı',
        error: error.message
      });
    }
  }

  /**
   * Fatura iptal et
   */
  async cancelInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await this.invoiceService.cancelInvoice(id);
      
      res.json({
        success: true,
        message: 'Fatura başarıyla iptal edildi',
        data: invoice
      });
    } catch (error) {
      console.error('Fatura iptal etme hatası:', error);
      
      if (error.message === 'Fatura bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('iptal edilemez')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura iptal edilemedi',
        error: error.message
      });
    }
  }

  /**
   * Fatura kalemi ekle
   */
  async addInvoiceItem(req, res) {
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
      const item = await this.invoiceService.addInvoiceItem(id, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Fatura kalemi başarıyla eklendi',
        data: item
      });
    } catch (error) {
      console.error('Fatura kalemi ekleme hatası:', error);
      
      if (error.message === 'Fatura bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('eklenemez')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura kalemi eklenemedi',
        error: error.message
      });
    }
  }

  /**
   * Fatura kalemi güncelle
   */
  async updateInvoiceItem(req, res) {
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

      const { itemId } = req.params;
      const item = await this.invoiceService.updateInvoiceItem(itemId, req.body);
      
      res.json({
        success: true,
        message: 'Fatura kalemi başarıyla güncellendi',
        data: item
      });
    } catch (error) {
      console.error('Fatura kalemi güncelleme hatası:', error);
      
      if (error.message === 'Fatura kalemi bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('güncellenemez')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura kalemi güncellenemedi',
        error: error.message
      });
    }
  }

  /**
   * Fatura kalemi sil
   */
  async deleteInvoiceItem(req, res) {
    try {
      const { itemId } = req.params;
      await this.invoiceService.deleteInvoiceItem(itemId);
      
      res.json({
        success: true,
        message: 'Fatura kalemi başarıyla silindi'
      });
    } catch (error) {
      console.error('Fatura kalemi silme hatası:', error);
      
      if (error.message === 'Fatura kalemi bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('silinemez')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura kalemi silinemedi',
        error: error.message
      });
    }
  }

  /**
   * Ödeme ekle
   */
  async addPayment(req, res) {
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

      const userId = req.user.id;
      const payment = await this.invoiceService.addPayment(req.body, userId);
      
      res.status(201).json({
        success: true,
        message: 'Ödeme başarıyla eklendi',
        data: payment
      });
    } catch (error) {
      console.error('Ödeme ekleme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Ödeme eklenemedi',
        error: error.message
      });
    }
  }

  /**
   * Ödeme listesi getir
   */
  async getPayments(req, res) {
    try {
      const result = await this.invoiceService.getPayments(req.query);
      
      res.json({
        success: true,
        data: result.payments,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Ödeme listesi getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Ödeme listesi getirilemedi',
        error: error.message
      });
    }
  }

  /**
   * Vadesi geçen faturalar
   */
  async getOverdueInvoices(req, res) {
    try {
      const invoices = await this.invoiceService.getOverdueInvoices();
      
      res.json({
        success: true,
        data: invoices
      });
    } catch (error) {
      console.error('Vadesi geçen faturalar getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Vadesi geçen faturalar getirilemedi',
        error: error.message
      });
    }
  }

  /**
   * Dashboard özet bilgileri
   */
  async getDashboardSummary(req, res) {
    try {
      const summary = await this.invoiceService.getDashboardSummary();
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Dashboard özet bilgileri getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Dashboard özet bilgileri getirilemedi',
        error: error.message
      });
    }
  }

  /**
   * Fatura PDF oluştur
   */
  async generateInvoicePDF(req, res) {
    try {
      const { id } = req.params;
      const pdfBuffer = await this.invoiceService.generateInvoicePDF(id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=fatura-${id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Fatura PDF oluşturma hatası:', error);
      
      if (error.message === 'Fatura bulunamadı') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Fatura PDF oluşturulamadı',
        error: error.message
      });
    }
  }
}

module.exports = InvoiceController;