/**
 * Para birimi utility fonksiyonları
 */

class CurrencyUtils {
  /**
   * Para birimi formatla
   */
  static formatCurrency(amount, currencyCode, decimalPlaces = 2) {
    const symbols = {
      'TRY': '₺',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥'
    };

    const symbol = symbols[currencyCode] || currencyCode;
    const formattedAmount = parseFloat(amount).toFixed(decimalPlaces);
    
    return `${formattedAmount} ${symbol}`;
  }

  /**
   * Para birimi sembolünü getir
   */
  static getCurrencySymbol(currencyCode) {
    const symbols = {
      'TRY': '₺',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CHF': 'CHF',
      'CAD': 'C$',
      'AUD': 'A$',
      'CNY': '¥',
      'RUB': '₽'
    };

    return symbols[currencyCode] || currencyCode;
  }

  /**
   * Sayıyı para birimi formatında formatla
   */
  static formatAmount(amount, decimalPlaces = 2, locale = 'tr-TR') {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(amount);
  }

  /**
   * Para birimi kodunu doğrula
   */
  static isValidCurrencyCode(currencyCode) {
    if (!currencyCode || typeof currencyCode !== 'string') {
      return false;
    }

    // 3 karakter, sadece harf
    const regex = /^[A-Z]{3}$/;
    return regex.test(currencyCode.toUpperCase());
  }

  /**
   * Döviz kuru değişim yüzdesini hesapla
   */
  static calculateRateChange(oldRate, newRate) {
    if (!oldRate || oldRate === 0) {
      return 0;
    }

    const change = ((newRate - oldRate) / oldRate) * 100;
    return parseFloat(change.toFixed(4));
  }

  /**
   * Döviz kuru trend analizi
   */
  static analyzeTrend(rates) {
    if (!rates || rates.length < 2) {
      return { trend: 'stable', change: 0 };
    }

    const sortedRates = rates.sort((a, b) => new Date(a.rate_date) - new Date(b.rate_date));
    const firstRate = sortedRates[0].sell_rate;
    const lastRate = sortedRates[sortedRates.length - 1].sell_rate;
    
    const change = this.calculateRateChange(firstRate, lastRate);
    
    let trend = 'stable';
    if (change > 1) {
      trend = 'rising';
    } else if (change < -1) {
      trend = 'falling';
    }

    return { trend, change };
  }

  /**
   * Ortalama döviz kurunu hesapla
   */
  static calculateAverageRate(rates, rateType = 'sell_rate') {
    if (!rates || rates.length === 0) {
      return 0;
    }

    const sum = rates.reduce((total, rate) => total + parseFloat(rate[rateType]), 0);
    return parseFloat((sum / rates.length).toFixed(6));
  }

  /**
   * Kur spread'ini hesapla (alış-satış farkı)
   */
  static calculateSpread(buyRate, sellRate) {
    const spread = sellRate - buyRate;
    const spreadPercentage = (spread / sellRate) * 100;
    
    return {
      absolute: parseFloat(spread.toFixed(6)),
      percentage: parseFloat(spreadPercentage.toFixed(4))
    };
  }

  /**
   * Cross rate hesapla (iki para birimi arasında dolaylı kur)
   */
  static calculateCrossRate(rate1, rate2, baseToTarget = true) {
    if (baseToTarget) {
      // Base currency üzerinden hedef para birimine
      return parseFloat((rate1.buy_rate / rate2.sell_rate).toFixed(6));
    } else {
      // Hedef para biriminden base currency'ye
      return parseFloat((rate2.sell_rate / rate1.buy_rate).toFixed(6));
    }
  }

  /**
   * Volatilite hesapla
   */
  static calculateVolatility(rates) {
    if (!rates || rates.length < 2) {
      return 0;
    }

    const returns = [];
    for (let i = 1; i < rates.length; i++) {
      const currentRate = rates[i].sell_rate;
      const previousRate = rates[i - 1].sell_rate;
      const dailyReturn = Math.log(currentRate / previousRate);
      returns.push(dailyReturn);
    }

    // Standart sapma hesapla
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(252); // Yıllık volatilite

    return parseFloat((volatility * 100).toFixed(4));
  }

  /**
   * Para birimi çiftini formatla
   */
  static formatCurrencyPair(baseCurrency, quoteCurrency) {
    return `${baseCurrency}/${quoteCurrency}`;
  }

  /**
   * Miktar ve para birimini birlikte formatla
   */
  static formatAmountWithCurrency(amount, currencyCode, decimalPlaces = 2) {
    const formattedAmount = this.formatAmount(amount, decimalPlaces);
    const symbol = this.getCurrencySymbol(currencyCode);
    
    // Türk Lirası için sonuna, diğerleri için başına koy
    if (currencyCode === 'TRY') {
      return `${formattedAmount} ${symbol}`;
    } else {
      return `${symbol}${formattedAmount}`;
    }
  }

  /**
   * Kur değişim yönünü belirle
   */
  static getRateDirection(oldRate, newRate) {
    if (newRate > oldRate) {
      return { direction: 'up', icon: '↗', color: 'green' };
    } else if (newRate < oldRate) {
      return { direction: 'down', icon: '↘', color: 'red' };
    } else {
      return { direction: 'stable', icon: '→', color: 'gray' };
    }
  }

  /**
   * Kur geçmişi özeti oluştur
   */
  static createRateSummary(rates) {
    if (!rates || rates.length === 0) {
      return null;
    }

    const sellRates = rates.map(r => r.sell_rate);
    const buyRates = rates.map(r => r.buy_rate);

    return {
      count: rates.length,
      sell: {
        min: Math.min(...sellRates),
        max: Math.max(...sellRates),
        avg: this.calculateAverageRate(rates, 'sell_rate'),
        current: sellRates[sellRates.length - 1]
      },
      buy: {
        min: Math.min(...buyRates),
        max: Math.max(...buyRates),
        avg: this.calculateAverageRate(rates, 'buy_rate'),
        current: buyRates[buyRates.length - 1]
      },
      trend: this.analyzeTrend(rates),
      volatility: this.calculateVolatility(rates)
    };
  }
}

module.exports = CurrencyUtils;