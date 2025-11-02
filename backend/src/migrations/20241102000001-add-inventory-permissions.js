'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('system_modules', [
      {
        module_code: 'INVENTORY',
        module_name: 'Stok Yönetimi',
        description: 'Ürün ve stok yönetimi, kategori organizasyonu, stok hareketleri takibi',
        version: '1.0.0',
        is_active: true,
        requires_license: false,
        sort_order: 10,
        icon: 'inventory_2',
        color: '#2196F3',
        category: 'OPERASYON',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    await queryInterface.bulkInsert('permission_categories', [
      {
        category_code: 'STOK',
        category_name: 'Stok Yönetimi',
        description: 'Stok ve ürün yönetimi yetkileri',
        created_at: new Date()
      }
    ]);
    const [inventoryModule] = await queryInterface.sequelize.query(
      "SELECT id FROM system_modules WHERE module_code = 'INVENTORY'",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [stockCategory] = await queryInterface.sequelize.query(
      "SELECT id FROM permission_categories WHERE category_code = 'STOK'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const permissions = [
      {
        permission_code: 'stok.urun.liste',
        permission_name: 'Ürün Listesi Görüntüleme',
        description: 'Ürün listesini görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.urun.detay',
        permission_name: 'Ürün Detayı Görüntüleme',
        description: 'Ürün detaylarını görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.urun.ekle',
        permission_name: 'Ürün Ekleme',
        description: 'Yeni ürün ekleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.urun.duzenle',
        permission_name: 'Ürün Düzenleme',
        description: 'Mevcut ürünleri düzenleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.urun.sil',
        permission_name: 'Ürün Silme',
        description: 'Ürün silme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.kategori.liste',
        permission_name: 'Kategori Listesi Görüntüleme',
        description: 'Kategori listesini görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.kategori.detay',
        permission_name: 'Kategori Detayı Görüntüleme',
        description: 'Kategori detaylarını görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.kategori.ekle',
        permission_name: 'Kategori Ekleme',
        description: 'Yeni kategori ekleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.kategori.duzenle',
        permission_name: 'Kategori Düzenleme',
        description: 'Mevcut kategorileri düzenleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.kategori.sil',
        permission_name: 'Kategori Silme',
        description: 'Kategori silme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.hareket.liste',
        permission_name: 'Stok Hareketleri Listesi',
        description: 'Stok hareketleri listesini görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.hareket.detay',
        permission_name: 'Stok Hareketi Detayı',
        description: 'Stok hareketi detaylarını görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.hareket.ekle',
        permission_name: 'Stok Hareketi Ekleme',
        description: 'Yeni stok hareketi ekleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.hareket.duzenle',
        permission_name: 'Stok Hareketi Düzenleme',
        description: 'Stok hareketlerini düzenleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.seviye.goruntule',
        permission_name: 'Stok Seviyesi Görüntüleme',
        description: 'Stok seviyelerini görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.uyari.goruntule',
        permission_name: 'Stok Uyarıları Görüntüleme',
        description: 'Kritik stok uyarılarını görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.rapor.goruntule',
        permission_name: 'Stok Raporları Görüntüleme',
        description: 'Stok raporlarını görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.rapor.export',
        permission_name: 'Stok Raporu Dışa Aktarma',
        description: 'Stok raporlarını dışa aktarma yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'action',
        is_active: true,
        created_at: new Date()
      },
      {
        permission_code: 'stok.ozet.goruntule',
        permission_name: 'Stok Özeti Görüntüleme',
        description: 'Stok özet bilgilerini görüntüleme yetkisi',
        category_id: stockCategory.id,
        module_id: inventoryModule.id,
        permission_type: 'page',
        is_active: true,
        created_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('permissions', permissions);
    const [adminRole] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE role_code = 'ADMIN'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminRole) {
      const permissionIds = await queryInterface.sequelize.query(
        "SELECT id FROM permissions WHERE permission_code LIKE 'stok.%'",
        { type: Sequelize.QueryTypes.SELECT }
      );
      const rolePermissions = permissionIds.map(permission => ({
        role_id: adminRole.id,
        permission_id: permission.id,
        access_type: 'allow',
        created_at: new Date()
      }));

      await queryInterface.bulkInsert('role_permissions', rolePermissions);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DELETE FROM role_permissions WHERE permission_id IN (SELECT id FROM permissions WHERE permission_code LIKE 'stok.%')"
    );

    await queryInterface.sequelize.query(
      "DELETE FROM permissions WHERE permission_code LIKE 'stok.%'"
    );
    await queryInterface.sequelize.query(
      "DELETE FROM permission_categories WHERE category_code = 'STOK'"
    );
    await queryInterface.sequelize.query(
      "DELETE FROM system_modules WHERE module_code = 'INVENTORY'"
    );
  }
};