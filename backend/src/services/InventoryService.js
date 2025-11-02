/**
 * Stok Yönetimi Service
 * Inventory Management iş mantığı
 */

const { Op } = require('sequelize');
const { Product, ProductCategory, StockMovement, User } = require('../models');

class InventoryService {
  
  /**
   * Ürün listesi (filtreleme ve sayfalama ile)
   */
  async getProducts(filters = {}) {
    try {
      const {
        search,
        categoryId,
        isActive,
        criticalStock,
        page = 1,
        limit = 10
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = {};
      const includeClause = [
        {
          model: ProductCategory,
          as: 'category',
          attributes: ['id', 'category_name', 'category_code']
        }
      ];

      // Arama filtresi
      if (search) {
        whereClause[Op.or] = [
          { product_name: { [Op.iLike]: `%${search}%` } },
          { product_code: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Kategori filtresi
      if (categoryId) {
        whereClause.category_id = categoryId;
      }

      // Aktiflik filtresi
      if (isActive !== undefined) {
        whereClause.is_active = isActive === 'true';
      }

      // Temel sorgu
      let query = {
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: offset,
        order: [['created_at', 'DESC']],
        distinct: true
      };

      // Kritik stok filtresi için özel sorgu
      if (criticalStock === 'true') {
        // Kritik stok seviyesindeki ürünleri bulmak için alt sorgu kullanıyoruz
        const criticalProducts = await this.getCriticalStockProducts();
        const criticalProductIds = criticalProducts.map(p => p.id);
        
        if (criticalProductIds.length > 0) {
          whereClause.id = { [Op.in]: criticalProductIds };
        } else {
          // Kritik stok ürünü yoksa boş sonuç döndür
          return {
            products: [],
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: 0,
              totalPages: 0
            }
          };
        }
      }

      const { count, rows: products } = await Product.findAndCountAll(query);

      // Her ürün için mevcut stok seviyesini hesapla
      const productsWithStock = await Promise.all(
        products.map(async (product) => {
          const currentStock = await this.getCurrentStockForProduct(product.id);
          const isCritical = currentStock <= product.critical_stock_level;
          
          return {
            ...product.toJSON(),
            current_stock: currentStock,
            is_critical_stock: isCritical
          };
        })
      );

      return {
        products: productsWithStock,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };

    } catch (error) {
      console.error('Get products service hatası:', error);
      throw error;
    }
  }

  /**
   * Ürün detayı
   */
  async getProductById(productId) {
    try {
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['id', 'category_name', 'category_code']
          },
          {
            model: StockMovement,
            as: 'stockMovements',
            limit: 10,
            order: [['created_at', 'DESC']],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'first_name', 'last_name']
              }
            ]
          }
        ]
      });

      if (!product) {
        return {
          success: false,
          error: 'Ürün bulunamadı',
          code: 'PRODUCT_NOT_FOUND'
        };
      }

      // Mevcut stok seviyesini hesapla
      const currentStock = await this.getCurrentStockForProduct(productId);
      const isCritical = currentStock <= product.critical_stock_level;

      return {
        success: true,
        product: {
          ...product.toJSON(),
          current_stock: currentStock,
          is_critical_stock: isCritical
        }
      };

    } catch (error) {
      console.error('Get product by id service hatası:', error);
      throw error;
    }
  }

  /**
   * Yeni ürün oluşturma
   */
  async createProduct(productData) {
    try {
      // Ürün kodu benzersizlik kontrolü
      const existingProduct = await Product.findOne({
        where: { product_code: productData.product_code }
      });

      if (existingProduct) {
        return {
          success: false,
          error: 'Bu ürün kodu zaten kullanılıyor',
          code: 'PRODUCT_CODE_EXISTS'
        };
      }

      // Kategori kontrolü
      if (productData.category_id) {
        const category = await ProductCategory.findByPk(productData.category_id);
        if (!category) {
          return {
            success: false,
            error: 'Geçersiz kategori',
            code: 'INVALID_CATEGORY'
          };
        }
      }

      const product = await Product.create(productData);

      // Oluşturulan ürünü kategori bilgisi ile birlikte getir
      const createdProduct = await Product.findByPk(product.id, {
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['id', 'category_name', 'category_code']
          }
        ]
      });

      return {
        success: true,
        message: 'Ürün başarıyla oluşturuldu',
        product: {
          ...createdProduct.toJSON(),
          current_stock: 0,
          is_critical_stock: 0 <= product.critical_stock_level
        }
      };

    } catch (error) {
      console.error('Create product service hatası:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return {
          success: false,
          error: 'Bu ürün kodu zaten kullanılıyor',
          code: 'PRODUCT_CODE_EXISTS'
        };
      }
      
      throw error;
    }
  }

  /**
   * Ürün güncelleme
   */
  async updateProduct(productId, updateData) {
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        return {
          success: false,
          error: 'Ürün bulunamadı',
          code: 'PRODUCT_NOT_FOUND'
        };
      }

      // Ürün kodu benzersizlik kontrolü (kendisi hariç)
      if (updateData.product_code && updateData.product_code !== product.product_code) {
        const existingProduct = await Product.findOne({
          where: { 
            product_code: updateData.product_code,
            id: { [Op.ne]: productId }
          }
        });

        if (existingProduct) {
          return {
            success: false,
            error: 'Bu ürün kodu zaten kullanılıyor',
            code: 'PRODUCT_CODE_EXISTS'
          };
        }
      }

      // Kategori kontrolü
      if (updateData.category_id) {
        const category = await ProductCategory.findByPk(updateData.category_id);
        if (!category) {
          return {
            success: false,
            error: 'Geçersiz kategori',
            code: 'INVALID_CATEGORY'
          };
        }
      }

      await product.update(updateData);

      // Güncellenmiş ürünü kategori bilgisi ile birlikte getir
      const updatedProduct = await Product.findByPk(productId, {
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['id', 'category_name', 'category_code']
          }
        ]
      });

      const currentStock = await this.getCurrentStockForProduct(productId);

      return {
        success: true,
        message: 'Ürün başarıyla güncellendi',
        product: {
          ...updatedProduct.toJSON(),
          current_stock: currentStock,
          is_critical_stock: currentStock <= updatedProduct.critical_stock_level
        }
      };

    } catch (error) {
      console.error('Update product service hatası:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return {
          success: false,
          error: 'Bu ürün kodu zaten kullanılıyor',
          code: 'PRODUCT_CODE_EXISTS'
        };
      }
      
      throw error;
    }
  }

  /**
   * Ürün silme (soft delete)
   */
  async deleteProduct(productId) {
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        return {
          success: false,
          error: 'Ürün bulunamadı',
          code: 'PRODUCT_NOT_FOUND'
        };
      }

      // Stok hareketi kontrolü
      const hasMovements = await StockMovement.findOne({
        where: { product_id: productId }
      });

      if (hasMovements) {
        // Stok hareketi varsa sadece pasif yap
        await product.update({ is_active: false });
        
        return {
          success: true,
          message: 'Ürün pasif duruma getirildi (stok hareketleri mevcut)'
        };
      } else {
        // Stok hareketi yoksa tamamen sil
        await product.destroy();
        
        return {
          success: true,
          message: 'Ürün başarıyla silindi'
        };
      }

    } catch (error) {
      console.error('Delete product service hatası:', error);
      throw error;
    }
  }

  /**
   * Kategori listesi
   */
  async getCategories(filters = {}) {
    try {
      const {
        search,
        isActive,
        parentId,
        page = 1,
        limit = 10
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Arama filtresi
      if (search) {
        whereClause[Op.or] = [
          { category_name: { [Op.iLike]: `%${search}%` } },
          { category_code: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Aktiflik filtresi
      if (isActive !== undefined) {
        whereClause.is_active = isActive === 'true';
      }

      // Üst kategori filtresi
      if (parentId !== undefined) {
        whereClause.parent_category_id = parentId === 'null' ? null : parentId;
      }

      const { count, rows: categories } = await ProductCategory.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: ProductCategory,
            as: 'parentCategory',
            attributes: ['id', 'category_name', 'category_code']
          },
          {
            model: ProductCategory,
            as: 'subCategories',
            attributes: ['id', 'category_name', 'category_code'],
            where: { is_active: true },
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['created_at', 'DESC']],
        distinct: true
      });

      // Her kategori için ürün sayısını hesapla
      const categoriesWithProductCount = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Product.count({
            where: { 
              category_id: category.id,
              is_active: true
            }
          });
          
          return {
            ...category.toJSON(),
            product_count: productCount
          };
        })
      );

      return {
        categories: categoriesWithProductCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };

    } catch (error) {
      console.error('Get categories service hatası:', error);
      throw error;
    }
  }

  /**
   * Kategori detayı
   */
  async getCategoryById(categoryId) {
    try {
      const category = await ProductCategory.findByPk(categoryId, {
        include: [
          {
            model: ProductCategory,
            as: 'parentCategory',
            attributes: ['id', 'category_name', 'category_code']
          },
          {
            model: ProductCategory,
            as: 'subCategories',
            attributes: ['id', 'category_name', 'category_code'],
            where: { is_active: true },
            required: false
          },
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'product_name', 'product_code', 'is_active'],
            limit: 10,
            order: [['created_at', 'DESC']]
          }
        ]
      });

      if (!category) {
        return {
          success: false,
          error: 'Kategori bulunamadı',
          code: 'CATEGORY_NOT_FOUND'
        };
      }

      // Toplam ürün sayısını hesapla
      const totalProductCount = await Product.count({
        where: { 
          category_id: categoryId,
          is_active: true
        }
      });

      return {
        success: true,
        category: {
          ...category.toJSON(),
          total_product_count: totalProductCount
        }
      };

    } catch (error) {
      console.error('Get category by id service hatası:', error);
      throw error;
    }
  }

  /**
   * Yeni kategori oluşturma
   */
  async createCategory(categoryData) {
    try {
      // Kategori kodu benzersizlik kontrolü
      const existingCategory = await ProductCategory.findOne({
        where: { category_code: categoryData.category_code }
      });

      if (existingCategory) {
        return {
          success: false,
          error: 'Bu kategori kodu zaten kullanılıyor',
          code: 'CATEGORY_CODE_EXISTS'
        };
      }

      // Üst kategori kontrolü
      if (categoryData.parent_category_id) {
        const parentCategory = await ProductCategory.findByPk(categoryData.parent_category_id);
        if (!parentCategory) {
          return {
            success: false,
            error: 'Geçersiz üst kategori',
            code: 'INVALID_PARENT_CATEGORY'
          };
        }
      }

      const category = await ProductCategory.create(categoryData);

      // Oluşturulan kategoriyi üst kategori bilgisi ile birlikte getir
      const createdCategory = await ProductCategory.findByPk(category.id, {
        include: [
          {
            model: ProductCategory,
            as: 'parentCategory',
            attributes: ['id', 'category_name', 'category_code']
          }
        ]
      });

      return {
        success: true,
        message: 'Kategori başarıyla oluşturuldu',
        category: {
          ...createdCategory.toJSON(),
          product_count: 0
        }
      };

    } catch (error) {
      console.error('Create category service hatası:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return {
          success: false,
          error: 'Bu kategori kodu zaten kullanılıyor',
          code: 'CATEGORY_CODE_EXISTS'
        };
      }
      
      throw error;
    }
  }

  /**
   * Kategori güncelleme
   */
  async updateCategory(categoryId, updateData) {
    try {
      const category = await ProductCategory.findByPk(categoryId);

      if (!category) {
        return {
          success: false,
          error: 'Kategori bulunamadı',
          code: 'CATEGORY_NOT_FOUND'
        };
      }

      // Kategori kodu benzersizlik kontrolü (kendisi hariç)
      if (updateData.category_code && updateData.category_code !== category.category_code) {
        const existingCategory = await ProductCategory.findOne({
          where: { 
            category_code: updateData.category_code,
            id: { [Op.ne]: categoryId }
          }
        });

        if (existingCategory) {
          return {
            success: false,
            error: 'Bu kategori kodu zaten kullanılıyor',
            code: 'CATEGORY_CODE_EXISTS'
          };
        }
      }

      // Üst kategori kontrolü ve döngüsel referans kontrolü
      if (updateData.parent_category_id) {
        if (updateData.parent_category_id === categoryId) {
          return {
            success: false,
            error: 'Kategori kendisinin üst kategorisi olamaz',
            code: 'CIRCULAR_REFERENCE'
          };
        }

        const parentCategory = await ProductCategory.findByPk(updateData.parent_category_id);
        if (!parentCategory) {
          return {
            success: false,
            error: 'Geçersiz üst kategori',
            code: 'INVALID_PARENT_CATEGORY'
          };
        }

        // Döngüsel referans kontrolü (alt kategorilerden birini üst kategori yapmaya çalışıyor mu?)
        const isDescendant = await this.isDescendantCategory(categoryId, updateData.parent_category_id);
        if (isDescendant) {
          return {
            success: false,
            error: 'Alt kategori, üst kategori olarak atanamaz',
            code: 'CIRCULAR_REFERENCE'
          };
        }
      }

      await category.update(updateData);

      // Güncellenmiş kategoriyi üst kategori bilgisi ile birlikte getir
      const updatedCategory = await ProductCategory.findByPk(categoryId, {
        include: [
          {
            model: ProductCategory,
            as: 'parentCategory',
            attributes: ['id', 'category_name', 'category_code']
          }
        ]
      });

      const productCount = await Product.count({
        where: { 
          category_id: categoryId,
          is_active: true
        }
      });

      return {
        success: true,
        message: 'Kategori başarıyla güncellendi',
        category: {
          ...updatedCategory.toJSON(),
          product_count: productCount
        }
      };

    } catch (error) {
      console.error('Update category service hatası:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return {
          success: false,
          error: 'Bu kategori kodu zaten kullanılıyor',
          code: 'CATEGORY_CODE_EXISTS'
        };
      }
      
      throw error;
    }
  }

  /**
   * Kategori silme (soft delete)
   */
  async deleteCategory(categoryId) {
    try {
      const category = await ProductCategory.findByPk(categoryId);

      if (!category) {
        return {
          success: false,
          error: 'Kategori bulunamadı',
          code: 'CATEGORY_NOT_FOUND'
        };
      }

      // Alt kategori kontrolü
      const hasSubCategories = await ProductCategory.findOne({
        where: { parent_category_id: categoryId }
      });

      if (hasSubCategories) {
        return {
          success: false,
          error: 'Alt kategorileri olan kategori silinemez',
          code: 'HAS_SUBCATEGORIES'
        };
      }

      // Ürün kontrolü
      const hasProducts = await Product.findOne({
        where: { category_id: categoryId }
      });

      if (hasProducts) {
        // Ürünleri varsa sadece pasif yap
        await category.update({ is_active: false });
        
        return {
          success: true,
          message: 'Kategori pasif duruma getirildi (ürünler mevcut)'
        };
      } else {
        // Ürün yoksa tamamen sil
        await category.destroy();
        
        return {
          success: true,
          message: 'Kategori başarıyla silindi'
        };
      }

    } catch (error) {
      console.error('Delete category service hatası:', error);
      throw error;
    }
  }

  /**
   * Stok hareketi oluşturma
   */
  async createStockMovement(movementData) {
    try {
      // Ürün kontrolü
      const product = await Product.findByPk(movementData.product_id);
      if (!product) {
        return {
          success: false,
          error: 'Ürün bulunamadı',
          code: 'PRODUCT_NOT_FOUND'
        };
      }

      // Çıkış hareketi için stok kontrolü
      if (movementData.movement_type === 'out') {
        const currentStock = await this.getCurrentStockForProduct(movementData.product_id);
        if (currentStock < movementData.quantity) {
          return {
            success: false,
            error: `Yetersiz stok. Mevcut stok: ${currentStock}`,
            code: 'INSUFFICIENT_STOCK'
          };
        }
      }

      const movement = await StockMovement.create(movementData);

      // Oluşturulan hareketi detayları ile birlikte getir
      const createdMovement = await StockMovement.findByPk(movement.id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'product_name', 'product_code', 'unit']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'first_name', 'last_name']
          }
        ]
      });

      // Güncel stok seviyesini hesapla
      const newStockLevel = await this.getCurrentStockForProduct(movementData.product_id);

      return {
        success: true,
        message: 'Stok hareketi başarıyla oluşturuldu',
        movement: createdMovement,
        new_stock_level: newStockLevel
      };

    } catch (error) {
      console.error('Create stock movement service hatası:', error);
      throw error;
    }
  }

  /**
   * Stok hareketleri listesi
   */
  async getStockMovements(filters = {}) {
    try {
      const {
        productId,
        movementType,
        startDate,
        endDate,
        page = 1,
        limit = 10
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Ürün filtresi
      if (productId) {
        whereClause.product_id = productId;
      }

      // Hareket tipi filtresi
      if (movementType) {
        whereClause.movement_type = movementType;
      }

      // Tarih aralığı filtresi
      if (startDate || endDate) {
        whereClause.created_at = {};
        if (startDate) {
          whereClause.created_at[Op.gte] = new Date(startDate);
        }
        if (endDate) {
          whereClause.created_at[Op.lte] = new Date(endDate + ' 23:59:59');
        }
      }

      const { count, rows: movements } = await StockMovement.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'product_name', 'product_code', 'unit'],
            include: [
              {
                model: ProductCategory,
                as: 'category',
                attributes: ['id', 'category_name']
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'first_name', 'last_name']
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['created_at', 'DESC']]
      });

      return {
        movements,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };

    } catch (error) {
      console.error('Get stock movements service hatası:', error);
      throw error;
    }
  }

  /**
   * Stok seviyesi sorgulama
   */
  async getStockLevels(filters = {}) {
    try {
      const {
        productId,
        categoryId,
        criticalOnly = false,
        page = 1,
        limit = 10
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = { is_active: true };

      // Ürün filtresi
      if (productId) {
        whereClause.id = productId;
      }

      // Kategori filtresi
      if (categoryId) {
        whereClause.category_id = categoryId;
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['id', 'category_name', 'category_code']
          }
        ],
        order: [['product_name', 'ASC']]
      });

      // Her ürün için stok seviyesini hesapla
      let stockLevels = await Promise.all(
        products.map(async (product) => {
          const currentStock = await this.getCurrentStockForProduct(product.id);
          const isCritical = currentStock <= product.critical_stock_level;
          
          return {
            product_id: product.id,
            product_code: product.product_code,
            product_name: product.product_name,
            unit: product.unit,
            current_stock: currentStock,
            critical_stock_level: product.critical_stock_level,
            is_critical: isCritical,
            category: product.category
          };
        })
      );

      // Kritik stok filtresi
      if (criticalOnly) {
        stockLevels = stockLevels.filter(item => item.is_critical);
      }

      // Sayfalama
      const total = stockLevels.length;
      const paginatedStockLevels = stockLevels.slice(offset, offset + limit);

      return {
        stockLevels: paginatedStockLevels,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      console.error('Get stock levels service hatası:', error);
      throw error;
    }
  }

  /**
   * Kritik stok uyarıları
   */
  async getCriticalStockAlerts() {
    try {
      const criticalProducts = await this.getCriticalStockProducts();

      const alerts = await Promise.all(
        criticalProducts.map(async (product) => {
          const currentStock = await this.getCurrentStockForProduct(product.id);
          
          return {
            product_id: product.id,
            product_code: product.product_code,
            product_name: product.product_name,
            unit: product.unit,
            current_stock: currentStock,
            critical_stock_level: product.critical_stock_level,
            shortage: product.critical_stock_level - currentStock,
            category: product.category
          };
        })
      );

      return {
        alerts: alerts.sort((a, b) => a.shortage - b.shortage), // En kritik olanlar önce
        count: alerts.length
      };

    } catch (error) {
      console.error('Get critical stock alerts service hatası:', error);
      throw error;
    }
  }

  /**
   * Stok raporu oluşturma
   */
  async generateStockReport(filters = {}) {
    try {
      const {
        categoryId,
        includeMovements = false,
        startDate,
        endDate,
        format = 'json'
      } = filters;

      const whereClause = { is_active: true };

      // Kategori filtresi
      if (categoryId) {
        whereClause.category_id = categoryId;
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['id', 'category_name', 'category_code']
          }
        ],
        order: [['product_name', 'ASC']]
      });

      // Rapor verilerini hazırla
      const reportData = await Promise.all(
        products.map(async (product) => {
          const currentStock = await this.getCurrentStockForProduct(product.id);
          const isCritical = currentStock <= product.critical_stock_level;
          
          let movements = [];
          if (includeMovements) {
            const movementFilters = {
              productId: product.id,
              startDate,
              endDate,
              limit: 1000 // Rapor için yüksek limit
            };
            const movementResult = await this.getStockMovements(movementFilters);
            movements = movementResult.movements;
          }

          return {
            product_id: product.id,
            product_code: product.product_code,
            product_name: product.product_name,
            category_name: product.category?.category_name || 'Kategorisiz',
            unit: product.unit,
            current_stock: currentStock,
            critical_stock_level: product.critical_stock_level,
            is_critical: isCritical,
            purchase_price: product.purchase_price,
            sale_price: product.sale_price,
            stock_value: currentStock * product.purchase_price,
            movements: movements
          };
        })
      );

      // Format'a göre veri döndür
      if (format === 'json') {
        return {
          success: true,
          data: {
            report_date: new Date().toISOString(),
            filters: filters,
            summary: {
              total_products: reportData.length,
              critical_products: reportData.filter(p => p.is_critical).length,
              total_stock_value: reportData.reduce((sum, p) => sum + p.stock_value, 0)
            },
            products: reportData
          }
        };
      }

      // Excel ve PDF formatları için ayrı implementasyon gerekli
      // Şimdilik JSON döndürüyoruz
      return {
        success: true,
        data: reportData
      };

    } catch (error) {
      console.error('Generate stock report service hatası:', error);
      throw error;
    }
  }

  // Yardımcı metodlar

  /**
   * Ürün için mevcut stok seviyesini hesapla
   */
  async getCurrentStockForProduct(productId) {
    try {
      const movements = await StockMovement.findAll({
        where: { product_id: productId },
        order: [['created_at', 'ASC']]
      });

      return movements.reduce((total, movement) => {
        if (movement.movement_type === 'in' || movement.movement_type === 'adjustment') {
          return total + movement.quantity;
        } else if (movement.movement_type === 'out') {
          return total - movement.quantity;
        }
        return total;
      }, 0);

    } catch (error) {
      console.error('Get current stock for product hatası:', error);
      return 0;
    }
  }

  /**
   * Kritik stok seviyesindeki ürünleri getir
   */
  async getCriticalStockProducts() {
    try {
      const products = await Product.findAll({
        where: { is_active: true },
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['id', 'category_name', 'category_code']
          }
        ]
      });

      const criticalProducts = [];

      for (const product of products) {
        const currentStock = await this.getCurrentStockForProduct(product.id);
        if (currentStock <= product.critical_stock_level) {
          criticalProducts.push(product);
        }
      }

      return criticalProducts;

    } catch (error) {
      console.error('Get critical stock products hatası:', error);
      return [];
    }
  }

  /**
   * Kategori döngüsel referans kontrolü
   */
  async isDescendantCategory(parentId, childId) {
    try {
      const child = await ProductCategory.findByPk(childId);
      
      if (!child || !child.parent_category_id) {
        return false;
      }

      if (child.parent_category_id === parentId) {
        return true;
      }

      return await this.isDescendantCategory(parentId, child.parent_category_id);

    } catch (error) {
      console.error('Is descendant category hatası:', error);
      return false;
    }
  }
}

module.exports = InventoryService;