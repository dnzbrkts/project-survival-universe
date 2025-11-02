/**
 * Stok Yönetimi Routes
 */

const express = require('express');
const router = express.Router();

const InventoryController = require('../controllers/InventoryController');
const { authMiddleware, permissionMiddleware } = require('../middleware');

const inventoryController = new InventoryController();

router.use(authMiddleware.authenticateToken());

// Ürün yönetimi
router.get('/products',
  permissionMiddleware('stok.urun.liste'),
  InventoryController.getProductsValidation(),
  inventoryController.getProducts.bind(inventoryController)
);

router.get('/products/:id',
  permissionMiddleware('stok.urun.liste'),
  inventoryController.getProductById.bind(inventoryController)
);

router.post('/products',
  permissionMiddleware('stok.urun.ekle'),
  InventoryController.getCreateProductValidation(),
  inventoryController.createProduct.bind(inventoryController)
);

router.put('/products/:id',
  permissionMiddleware('stok.urun.duzenle'),
  InventoryController.getUpdateProductValidation(),
  inventoryController.updateProduct.bind(inventoryController)
);

router.delete('/products/:id',
  permissionMiddleware('stok.urun.sil'),
  inventoryController.deleteProduct.bind(inventoryController)
);

// Kategori yönetimi
router.get('/categories',
  permissionMiddleware('stok.kategori.liste'),
  inventoryController.getCategories.bind(inventoryController)
);

router.get('/categories/:id',
  permissionMiddleware('stok.kategori.liste'),
  inventoryController.getCategoryById.bind(inventoryController)
);

router.post('/categories',
  permissionMiddleware('stok.kategori.ekle'),
  InventoryController.getCreateCategoryValidation(),
  inventoryController.createCategory.bind(inventoryController)
);

router.put('/categories/:id',
  permissionMiddleware('stok.kategori.duzenle'),
  InventoryController.getUpdateCategoryValidation(),
  inventoryController.updateCategory.bind(inventoryController)
);

router.delete('/categories/:id',
  permissionMiddleware('stok.kategori.sil'),
  inventoryController.deleteCategory.bind(inventoryController)
);

// Stok hareketleri
router.post('/movements',
  permissionMiddleware('stok.hareket.ekle'),
  InventoryController.getCreateStockMovementValidation(),
  inventoryController.createStockMovement.bind(inventoryController)
);

router.get('/movements',
  permissionMiddleware('stok.hareket.liste'),
  inventoryController.getStockMovements.bind(inventoryController)
);

// Stok seviyeleri ve raporlar
router.get('/stock-levels',
  permissionMiddleware('stok.seviye.goruntule'),
  inventoryController.getStockLevels.bind(inventoryController)
);

router.get('/critical-alerts',
  permissionMiddleware('stok.uyari.goruntule'),
  inventoryController.getCriticalStockAlerts.bind(inventoryController)
);

router.get('/reports/stock',
  permissionMiddleware('stok.rapor.goruntule'),
  inventoryController.generateStockReport.bind(inventoryController)
);

// Dashboard ve arama
router.get('/dashboard/summary',
  permissionMiddleware('stok.ozet.goruntule'),
  async (req, res) => {
    try {
      const inventoryService = new (require('../services/InventoryService'))();
      
      const [totalProducts, criticalAlerts, recentMovements] = await Promise.all([
        inventoryService.getProducts({ limit: 1 }),
        inventoryService.getCriticalStockAlerts(),
        inventoryService.getStockMovements({ limit: 5 })
      ]);

      res.json({
        success: true,
        data: {
          total_products: totalProducts.pagination.total,
          critical_stock_count: criticalAlerts.count,
          recent_movements: recentMovements.movements
        }
      });

    } catch (error) {
      console.error('Dashboard summary hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
);

router.get('/search/products',
  permissionMiddleware('stok.urun.liste'),
  async (req, res) => {
    try {
      const { q: search, limit = 10 } = req.query;

      if (!search || search.length < 2) {
        return res.json({ success: true, data: [] });
      }

      const inventoryService = new (require('../services/InventoryService'))();
      const result = await inventoryService.getProducts({
        search,
        limit: parseInt(limit),
        page: 1
      });

      const products = result.products.map(product => ({
        id: product.id,
        product_code: product.product_code,
        product_name: product.product_name,
        unit: product.unit,
        current_stock: product.current_stock,
        sale_price: product.sale_price
      }));

      res.json({ success: true, data: products });

    } catch (error) {
      console.error('Product search hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
);

router.get('/search/categories',
  permissionMiddleware('stok.kategori.liste'),
  async (req, res) => {
    try {
      const { q: search, limit = 10 } = req.query;

      if (!search || search.length < 2) {
        return res.json({ success: true, data: [] });
      }

      const inventoryService = new (require('../services/InventoryService'))();
      const result = await inventoryService.getCategories({
        search,
        limit: parseInt(limit),
        page: 1,
        isActive: 'true'
      });

      const categories = result.categories.map(category => ({
        id: category.id,
        category_code: category.category_code,
        category_name: category.category_name,
        product_count: category.product_count
      }));

      res.json({ success: true, data: categories });

    } catch (error) {
      console.error('Category search hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
);

module.exports = router;