/**
 * Para birimi modülü test dosyası
 */

require('dotenv').config();
const CurrencyService = require('./src/services/CurrencyService');
const ExchangeRateService = require('./src/services/ExchangeRateService');
const CurrencyUtils = require('./src/utils/currencyUtils');

async function testCurrencyModule() {
  try {
    console.log('🧪 Para birimi modülü test ediliyor...\n');

    // 1. Para birimi oluşturma testi
    console.log('1. Para birimi oluşturma testi:');
    try {
      const newCurrency = await CurrencyService.createCurrency({
        currency_code: 'USD',
        currency_name: 'Amerikan Doları',
        symbol: '$',
        decimal_places: 2,
        is_base_currency: false
      });
      console.log('✅ Para birimi oluşturuldu:', newCurrency.currency_code);
    } catch (error) {
      console.log('ℹ️ Para birimi zaten mevcut veya hata:', error.message);
    }

    // 2. Para birimlerini listeleme testi
    console.log('\n2. Para birimlerini listeleme testi:');
    const currencies = await CurrencyService.getAllCurrencies({ limit: 5 });
    console.log('✅ Para birimleri listelendi:', currencies.currencies.length, 'adet');

    // 3. Döviz kuru oluşturma testi
    console.log('\n3. Döviz kuru oluşturma testi:');
    try {
      const exchangeRate = await ExchangeRateService.createOrUpdateExchangeRate({
        currency_code: 'USD',
        buy_rate: 28.50,
        sell_rate: 28.60,
        source: 'manual'
      });
      console.log('✅ Döviz kuru oluşturuldu:', exchangeRate.currency_code);
    } catch (error) {
      console.log('ℹ️ Döviz kuru zaten mevcut veya hata:', error.message);
    }

    // 4. Para birimi çevirme testi
    console.log('\n4. Para birimi çevirme testi:');
    try {
      const conversion = await ExchangeRateService.convertCurrency(100, 'USD', 'TRY');
      console.log('✅ Para birimi çevirme:', `100 USD = ${conversion.convertedAmount} TRY`);
    } catch (error) {
      console.log('❌ Para birimi çevirme hatası:', error.message);
    }

    // 5. Utility fonksiyonları testi
    console.log('\n5. Utility fonksiyonları testi:');
    const formattedAmount = CurrencyUtils.formatAmountWithCurrency(1234.56, 'USD');
    console.log('✅ Formatlanmış miktar:', formattedAmount);

    const symbol = CurrencyUtils.getCurrencySymbol('EUR');
    console.log('✅ Para birimi sembolü:', symbol);

    const isValid = CurrencyUtils.isValidCurrencyCode('USD');
    console.log('✅ Para birimi kodu doğrulama:', isValid);

    console.log('\n🎉 Tüm testler tamamlandı!');

  } catch (error) {
    console.error('❌ Test hatası:', error.message);
    console.error(error.stack);
  }
}

// Test'i çalıştır
testCurrencyModule();