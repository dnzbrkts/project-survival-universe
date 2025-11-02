/**
 * Para birimi API endpoint'leri test dosyası
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test için geçici token (gerçek uygulamada login yapılmalı)
const TEST_TOKEN = 'test-token';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testCurrencyAPI() {
  try {
    console.log('🧪 Para birimi API testleri başlatılıyor...\n');

    // 1. Para birimlerini listeleme
    console.log('1. Para birimlerini listeleme:');
    try {
      const response = await api.get('/currencies');
      console.log('✅ Status:', response.status);
      console.log('✅ Para birimleri:', response.data.data.length, 'adet');
    } catch (error) {
      console.log('❌ Hata:', error.response?.status, error.response?.data?.message || error.message);
    }

    // 2. Aktif para birimlerini getirme
    console.log('\n2. Aktif para birimlerini getirme:');
    try {
      const response = await api.get('/currencies/active');
      console.log('✅ Status:', response.status);
      console.log('✅ Aktif para birimleri:', response.data.data.length, 'adet');
    } catch (error) {
      console.log('❌ Hata:', error.response?.status, error.response?.data?.message || error.message);
    }

    // 3. Ana para birimini getirme
    console.log('\n3. Ana para birimini getirme:');
    try {
      const response = await api.get('/currencies/base');
      console.log('✅ Status:', response.status);
      console.log('✅ Ana para birimi:', response.data.data.currency_code);
    } catch (error) {
      console.log('❌ Hata:', error.response?.status, error.response?.data?.message || error.message);
    }

    // 4. Güncel döviz kurlarını getirme
    console.log('\n4. Güncel döviz kurlarını getirme:');
    try {
      const response = await api.get('/currencies/rates/current');
      console.log('✅ Status:', response.status);
      console.log('✅ Güncel kurlar:', response.data.data.length, 'adet');
    } catch (error) {
      console.log('❌ Hata:', error.response?.status, error.response?.data?.message || error.message);
    }

    // 5. Para birimi çevirme
    console.log('\n5. Para birimi çevirme:');
    try {
      const response = await api.post('/currencies/convert', {
        amount: 100,
        fromCurrency: 'USD',
        toCurrency: 'TRY'
      });
      console.log('✅ Status:', response.status);
      console.log('✅ Çevirme sonucu:', response.data.data.convertedAmount, 'TRY');
    } catch (error) {
      console.log('❌ Hata:', error.response?.status, error.response?.data?.message || error.message);
    }

    // 6. Fiyat hesaplama
    console.log('\n6. Fiyat hesaplama:');
    try {
      const response = await api.post('/currencies/calculate-price', {
        basePrice: 50,
        baseCurrency: 'USD',
        targetCurrency: 'TRY'
      });
      console.log('✅ Status:', response.status);
      console.log('✅ Hesaplanan fiyat:', response.data.data.calculatedPrice, 'TRY');
    } catch (error) {
      console.log('❌ Hata:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API testleri tamamlandı!');

  } catch (error) {
    console.error('❌ Genel test hatası:', error.message);
  }
}

// Test'i çalıştır
testCurrencyAPI();