/**
 * Seeder: System Modules
 * Temel sistem modüllerini oluşturur
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('system_modules', [
      {
        module_code: 'SYSTEM',
        module_name: 'Sistem Yönetimi',
        description: 'Sistem ayarları ve modül yönetimi',
        version: '1.0.0',
        is_active: true,
        requires_license: false,
        sort_order: 1,
        icon: 'settings',
        color: '#607D8B',
        category: 'SISTEM',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'AUTH',
        module_name: 'Kimlik Doğrulama',
        description: 'Kullanıcı kimlik doğrulama ve yetkilendirme',
        version: '1.0.0',
        is_active: true,
        requires_license: false,
        sort_order: 2,
        icon: 'lock',
        color: '#F44336',
        category: 'CORE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'STOK_YONETIMI',
        module_name: 'Stok Yönetimi',
        description: 'Ürün ve stok yönetimi modülü',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 10,
        icon: 'inventory',
        color: '#2196F3',
        category: 'OPERASYON',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'SERVIS_YONETIMI',
        module_name: 'Servis Yönetimi',
        description: 'Müşteri servis takip sistemi',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 11,
        icon: 'build',
        color: '#FF9800',
        category: 'OPERASYON',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'FATURA_YONETIMI',
        module_name: 'Fatura Yönetimi',
        description: 'Satış ve alış fatura işlemleri',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 20,
        icon: 'receipt',
        color: '#4CAF50',
        category: 'SATIS',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'CARI_YONETIMI',
        module_name: 'Cari Hesap Yönetimi',
        description: 'Müşteri ve tedarikçi hesap yönetimi',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 21,
        icon: 'account_balance',
        color: '#9C27B0',
        category: 'MUHASEBE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'MUHASEBE',
        module_name: 'Muhasebe',
        description: 'Mali işlemler ve raporlama',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 22,
        icon: 'calculate',
        color: '#795548',
        category: 'MUHASEBE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'PERSONEL_YONETIMI',
        module_name: 'Personel Yönetimi',
        description: 'İnsan kaynakları ve personel işlemleri',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 30,
        icon: 'people',
        color: '#3F51B5',
        category: 'IK',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'BORDRO',
        module_name: 'Bordro Yönetimi',
        description: 'Maaş ve bordro hesaplamaları',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 31,
        icon: 'payments',
        color: '#009688',
        category: 'IK',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'E_TICARET',
        module_name: 'E-Ticaret Entegrasyonu',
        description: 'Çoklu e-ticaret platform entegrasyonu',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 40,
        icon: 'shopping_cart',
        color: '#FF5722',
        category: 'ENTEGRASYON',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_code: 'KARGO_ENTEGRASYONU',
        module_name: 'Kargo Entegrasyonu',
        description: 'Kargo şirketi entegrasyonları',
        version: '1.0.0',
        is_active: false,
        requires_license: true,
        sort_order: 41,
        icon: 'local_shipping',
        color: '#607D8B',
        category: 'ENTEGRASYON',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('system_modules', null, {});
  }
};