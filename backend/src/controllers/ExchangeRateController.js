const ExchangeRateService = require('../services/ExchangeRateService');
const { validationResult } = require('express-validator');

class ExchangeRateController {
  /**
   * Döviz kurlarını listele
   */
  async getExchangeRates(req, res) {
    try {
      const { page, limit, currencyCode, dateFrom, dateTo, source } = req.query;
      
      const result = await ExchangeRateService.getExchangeRates({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
        currencyCode,
        dateFrom,
        dateTo,
        source
      });

      res.json({
        success: true,
        data: result.exchangeRates,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Döviz kurları listelenemedi',
        error: error.message
      });
    }
  }

  /**
   * Belirli tarih için döviz kurunu getir
   */
  async getExchangeRateByDate(req, res) {
    try {
      const { currencyCode } = req.params;
      const { date } = req.query;
      
      const exchangeRate = await ExchangeRateService.getExchangeRateByDate(currencyCode, date);

      res.json({
        success: true,
        data: exchangeRate
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Güncel döviz kurlarını getir
   */
  async getCurrentRates(req, res) {
    try {
      const rates = await ExchangeRateService.getCurrentRates();

      res.json({
        success: true,
        data: rates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Güncel kurlar getirilemedi',
        error: error.message
      });
    }
  }

  /**
   * Döviz kuru oluştur veya güncelle
   */
  async createOrUpdateExchangeRate(req, res) {
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

      const exchangeRate = await ExchangeRateService.createOrUpdateExchangeRate(req.body);

      res.status(201).json({
        success: true,
        message: 'Döviz kuru başarıyla kaydedildi',
        data: exchangeRate
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Döviz kuru kaydedilemedi',
        error: error.message
      });
    }
  }

  /**
   * Toplu döviz kuru güncelleme
   */
  async bulkUpdateRates(req, res) {
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

      const { rates } = req.body;
      
      if (!Array.isArray(rates) || rates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Geçerli bir kur listesi gönderilmelidir'
        });
      }

      const results = await ExchangeRateService.bulkUpdateRates(rates);

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      res.json({
        success: true,
        message: `${successCount} kur başarıyla güncellendi, ${failCount} kur güncellenemedi`,
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Toplu kur güncellemesi yapılamadı',
        error: error.message
      });
    }
  }

  /**
   * TCMB'den güncel kurları çek
   */
  async fetchTCMBRates(req, res) {
    try {
      const { date } = req.query;
      const rates = await ExchangeRateService.fetchTCMBRates(date);

      res.json({
        success: true,
        message: 'TCMB kurları başarıyla güncellendi',
        data: rates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'TCMB kurları güncellenemedi',
        error: error.message
      });
    }
  }

  /**
   * Para birimi çevirme
   */
  async convertCurrency(req, res) {
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

      const { amount, fromCurrency, toCurrency, date } = req.body;
      
      const result = await ExchangeRateService.convertCurrency(amount, fromCurrency, toCurrency, date);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Para birimi çevirme işlemi yapılamadı',
        error: error.message
      });
    }
  }

  /**
   * Fiyat hesaplama
   */
  async calculatePrice(req, res) {
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

      const { basePrice, baseCurrency, targetCurrency, date } = req.body;
      
      const result = await ExchangeRateService.calculatePrice(basePrice, baseCurrency, targetCurrency, date);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Fiyat hesaplama işlemi yapılamadı',
        error: error.message
      });
    }
  }

  /**
   * Döviz kurunu sil
   */
  async deleteExchangeRate(req, res) {
    try {
      const { id } = req.params;
      const result = await ExchangeRateService.deleteExchangeRate(id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Döviz kuru silinemedi',
        error: error.message
      });
    }
  }
}

module.exports = new ExchangeRateController();