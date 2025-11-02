'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StockMovement extends Model {
    static associate(models) {
      // Association with product
      StockMovement.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });

      // Association with user
      StockMovement.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }

    // Static method to get current stock for a product
    static async getCurrentStockForProduct(productId) {
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
    }

    // Static method to create stock movement with validation
    static async createMovement(movementData) {
      const { product_id, movement_type, quantity } = movementData;
      
      // If it's an 'out' movement, check if there's enough stock
      if (movement_type === 'out') {
        const currentStock = await StockMovement.getCurrentStockForProduct(product_id);
        if (currentStock < quantity) {
          throw new Error('Yetersiz stok. Mevcut stok: ' + currentStock);
        }
      }

      return await StockMovement.create(movementData);
    }
  }

  StockMovement.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    movement_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['in', 'out', 'transfer', 'adjustment']]
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notZero(value) {
          if (value === 0) {
            throw new Error('Miktar sıfır olamaz');
          }
        }
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'TRY',
      validate: {
        len: [3, 3]
      }
    },
    reference_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    reference_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'StockMovement',
    tableName: 'stock_movements',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return StockMovement;
};