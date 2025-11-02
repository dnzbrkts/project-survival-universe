'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Örnek kategoriler ekle
    await queryInterface.bulkInsert('product_categories', [
      {
        category_code: 'ELEKTRONIK',
        category_name: 'Elektronik',
        description: 'Elektronik ürünler ve bileşenler',
        parent_category_id: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'BILGISAYAR',
        category_name: 'Bilgisayar',
        description: 'Bilgisayar ve bilgisayar bileşenleri',
        parent_category_id: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'TELEFON',
        category_name: 'Telefon',
        description: 'Cep telefonu ve aksesuarları',
        parent_category_id: null,
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
    const categories = await queryInterface.sequelize.query(
      "SELECT id, category_code FROM product_categories",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const getCategoryId = (code) => {
      const category = categories.find(c => c.category_code === code);
      return category ? category.id : null;
    };
    await queryInterface.bulkInsert('product_categories', [
      {
        category_code: 'LAPTOP',
        category_name: 'Laptop',
        description: 'Dizüstü bilgisayarlar',
        parent_category_id: getCategoryId('BILGISAYAR'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'MASAUSTU',
        category_name: 'Masaüstü',
        description: 'Masaüstü bilgisayarlar',
        parent_category_id: getCategoryId('BILGISAYAR'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'AKILLI_TELEFON',
        category_name: 'Akıllı Telefon',
        description: 'Akıllı telefonlar',
        parent_category_id: getCategoryId('TELEFON'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_code: 'TELEFON_AKSESUAR',
        category_name: 'Telefon Aksesuarları',
        description: 'Telefon kılıfı, şarj aleti vb.',
        parent_category_id: getCategoryId('TELEFON'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    const allCategories = await queryInterface.sequelize.query(
      "SELECT id, category_code FROM product_categories",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const getUpdatedCategoryId = (code) => {
      const category = allCategories.find(c => c.category_code === code);
      return category ? category.id : null;
    };

    await queryInterface.bulkInsert('products', [
      {
        product_code: 'LP001',
        product_name: 'Dell Inspiron 15 3000',
        description: '15.6" HD ekran, Intel Core i3, 4GB RAM, 1TB HDD',
        category_id: getUpdatedCategoryId('LAPTOP'),
        unit: 'Adet',
        critical_stock_level: 5,
        purchase_price: 3500.00,
        sale_price: 4200.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'LP002',
        product_name: 'HP Pavilion 14',
        description: '14" FHD ekran, AMD Ryzen 5, 8GB RAM, 256GB SSD',
        category_id: getUpdatedCategoryId('LAPTOP'),
        unit: 'Adet',
        critical_stock_level: 3,
        purchase_price: 5200.00,
        sale_price: 6100.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'LP003',
        product_name: 'Lenovo ThinkPad E14',
        description: '14" FHD ekran, Intel Core i5, 8GB RAM, 512GB SSD',
        category_id: getUpdatedCategoryId('LAPTOP'),
        unit: 'Adet',
        critical_stock_level: 2,
        purchase_price: 7800.00,
        sale_price: 9200.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'PC001',
        product_name: 'HP Desktop Pro',
        description: 'Intel Core i5, 8GB RAM, 1TB HDD, Windows 11',
        category_id: getUpdatedCategoryId('MASAUSTU'),
        unit: 'Adet',
        critical_stock_level: 3,
        purchase_price: 4500.00,
        sale_price: 5400.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'PC002',
        product_name: 'Dell OptiPlex 3090',
        description: 'Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Pro',
        category_id: getUpdatedCategoryId('MASAUSTU'),
        unit: 'Adet',
        critical_stock_level: 2,
        purchase_price: 8200.00,
        sale_price: 9800.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'PH001',
        product_name: 'Samsung Galaxy A54',
        description: '6.4" Super AMOLED, 128GB, 6GB RAM, 50MP kamera',
        category_id: getUpdatedCategoryId('AKILLI_TELEFON'),
        unit: 'Adet',
        critical_stock_level: 10,
        purchase_price: 4200.00,
        sale_price: 5100.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'PH002',
        product_name: 'iPhone 14',
        description: '6.1" Super Retina XDR, 128GB, A15 Bionic chip',
        category_id: getUpdatedCategoryId('AKILLI_TELEFON'),
        unit: 'Adet',
        critical_stock_level: 5,
        purchase_price: 12500.00,
        sale_price: 14800.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'PH003',
        product_name: 'Xiaomi Redmi Note 12',
        description: '6.67" AMOLED, 128GB, 4GB RAM, 50MP kamera',
        category_id: getUpdatedCategoryId('AKILLI_TELEFON'),
        unit: 'Adet',
        critical_stock_level: 15,
        purchase_price: 2800.00,
        sale_price: 3400.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'ACC001',
        product_name: 'Telefon Kılıfı - Universal',
        description: 'Silikon telefon kılıfı, çeşitli renkler',
        category_id: getUpdatedCategoryId('TELEFON_AKSESUAR'),
        unit: 'Adet',
        critical_stock_level: 50,
        purchase_price: 15.00,
        sale_price: 25.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'ACC002',
        product_name: 'USB-C Şarj Kablosu',
        description: '1 metre USB-C şarj ve data kablosu',
        category_id: getUpdatedCategoryId('TELEFON_AKSESUAR'),
        unit: 'Adet',
        critical_stock_level: 30,
        purchase_price: 25.00,
        sale_price: 40.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'ACC003',
        product_name: 'Wireless Şarj Pedi',
        description: '15W kablosuz şarj pedi, Qi uyumlu',
        category_id: getUpdatedCategoryId('TELEFON_AKSESUAR'),
        unit: 'Adet',
        critical_stock_level: 20,
        purchase_price: 120.00,
        sale_price: 180.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'OFF001',
        product_name: 'A4 Fotokopi Kağıdı',
        description: '80gr A4 beyaz fotokopi kağıdı, 500 yaprak',
        category_id: getUpdatedCategoryId('OFIS'),
        unit: 'Paket',
        critical_stock_level: 100,
        purchase_price: 35.00,
        sale_price: 45.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'OFF002',
        product_name: 'Tükenmez Kalem - Mavi',
        description: 'Mavi mürekkepli tükenmez kalem',
        category_id: getUpdatedCategoryId('OFIS'),
        unit: 'Adet',
        critical_stock_level: 200,
        purchase_price: 2.50,
        sale_price: 4.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_code: 'OFF003',
        product_name: 'Dosya Klasörü',
        description: 'Karton dosya klasörü, çeşitli renkler',
        category_id: getUpdatedCategoryId('OFIS'),
        unit: 'Adet',
        critical_stock_level: 50,
        purchase_price: 8.00,
        sale_price: 12.00,
        tax_rate: 20.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    const [adminUser] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = 'admin' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminUser) {
      // Ürün ID'lerini al
      const products = await queryInterface.sequelize.query(
        "SELECT id, product_code FROM products",
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Örnek stok hareketleri ekle (başlangıç stokları)
      const stockMovements = [];
      products.forEach(product => {
        let initialStock;
        if (product.product_code.startsWith('LP') || product.product_code.startsWith('PC') || product.product_code.startsWith('PH')) {
          initialStock = Math.floor(Math.random() * 20) + 5;
        } else if (product.product_code.startsWith('ACC')) {
          initialStock = Math.floor(Math.random() * 100) + 50;
        } else if (product.product_code.startsWith('OFF')) {
          initialStock = Math.floor(Math.random() * 200) + 100;
        } else {
          initialStock = Math.floor(Math.random() * 50) + 10;
        }

        stockMovements.push({
          product_id: product.id,
          movement_type: 'in',
          quantity: initialStock,
          unit_price: null,
          currency: 'TRY',
          reference_type: 'initial_stock',
          reference_id: null,
          description: 'Başlangıç stoku',
          user_id: adminUser.id,
          created_at: new Date()
        });
      });

      await queryInterface.bulkInsert('stock_movements', stockMovements);

      const additionalMovements = [
        {
          product_id: products.find(p => p.product_code === 'LP001').id,
          movement_type: 'out',
          quantity: 3,
          unit_price: 4200.00,
          currency: 'TRY',
          reference_type: 'sale',
          reference_id: null,
          description: 'Satış',
          user_id: adminUser.id,
          created_at: new Date(Date.now() - 86400000)
        },
        {
          product_id: products.find(p => p.product_code === 'LP002').id,
          movement_type: 'out',
          quantity: 2,
          unit_price: 6100.00,
          currency: 'TRY',
          reference_type: 'sale',
          reference_id: null,
          description: 'Satış',
          user_id: adminUser.id,
          created_at: new Date(Date.now() - 172800000)
        },
        {
          product_id: products.find(p => p.product_code === 'PH001').id,
          movement_type: 'out',
          quantity: 5,
          unit_price: 5100.00,
          currency: 'TRY',
          reference_type: 'sale',
          reference_id: null,
          description: 'Satış',
          user_id: adminUser.id,
          created_at: new Date(Date.now() - 259200000)
        },
        {
          product_id: products.find(p => p.product_code === 'ACC001').id,
          movement_type: 'out',
          quantity: 25,
          unit_price: 25.00,
          currency: 'TRY',
          reference_type: 'sale',
          reference_id: null,
          description: 'Toplu satış',
          user_id: adminUser.id,
          created_at: new Date(Date.now() - 345600000)
        },
        {
          product_id: products.find(p => p.product_code === 'LP003').id,
          movement_type: 'in',
          quantity: 5,
          unit_price: 7800.00,
          currency: 'TRY',
          reference_type: 'purchase',
          reference_id: null,
          description: 'Yeni alım',
          user_id: adminUser.id,
          created_at: new Date(Date.now() - 432000000)
        }
      ];

      await queryInterface.bulkInsert('stock_movements', additionalMovements);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stock_movements', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('product_categories', {
      parent_category_id: { [Sequelize.Op.ne]: null }
    }, {});
    await queryInterface.bulkDelete('product_categories', {
      parent_category_id: null
    }, {});
  }
};