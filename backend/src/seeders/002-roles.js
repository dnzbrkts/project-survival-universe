/**
 * Seeder: Roles
 * Temel sistem rollerini oluşturur
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_code: 'SUPER_ADMIN',
        role_name: 'Süper Yönetici',
        description: 'Tüm sistem yetkilerine sahip süper yönetici',
        is_system_role: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'SYSTEM_ADMIN',
        role_name: 'Sistem Yöneticisi',
        description: 'Sistem yönetimi ve modül kontrolü yetkilerine sahip',
        is_system_role: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'MANAGER',
        role_name: 'Müdür',
        description: 'Departman yöneticisi yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'EMPLOYEE',
        role_name: 'Çalışan',
        description: 'Temel çalışan yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'ACCOUNTANT',
        role_name: 'Muhasebeci',
        description: 'Muhasebe işlemleri yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'SALES_REP',
        role_name: 'Satış Temsilcisi',
        description: 'Satış işlemleri yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'WAREHOUSE_STAFF',
        role_name: 'Depo Personeli',
        description: 'Stok ve depo işlemleri yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'SERVICE_TECH',
        role_name: 'Servis Teknisyeni',
        description: 'Servis işlemleri yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'HR_STAFF',
        role_name: 'İK Personeli',
        description: 'İnsan kaynakları işlemleri yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'CUSTOMER',
        role_name: 'Müşteri',
        description: 'Müşteri portal erişimi yetkilerine sahip',
        is_system_role: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};