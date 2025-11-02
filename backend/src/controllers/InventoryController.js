/**
 * Stok Yönetimi Controller
 * Inventory Management API endpoint'leri
 */

const { body, query, validationResult } = require('express-validator');
const InventoryService = require('../services/InventoryService');

class InventoryController {
  constructor() {
    this.inventoryService = new InventoryService();
  }

  /**
   * Ürün listesi (filtreleme ve sayfalama ile)
   */
  async getProducts(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const filters = {
        search: req.query.search,
        categoryId: req.query.categoryId,
        isActive: req.query.isActive,
        criticalStock: req.query.criticalStock,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.inventoryService.getProducts(filters);

      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get products controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Ürün detayı
   */
  async getProductById(req, res) {
    try {
      const productId = parseInt(req.params.id);

      if (!productId || isNaN(productId)) {
        return res.status(400).json({
          error: 'Geçersiz ürün ID',
          code: 'INVALID_PRODUCT_ID'
        });
      }

      const result = await this.inventoryService.getProductById(productId);

      if (!result.success) {
        return res.status(404).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        data: result.product
      });

    } catch (error) {
      console.error('Get product by id controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Yeni ürün oluşturma
   */
  async createProduct(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const productData = req.body;

      const result = await this.inventoryService.createProduct(productData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.product
      });

    } catch (error) {
      console.error('Create product controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Ürün güncelleme
   */
  async updateProduct(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const productId = parseInt(req.params.id);
      const updateData = req.body;

      if (!productId || isNaN(productId)) {
        return res.status(400).json({
          error: 'Geçersiz ürün ID',
          code: 'INVALID_PRODUCT_ID'
        });
      }

      const result = await this.inventoryService.updateProduct(productId, updateData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.product
      });

    } catch (error) {
      console.error('Update product controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Ürün silme (soft delete)
   */
  async deleteProduct(req, res) {
    try {
      const productId = parseInt(req.params.id);

      if (!productId || isNaN(productId)) {
        return res.status(400).json({
          error: 'Geçersiz ürün ID',
          code: 'INVALID_PRODUCT_ID'
        });
      }

      const result = await this.inventoryService.deleteProduct(productId);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Delete product controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kategori listesi
   */
  async getCategories(req, res) {
    try {
      const filters = {
        search: req.query.search,
        isActive: req.query.isActive,
        parentId: req.query.parentId,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.inventoryService.getCategories(filters);

      res.json({
        success: true,
        data: result.categories,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get categories controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kategori detayı
   */
  async getCategoryById(req, res) {
    try {
      const categoryId = parseInt(req.params.id);

      if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({
          error: 'Geçersiz kategori ID',
          code: 'INVALID_CATEGORY_ID'
        });
      }

      const result = await this.inventoryService.getCategoryById(categoryId);

      if (!result.success) {
        return res.status(404).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        data: result.category
      });

    } catch (error) {
      console.error('Get category by id controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Yeni kategori oluşturma
   */
  async createCategory(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const categoryData = req.body;

      const result = await this.inventoryService.createCategory(categoryData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.category
      });

    } catch (error) {
      console.error('Create category controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kategori güncelleme
   */
  async updateCategory(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const categoryId = parseInt(req.params.id);
      const updateData = req.body;

      if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({
          error: 'Geçersiz kategori ID',
          code: 'INVALID_CATEGORY_ID'
        });
      }

      const result = await this.inventoryService.updateCategory(categoryId, updateData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.category
      });

    } catch (error) {
      console.error('Update category controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kategori silme (soft delete)
   */
  async deleteCategory(req, res) {
    try {
      const categoryId = parseInt(req.params.id);

      if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({
          error: 'Geçersiz kategori ID',
          code: 'INVALID_CATEGORY_ID'
        });
      }

      const result = await this.inventoryService.deleteCategory(categoryId);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Delete category controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Stok hareketi oluşturma
   */
  async createStockMovement(req, res) {
    try {
      // Validation kontrolü
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Doğrulama hatası',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const movementData = {
        ...req.body,
        user_id: req.user.id // Auth middleware'den gelen kullanıcı
      };

      const result = await this.inventoryService.createStockMovement(movementData);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.movement
      });

    } catch (error) {
      console.error('Create stock movement controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Stok hareketleri listesi
   */
  async getStockMovements(req, res) {
    try {
      const filters = {
        productId: req.query.productId,
        movementType: req.query.movementType,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.inventoryService.getStockMovements(filters);

      res.json({
        success: true,
        data: result.movements,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get stock movements controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Stok seviyesi sorgulama
   */
  async getStockLevels(req, res) {
    try {
      const filters = {
        productId: req.query.productId,
        categoryId: req.query.categoryId,
        criticalOnly: req.query.criticalOnly === 'true',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.inventoryService.getStockLevels(filters);

      res.json({
        success: true,
        data: result.stockLevels,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get stock levels controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Kritik stok uyarıları
   */
  async getCriticalStockAlerts(req, res) {
    try {
      const result = await this.inventoryService.getCriticalStockAlerts();

      res.json({
        success: true,
        data: result.alerts,
        count: result.count
      });

    } catch (error) {
      console.error('Get critical stock alerts controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Stok raporu oluşturma
   */
  async generateStockReport(req, res) {
    try {
      const filters = {
        categoryId: req.query.categoryId,
        includeMovements: req.query.includeMovements === 'true',
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        format: req.query.format || 'json' // json, excel, pdf
      };

      const result = await this.inventoryService.generateStockReport(filters);

      if (!result.success) {
        return res.status(400).json({
          error: result.error,
          code: result.code
        });
      }

      // Format'a göre response
      if (filters.format === 'excel') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=stok-raporu.xlsx');
        return res.send(result.data);
      } else if (filters.format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=stok-raporu.pdf');
        return res.send(result.data);
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Generate stock report controller hatası:', error);
      res.status(500).json({
        error: 'Sunucu hatası',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // Validation Rules

  /**
   * Ürün listesi filtreleme validation rules
   */
  static getProductsValidation() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Sayfa numarası pozitif bir sayı olmalı'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit 1-100 arası olmalı'),
      
      query('search')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Arama terimi 2-100 karakter arası olmalı'),
      
      query('categoryId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Kategori ID pozitif bir sayı olmalı'),
      
      query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive boolean değer olmalı'),
      
      query('criticalStock')
        .optional()
        .isBoolean()
        .withMessage('criticalStock boolean değer olmalı')
    ];
  }

  /**
   * Ürün oluşturma validation rules
   */
  static getCreateProductValidation() {
    return [
      body('product_code')
        .notEmpty()
        .withMessage('Ürün kodu gerekli')
        .isLength({ min: 1, max: 50 })
        .withMessage('Ürün kodu 1-50 karakter arası olmalı')
        .trim(),
      
      body('product_name')
        .notEmpty()
        .withMessage('Ürün adı gerekli')
        .isLength({ min: 1, max: 200 })
        .withMessage('Ürün adı 1-200 karakter arası olmalı')
        .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Açıklama maksimum 1000 karakter olabilir')
        .trim(),
      
      body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Kategori ID pozitif bir sayı olmalı'),
      
      body('unit')
        .notEmpty()
        .withMessage('Birim gerekli')
        .isLength({ min: 1, max: 20 })
        .withMessage('Birim 1-20 karakter arası olmalı')
        .trim(),
      
      body('critical_stock_level')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Kritik stok seviyesi negatif olamaz'),
      
      body('purchase_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Alış fiyatı negatif olamaz'),
      
      body('sale_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Satış fiyatı negatif olamaz'),
      
      body('tax_rate')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('KDV oranı 0-100 arası olmalı')
    ];
  }

  /**
   * Ürün güncelleme validation rules
   */
  static getUpdateProductValidation() {
    return [
      body('product_code')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Ürün kodu 1-50 karakter arası olmalı')
        .trim(),
      
      body('product_name')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Ürün adı 1-200 karakter arası olmalı')
        .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Açıklama maksimum 1000 karakter olabilir')
        .trim(),
      
      body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Kategori ID pozitif bir sayı olmalı'),
      
      body('unit')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('Birim 1-20 karakter arası olmalı')
        .trim(),
      
      body('critical_stock_level')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Kritik stok seviyesi negatif olamaz'),
      
      body('purchase_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Alış fiyatı negatif olamaz'),
      
      body('sale_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Satış fiyatı negatif olamaz'),
      
      body('tax_rate')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('KDV oranı 0-100 arası olmalı')
    ];
  }

  /**
   * Kategori oluşturma validation rules
   */
  static getCreateCategoryValidation() {
    return [
      body('category_code')
        .notEmpty()
        .withMessage('Kategori kodu gerekli')
        .isLength({ min: 1, max: 50 })
        .withMessage('Kategori kodu 1-50 karakter arası olmalı')
        .trim(),
      
      body('category_name')
        .notEmpty()
        .withMessage('Kategori adı gerekli')
        .isLength({ min: 1, max: 100 })
        .withMessage('Kategori adı 1-100 karakter arası olmalı')
        .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Açıklama maksimum 500 karakter olabilir')
        .trim(),
      
      body('parent_category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Üst kategori ID pozitif bir sayı olmalı')
    ];
  }

  /**
   * Kategori güncelleme validation rules
   */
  static getUpdateCategoryValidation() {
    return [
      body('category_code')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Kategori kodu 1-50 karakter arası olmalı')
        .trim(),
      
      body('category_name')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Kategori adı 1-100 karakter arası olmalı')
        .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Açıklama maksimum 500 karakter olabilir')
        .trim(),
      
      body('parent_category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Üst kategori ID pozitif bir sayı olmalı')
    ];
  }

  /**
   * Stok hareketi oluşturma validation rules
   */
  static getCreateStockMovementValidation() {
    return [
      body('product_id')
        .notEmpty()
        .withMessage('Ürün ID gerekli')
        .isInt({ min: 1 })
        .withMessage('Ürün ID pozitif bir sayı olmalı'),
      
      body('movement_type')
        .notEmpty()
        .withMessage('Hareket tipi gerekli')
        .isIn(['in', 'out', 'transfer', 'adjustment'])
        .withMessage('Hareket tipi in, out, transfer veya adjustment olmalı'),
      
      body('quantity')
        .notEmpty()
        .withMessage('Miktar gerekli')
        .isInt({ min: 1 })
        .withMessage('Miktar pozitif bir sayı olmalı'),
      
      body('unit_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Birim fiyat negatif olamaz'),
      
      body('currency')
        .optional()
        .isLength({ min: 3, max: 3 })
        .withMessage('Para birimi 3 karakter olmalı')
        .isAlpha()
        .withMessage('Para birimi sadece harf içerebilir'),
      
      body('reference_type')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Referans tipi 1-50 karakter arası olmalı'),
      
      body('reference_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Referans ID pozitif bir sayı olmalı'),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Açıklama maksimum 500 karakter olabilir')
        .trim()
    ];
  }
}

module.exports = InventoryController;