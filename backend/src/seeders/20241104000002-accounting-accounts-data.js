'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('accounting_accounts', [
      // AKTİF HESAPLAR (1xx)
      // Dönen Varlıklar (10x-15x)
      {
        account_code: '100.01',
        account_name: 'Kasa',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '101.01',
        account_name: 'Çekler',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '102.01',
        account_name: 'Bankalar',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '108.01',
        account_name: 'Kredi Kartı Alacakları',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '120.01',
        account_name: 'Alıcılar',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '153.01',
        account_name: 'Ticari Mallar',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '191.01',
        account_name: 'İndirilecek KDV',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 7,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Duran Varlıklar (2xx)
      {
        account_code: '253.01',
        account_name: 'Tesis Makine ve Cihazlar',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '257.01',
        account_name: 'Birikmiş Amortismanlar',
        account_type: 'asset',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 9,
        created_at: new Date(),
        updated_at: new Date()
      },

      // PASİF HESAPLAR (3xx-5xx)
      // Kısa Vadeli Yabancı Kaynaklar (3xx)
      {
        account_code: '320.01',
        account_name: 'Satıcılar',
        account_type: 'liability',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '360.01',
        account_name: 'Ödenecek Vergi ve Fonlar',
        account_type: 'liability',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 11,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '391.01',
        account_name: 'Hesaplanan KDV',
        account_type: 'liability',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 12,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Özkaynak (5xx)
      {
        account_code: '500.01',
        account_name: 'Sermaye',
        account_type: 'equity',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 13,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '590.01',
        account_name: 'Dönem Net Karı',
        account_type: 'equity',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 14,
        created_at: new Date(),
        updated_at: new Date()
      },

      // GELİR HESAPLARI (6xx)
      {
        account_code: '600.01',
        account_name: 'Yurtiçi Satışlar',
        account_type: 'revenue',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 15,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '601.01',
        account_name: 'Yurtdışı Satışlar',
        account_type: 'revenue',
        account_level: 3,
        normal_balance: 'credit',
        is_system_account: true,
        sort_order: 16,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '610.01',
        account_name: 'Satış İadeleri',
        account_type: 'revenue',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 17,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '620.01',
        account_name: 'Satılan Malın Maliyeti',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 18,
        created_at: new Date(),
        updated_at: new Date()
      },

      // GİDER HESAPLARI (7xx)
      {
        account_code: '700.01',
        account_name: 'Personel Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 19,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '710.01',
        account_name: 'Kira Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '720.01',
        account_name: 'Elektrik Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 21,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '730.01',
        account_name: 'Telefon Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 22,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '740.01',
        account_name: 'Ulaşım Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 23,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '750.01',
        account_name: 'Pazarlama Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 24,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '760.01',
        account_name: 'Amortisman Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 25,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_code: '770.01',
        account_name: 'Finansman Giderleri',
        account_type: 'expense',
        account_level: 3,
        normal_balance: 'debit',
        is_system_account: true,
        sort_order: 26,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('accounting_accounts', null, {});
  }
};