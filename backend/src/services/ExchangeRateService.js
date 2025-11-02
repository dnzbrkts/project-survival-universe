const ExchangeRate = require('../models/ExchangeRate');
const Currency = require('../models/Currency');
const CurrencyService = require('./CurrencyService');
const { Op } = require('sequelize');
const axios = require('axios');

class ExchangeRateService {
  /**
   * Döviz kurlarını listele
   */
  async getExchangeRates(options = {}) {
    const { 
      page = 1, 
      limit = 50, 
      currencyCode = null,
      dateFrom = null,
      dateTo = null,
      source = null 
    } = options;

    const whereClause = { is_active: true };
    
    if (currencyCode) {
      whereClause.currency_code = currencyCode.toUpperCase();
    }

    if (dateFrom || dateTo) {
      whereClause.rate_date = {};
      if (dateFrom) whereClause.rate_date[Op.gte] = dateFrom;
      if (dateTo) whereClause.rate_date[Op.lte] = dateTo;
    }

    if (source) {
      whereClause.source = source;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ExchangeRate.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['rate_date', 'DESC'], ['currency_code', 'ASC']]
    });

    return {
      exchangeRates: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Belirli tarih için döviz kurunu getir
   */
  async getExchangeRateByDate(currencyCode, date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const exchangeRate = await ExchangeRate.findOne({
      where: {
        currency_code: currencyCode.toUpperCase(),
        rate_date: targetDate,
        is_active: true
      }
    });

    if (!exchangeRate) {
      // Eğer o tarih için kur yoksa, en son kurunu getir
      const latestRate = await ExchangeRate.findOne({
        where: {
          currency_code: currencyCode.toUpperCase(),
          rate_date: { [Op.lte]: targetDate },
          is_active: true
        },
        order: [['rate_date', 'DESC']]
      });

      if (!latestRate) {
        throw new Error(`${currencyCode} para birimi için kur bulunamadı`);
      }

      return latestRate;
    }

    return exchangeRate;
  }

  /**
   * Güncel döviz kurlarını getir
   */
  async getCurrentRates() {
    const today = new Date().toISOString().split('T')[0];
    
    const rates = await ExchangeRate.findAll({
      where: {
        rate_date: today,
        is_active: true
      },
      order: [['currency_code', 'ASC']]
    });

    return rates;
  }

  /**
   * Döviz kuru oluştur veya güncelle
   */
  async createOrUpdateExchangeRate(rateData) {
    const { currency_code, buy_rate, sell_rate, rate_date, source = 'manual' } = rateData;

    // Para biriminin var olduğunu kontrol et
    await CurrencyService.getCurrencyByCode(currency_code);

    const upperCurrencyCode = currency_code.toUpperCase();
    const targetDate = rate_date || new Date().toISOString().split('T')[0];

    // Mevcut kuru kontrol et
    const existingRate = await ExchangeRate.findOne({
      where: {
        currency_code: upperCurrencyCode,
        rate_date: targetDate
      }
    });

    if (existingRate) {
      // Güncelle
      await existingRate.update({
        buy_rate,
        sell_rate,
        source,
        is_active: true
      });
      return existingRate;
    } else {
      // Yeni oluştur
      const newRate = await ExchangeRate.create({
        currency_code: upperCurrencyCode,
        buy_rate,
        sell_rate,
        rate_date: targetDate,
        source,
        is_active: true
      });
      return newRate;
    }
  }

  /**
   * Toplu döviz kuru güncelleme
   */
  async bulkUpdateRates(ratesData) {
    const results = [];
    
    for (const rateData of ratesData) {
      try {
        const result = await this.createOrUpdateExchangeRate(rateData);
        results.push({ success: true, currency: rateData.currency_code, data: result });
      } catch (error) {
        results.push({ success: false, currency: rateData.currency_code, error: error.message });
      }
    }

    return results;
  }

  /**
   * TCMB'den güncel kurları çek
   */
  async fetchTCMBRates(date = null) {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0].replace(/-/g, '');
      const url = `https://www.tcmb.gov.tr/kurlar/${targetDate.substring(0, 6)}/${targetDate}.xml`;
      
      const response = await axios.get(url, { timeout: 10000 });
      
      // XML parsing burada yapılacak (xml2js kütüphanesi kullanılabilir)
      // Şimdilik basit bir mock data döndürüyoruz
      const mockRates = [
        { currency_code: 'USD', buy_rate: 28.50, sell_rate: 28.60 },
        { currency_code: 'EUR', buy_rate: 31.20, sell_rate: 31.35 },
        { currency_code: 'GBP', buy_rate: 36.80, sell_rate: 37.00 }
      ];

      const results = [];
      for (const rate of mockRates) {
        const result = await this.createOrUpdateExchangeRate({
          ...rate,
          rate_date: date || new Date().toISOString().split('T')[0],
          source: 'tcmb'
        });
        results.push(result);
      }

      return results;
    } catch (error) {
      throw new Error(`TCMB kurları alınamadı: ${error.message}`);
    }
  }

  /**
   * Para birimi çevirme
   */
  async convertCurrency(amount, fromCurrency, toCurrency, date = null) {
    const fromCode = fromCurrency.toUpperCase();
    const toCode = toCurrency.toUpperCase();

    if (fromCode === toCode) {
      return {
        originalAmount: amount,
        convertedAmount: amount,
        fromCurrency: fromCode,
        toCurrency: toCode,
        exchangeRate: 1,
        date: date || new Date().toISOString().split('T')[0]
      };
    }

    const baseCurrency = await CurrencyService.getBaseCurrency();
    const baseCode = baseCurrency.currency_code;

    let convertedAmount;
    let exchangeRate;

    if (fromCode === baseCode) {
      // Ana para biriminden diğer para birimine
      const toRate = await this.getExchangeRateByDate(toCode, date);
      exchangeRate = toRate.sell_rate;
      convertedAmount = amount / exchangeRate;
    } else if (toCode === baseCode) {
      // Diğer para biriminden ana para birimine
      const fromRate = await this.getExchangeRateByDate(fromCode, date);
      exchangeRate = fromRate.buy_rate;
      convertedAmount = amount * exchangeRate;
    } else {
      // İki farklı para birimi arasında (ana para birimi üzerinden)
      const fromRate = await this.getExchangeRateByDate(fromCode, date);
      const toRate = await this.getExchangeRateByDate(toCode, date);
      
      // Önce ana para birimine çevir, sonra hedef para birimine
      const baseAmount = amount * fromRate.buy_rate;
      convertedAmount = baseAmount / toRate.sell_rate;
      exchangeRate = (fromRate.buy_rate / toRate.sell_rate);
    }

    return {
      originalAmount: parseFloat(amount),
      convertedAmount: parseFloat(convertedAmount.toFixed(4)),
      fromCurrency: fromCode,
      toCurrency: toCode,
      exchangeRate: parseFloat(exchangeRate.toFixed(6)),
      date: date || new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Fiyat hesaplama (farklı para birimlerinde)
   */
  async calculatePrice(basePrice, baseCurrency, targetCurrency, date = null) {
    if (baseCurrency.toUpperCase() === targetCurrency.toUpperCase()) {
      return {
        basePrice: parseFloat(basePrice),
        calculatedPrice: parseFloat(basePrice),
        baseCurrency: baseCurrency.toUpperCase(),
        targetCurrency: targetCurrency.toUpperCase(),
        exchangeRate: 1
      };
    }

    const conversion = await this.convertCurrency(basePrice, baseCurrency, targetCurrency, date);
    
    return {
      basePrice: conversion.originalAmount,
      calculatedPrice: conversion.convertedAmount,
      baseCurrency: conversion.fromCurrency,
      targetCurrency: conversion.toCurrency,
      exchangeRate: conversion.exchangeRate,
      date: conversion.date
    };
  }

  /**
   * Döviz kurunu sil (soft delete)
   */
  async deleteExchangeRate(id) {
    const exchangeRate = await ExchangeRate.findByPk(id);
    
    if (!exchangeRate) {
      throw new Error('Döviz kuru bulunamadı');
    }

    await exchangeRate.update({ is_active: false });
    return { message: 'Döviz kuru başarıyla silindi' };
  }
}

module.exports = new ExchangeRateService();