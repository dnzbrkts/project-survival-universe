const Currency = require('../models/Currency');
const ExchangeRate = require('../models/ExchangeRate');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

class CurrencyService {
  /**
   * Para birimlerini listele
   */
  async getAllCurrencies(options = {}) {
    const { 
      page = 1, 
      limit = 50, 
      isActive = null,
      search = null 
    } = options;

    const whereClause = {};
    
    if (isActive !== null) {
      whereClause.is_active = isActive;
    }

    if (search) {
      whereClause[Op.or] = [
        { currency_code: { [Op.iLike]: `%${search}%` } },
        { currency_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Currency.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['currency_code', 'ASC']]
    });

    return {
      currencies: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Para birimi detayını getir
   */
  async getCurrencyByCode(currencyCode) {
    const currency = await Currency.findOne({
      where: { currency_code: currencyCode.toUpperCase() }
    });

    if (!currency) {
      throw new Error('Para birimi bulunamadı');
    }

    return currency;
  }

  /**
   * Yeni para birimi oluştur
   */
  async createCurrency(currencyData) {
    const { currency_code, currency_name, symbol, decimal_places, is_base_currency } = currencyData;

    // Para birimi kodunu büyük harfe çevir
    const upperCurrencyCode = currency_code.toUpperCase();

    // Eğer base currency olarak işaretleniyorsa, diğerlerini false yap
    if (is_base_currency) {
      await Currency.update(
        { is_base_currency: false },
        { where: { is_base_currency: true } }
      );
    }

    const currency = await Currency.create({
      currency_code: upperCurrencyCode,
      currency_name,
      symbol,
      decimal_places: decimal_places || 2,
      is_base_currency: is_base_currency || false,
      is_active: true
    });

    return currency;
  }

  /**
   * Para birimini güncelle
   */
  async updateCurrency(currencyCode, updateData) {
    const currency = await this.getCurrencyByCode(currencyCode);

    // Eğer base currency olarak işaretleniyorsa, diğerlerini false yap
    if (updateData.is_base_currency) {
      await Currency.update(
        { is_base_currency: false },
        { where: { is_base_currency: true, currency_code: { [Op.ne]: currencyCode.toUpperCase() } } }
      );
    }

    await currency.update(updateData);
    return currency;
  }

  /**
   * Para birimini sil (soft delete)
   */
  async deleteCurrency(currencyCode) {
    const currency = await this.getCurrencyByCode(currencyCode);

    if (currency.is_base_currency) {
      throw new Error('Ana para birimi silinemez');
    }

    await currency.update({ is_active: false });
    return { message: 'Para birimi başarıyla silindi' };
  }

  /**
   * Aktif para birimlerini getir
   */
  async getActiveCurrencies() {
    return await Currency.findAll({
      where: { is_active: true },
      order: [['currency_code', 'ASC']]
    });
  }

  /**
   * Ana para birimini getir
   */
  async getBaseCurrency() {
    const baseCurrency = await Currency.findOne({
      where: { is_base_currency: true, is_active: true }
    });

    if (!baseCurrency) {
      // Varsayılan olarak TRY'yi ana para birimi yap
      const tryExists = await Currency.findOne({
        where: { currency_code: 'TRY' }
      });

      if (tryExists) {
        await tryExists.update({ is_base_currency: true });
        return tryExists;
      }

      // TRY yoksa oluştur
      return await this.createCurrency({
        currency_code: 'TRY',
        currency_name: 'Türk Lirası',
        symbol: '₺',
        decimal_places: 2,
        is_base_currency: true
      });
    }

    return baseCurrency;
  }
}

module.exports = new CurrencyService();