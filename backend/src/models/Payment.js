'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Association with invoice
      Payment.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice'
      });

      // Association with customer
      Payment.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });

      // Association with user (creator)
      Payment.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
    }

    // Static method to generate payment number
    static async generatePaymentNumber() {
      const year = new Date().getFullYear();
      const prefix = 'OD'; // Ödeme
      
      const lastPayment = await Payment.findOne({
        where: {
          payment_number: {
            [sequelize.Sequelize.Op.like]: `${prefix}${year}%`
          }
        },
        order: [['payment_number', 'DESC']]
      });

      let nextNumber = 1;
      if (lastPayment) {
        const lastNumber = parseInt(lastPayment.payment_number.slice(-6));
        nextNumber = lastNumber + 1;
      }

      return `${prefix}${year}${nextNumber.toString().padStart(6, '0')}`;
    }

    // Instance method to convert amount to base currency
    getAmountInBaseCurrency() {
      return parseFloat(this.amount) * parseFloat(this.exchange_rate);
    }
  }

  Payment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    payment_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 30]
      }
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'invoices',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['cash', 'bank_transfer', 'credit_card', 'check', 'other']]
      }
    },
    amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      validate: {
        min: 0.01
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
    exchange_rate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      defaultValue: 1.0,
      validate: {
        min: 0
      }
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reference_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Payment;
};