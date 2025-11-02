'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        product_code: 'LP001',
        product_name: 'Laptop Dell Inspiron 15',
        description: '15.6" Full HD, Intel i5, 8GB RAM, 256GB SSD',
        category_id: 2, // Bilgisayar kategorisi
        unit: 'Adet',
        critical_stock_level: 5,
        purchase_price: 15000.0000,
        sale_price: 18000.0000,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'PH001',
        product_name: 'iPhone 15 Pro 128GB',
        description: 'Apple iPhone 15 Pro 128GB Titanium Blue',
        category_id: 3, // Telefon kategorisi
        unit: 'Adet',
        critical_stock_level: 3,
        purchase_price: 45000.0000,
        sale_price: 52000.0000,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'MS001',
        product_name: 'Wireless Mouse',
        description: 'Logitech MX Master 3 Wireless Mouse',
        category_id: 2, // Bilgisayar kategorisi
        unit: 'Adet',
        critical_stock_level: 10,
        purchase_price: 800.0000,
        sale_price: 1200.0000,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'PP001',
        product_name: 'A4 Fotokopi Kağıdı',
        description: 'A4 80gr Fotokopi Kağıdı - 500 Yaprak',
        category_id: 4, // Ofis Malzemeleri kategorisi
        unit: 'Paket',
        critical_stock_level: 20,
        purchase_price: 45.0000,
        sale_price: 65.0000,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};