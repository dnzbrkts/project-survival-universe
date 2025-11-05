const AccountingService = require('./AccountingService');
const { validationResult } = require('express-validator');

class AccountingController {
  constructor() {
    this.accountingService = new AccountingService();
  }

  // Mali işlem kayıt API endpoint'leri
  async createAccountingEntry(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validasyon hatası',
          errors: errors.array()
        });
      }

      const entryData = {
        ...req.body,
        created_by: req.user.id
      };

      const entry = await this.accountingService.createAccountingEntry(entryData);

      res.status(201).json({
        success: true,
        message: 'Muhasebe kaydı başarıyla oluşturuldu',
        data: entry
      });
    } catch (error) {
      console.error('Muhasebe kaydı oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Muhasebe kaydı oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Otomatik yevmiye kaydı oluşturma
  async createAutomaticEntry(req, res) {
    try {
      const { reference_type, reference_id } = req.params;
      const entryData = {
        ...req.body,
        created_by: req.user.id
      };

      const entry = await this.accountingService.createAutomaticEntry(
        reference_type, 
        reference_id, 
        entryData
      );

      res.status(201).json({
        success: true,
        message: 'Otomatik yevmiye kaydı oluşturuldu',
        data: entry
      });
    } catch (error) {
      console.error('Otomatik yevmiye kaydı hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Otomatik yevmiye kaydı oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Muhasebe kayıtları listesi
  async getAccountingEntries(req, res) {
    try {
      const params = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        reference_type: req.query.reference_type
      };

      const result = await this.accountingService.getAllAccountingEntries(params);

      res.json({
        success: true,
        message: 'Muhasebe kayıtları başarıyla getirildi',
        data: result
      });
    } catch (error) {
      console.error('Muhasebe kayıtları getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Muhasebe kayıtları getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  // Muhasebe kaydı detayı
  async getAccountingEntryById(req, res) {
    try {
      const { id } = req.params;
      const entry = await this.accountingService.getAccountingEntryById(id);

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'Muhasebe kaydı bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Muhasebe kaydı başarıyla getirildi',
        data: entry
      });
    } catch (error) {
      console.error('Muhasebe kaydı getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Muhasebe kaydı getirilirken hata oluştu',
        error: error.message
      });
    }
  }

  // Bilanço oluşturma API'si
  async generateBalanceSheet(req, res) {
    try {
      const params = {
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        include_previous_period: req.query.include_previous_period === 'true'
      };

      const balanceSheet = await this.accountingService.generateBalanceSheet(params);

      res.json({
        success: true,
        message: 'Bilanço başarıyla oluşturuldu',
        data: balanceSheet
      });
    } catch (error) {
      console.error('Bilanço oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Bilanço oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Gelir tablosu oluşturma API'si
  async generateIncomeStatement(req, res) {
    try {
      const params = {
        start_date: req.query.start_date,
        end_date: req.query.end_date
      };

      const incomeStatement = await this.accountingService.generateIncomeStatement(params);

      res.json({
        success: true,
        message: 'Gelir tablosu başarıyla oluşturuldu',
        data: incomeStatement
      });
    } catch (error) {
      console.error('Gelir tablosu oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Gelir tablosu oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Mizan raporu
  async generateTrialBalance(req, res) {
    try {
      const params = {
        start_date: req.query.start_date,
        end_date: req.query.end_date
      };

      const trialBalance = await this.accountingService.generateTrialBalance(params);

      res.json({
        success: true,
        message: 'Mizan raporu başarıyla oluşturuldu',
        data: trialBalance
      });
    } catch (error) {
      console.error('Mizan raporu oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Mizan raporu oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Dönemsel rapor oluşturma
  async generatePeriodicalReports(req, res) {
    try {
      const params = {
        period_type: req.query.period_type || 'monthly',
        year: parseInt(req.query.year) || new Date().getFullYear(),
        month: parseInt(req.query.month),
        quarter: parseInt(req.query.quarter)
      };

      const reports = await this.accountingService.generatePeriodicalReports(params);

      res.json({
        success: true,
        message: 'Dönemsel raporlar başarıyla oluşturuldu',
        data: reports
      });
    } catch (error) {
      console.error('Dönemsel rapor oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Dönemsel raporlar oluşturulurken hata oluştu',
        error: error.message
      });
    }
  }

  // Hesap bakiyeleri
  async getAccountBalances(req, res) {
    try {
      const params = {
        account_type: req.query.account_type,
        account_code_prefix: req.query.account_code_prefix,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        include_zero_balances: req.query.include_zero_balances === 'true'
      };

      const balances = await this.accountingService.getAccountBalances(params);

      res.json({
        success: true,
        message: 'Hesap bakiyeleri başarıyla getirildi',
        data: balances
      });
    } catch (error) {
      console.error('Hesap bakiyeleri getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Hesap bakiyeleri getirilirken hata oluştu',
        error: error.message
      });
    }
  }
}

module.exports = AccountingController;