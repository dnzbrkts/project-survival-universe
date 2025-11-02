'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('product_categories', [
      {
        category_code: 'ELKT',
        category_name: 'Elektronik',
        description: 'Elektronik ürünler kategorisi',
        parent_category_id: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'BLGS',
        category_name: 'Bilgisayar',
        description: 'Bilgisayar ve aksesuarları',
        parent_category_id: 1, // Elektronik kategorisinin alt kategorisi
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'TELEF',
        category_name: 'Telefon',
        description: 'Cep telefonu ve aksesuarları',
        parent_category_id: 1, // Elektronik kategorisinin alt kategorisi
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'OFIS',
        category_name: 'Ofis Malzemeleri',
        description: 'Ofis ve kırtasiye malzemeleri',
        parent_category_id: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_categories', null, {});
  }
};