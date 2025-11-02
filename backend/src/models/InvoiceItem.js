'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InvoiceItem extends Model {
    static associate(models) {
      // Association with invoice
      InvoiceItem.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice'
      });

      // Association with product
      InvoiceItem.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }

    // Instance method to calculate line total
    calculateLineTotal() {
      const quantity = parseFloat(this.quantity);
      const unitPrice = parseFloat(this.unit_price);
      const discountRate = parseFloat(this.discount_rate) || 0;
      
      const subtotal = quantity * unitPrice;
      const discountAmount = subtotal * (discountRate / 100);
      
      return (subtotal - discountAmount).toFixed(4);
    }

    // Instance method to calculate tax amount
    calculateTaxAmount() {
      const lineTotal = parseFloat(this.line_total);
      const taxRate = parseFloat(this.tax_rate) || 0;
      
      return (lineTotal * (taxRate / 100)).toFixed(4);
    }

    // Instance method to calculate total with tax
    calculateTotalWithTax() {
      const lineTotal = parseFloat(this.line_total);
      const taxAmount = parseFloat(this.calculateTaxAmount());
      
      return (lineTotal + taxAmount).toFixed(4);
    }
  }

  InvoiceItem.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invoices',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0.001
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    discount_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
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
    line_total: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'InvoiceItem',
    tableName: 'invoice_items',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    hooks: {
      beforeSave: (item) => {
        // Automatically calculate line total before saving
        item.line_total = item.calculateLineTotal();
      }
    }
  });

  return InvoiceItem;
};