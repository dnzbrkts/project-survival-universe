'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Association with product category
      Product.belongsTo(models.ProductCategory, {
        foreignKey: 'category_id',
        as: 'category'
      });

      // Association with stock movements
      Product.hasMany(models.StockMovement, {
        foreignKey: 'product_id',
        as: 'stockMovements'
      });

      // Association with barcodes
      Product.hasMany(models.Barcode, {
        foreignKey: 'product_id',
        as: 'barcodes'
      });

      // Association with invoice items
      Product.hasMany(models.InvoiceItem, {
        foreignKey: 'product_id',
        as: 'invoiceItems'
      });

      // Association with service parts used
      Product.hasMany(models.ServicePartsUsed, {
        foreignKey: 'product_id',
        as: 'servicePartsUsed'
      });
    }

    // Instance method to get current stock level
    async getCurrentStock() {
      const movements = await this.getStockMovements();
      return movements.reduce((total, movement) => {
        if (movement.movement_type === 'in' || movement.movement_type === 'adjustment') {
          return total + movement.quantity;
        } else if (movement.movement_type === 'out') {
          return total - movement.quantity;
        }
        return total;
      }, 0);
    }

    // Instance method to check if stock is critical
    async isCriticalStock() {
      const currentStock = await this.getCurrentStock();
      return currentStock <= this.critical_stock_level;
    }
  }

  Product.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    product_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product_categories',
        key: 'id'
      }
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 20]
      }
    },
    critical_stock_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    purchase_price: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    sale_price: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 20.00,
      validate: {
        min: 0,
        max: 100
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Product;
};