const CurrencyService = require('../services/CurrencyService');
const { validationResult } = require('express-validator');

class CurrencyController {
  /**
   * Para birimlerini listele
   */
  async getAllCurrencies(req, res) {
    try {
      const { page, limit, isActive, search } = req.query;
      
      const result = await CurrencyService.getAllCurrencies({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
        isActive: isActive !== undefined ? isActive === 'true' : null,
        search
      });

      res.json({
        success: true,
        data: result.currencies,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Para birimleri listelenemedi',
        error: error.message
      });
    }
  }

  /**
   * Para birimi detayını getir
   */
  async getCurrencyByCode(req, res) {
    try {
      const { currencyCode } = req.params;
      const currency = await CurrencyService.getCurrencyByCode(currencyCode);

      res.json({
        success: true,
        data: currency
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Yeni para birimi oluştur
   */
  async createCurrency(req, res) {
    try {
      // Validation hatalarını kontrol et
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const currency = await CurrencyService.createCurrency(req.body);

      res.status(201).json({
        success: true,
        message: 'Para birimi başarıyla oluşturuldu',
        data: currency
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Para birimi oluşturulamadı',
        error: error.message
      });
    }
  }

  /**
   * Para birimini güncelle
   */
  async updateCurrency(req, res) {
    try {
      // Validation hatalarını kontrol et
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const { currencyCode } = req.params;
      const currency = await CurrencyService.updateCurrency(currencyCode, req.body);

      res.json({
        success: true,
        message: 'Para birimi başarıyla güncellendi',
        data: currency
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Para birimi güncellenemedi',
        error: error.message
      });
    }
  }

  /**
   * Para birimini sil
   */
  async deleteCurrency(req, res) {
    try {
      const { currencyCode } = req.params;
      const result = await CurrencyService.deleteCurrency(currencyCode);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Para birimi silinemedi',
        error: error.message
      });
    }
  }

  /**
   * Aktif para birimlerini getir
   */
  async getActiveCurrencies(req, res) {
    try {
      const currencies = await CurrencyService.getActiveCurrencies();

      res.json({
        success: true,
        data: currencies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Aktif para birimleri getirilemedi',
        error: error.message
      });
    }
  }

  /**
   * Ana para birimini getir
   */
  async getBaseCurrency(req, res) {
    try {
      const baseCurrency = await CurrencyService.getBaseCurrency();

      res.json({
        success: true,
        data: baseCurrency
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ana para birimi getirilemedi',
        error: error.message
      });
    }
  }
}

module.exports = new CurrencyController();