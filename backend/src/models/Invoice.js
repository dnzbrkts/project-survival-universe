'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // Association with customer
      Invoice.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });

      // Association with user (creator)
      Invoice.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });

      // Association with invoice items
      Invoice.hasMany(models.InvoiceItem, {
        foreignKey: 'invoice_id',
        as: 'items'
      });

      // Association with payments
      Invoice.hasMany(models.Payment, {
        foreignKey: 'invoice_id',
        as: 'payments'
      });

      // Association with e-invoice records
      // TODO: Implement EInvoiceRecord model
      // Invoice.hasOne(models.EInvoiceRecord, {
      //   foreignKey: 'invoice_id',
      //   as: 'eInvoiceRecord'
      // });
    }

    // Static method to generate invoice number
    static async generateInvoiceNumber(invoiceType) {
      const year = new Date().getFullYear();
      const prefix = invoiceType === 'sales' ? 'SF' : 'AF'; // SF: Satış Faturası, AF: Alış Faturası
      
      const lastInvoice = await Invoice.findOne({
        where: {
          invoice_type: invoiceType,
          invoice_number: {
            [sequelize.Sequelize.Op.like]: `${prefix}${year}%`
          }
        },
        order: [['invoice_number', 'DESC']]
      });

      let nextNumber = 1;
      if (lastInvoice) {
        const lastNumber = parseInt(lastInvoice.invoice_number.slice(-6));
        nextNumber = lastNumber + 1;
      }

      return `${prefix}${year}${nextNumber.toString().padStart(6, '0')}`;
    }

    // Instance method to calculate totals from items
    async calculateTotals() {
      const items = await this.getItems();
      
      let subtotal = 0;
      let taxAmount = 0;

      items.forEach(item => {
        const lineSubtotal = parseFloat(item.line_total);
        const lineTax = lineSubtotal * (parseFloat(item.tax_rate) / 100);
        
        subtotal += lineSubtotal;
        taxAmount += lineTax;
      });

      return {
        subtotal: subtotal.toFixed(4),
        tax_amount: taxAmount.toFixed(4),
        total_amount: (subtotal + taxAmount).toFixed(4)
      };
    }

    // Instance method to update payment status
    async updatePaymentStatus() {
      const payments = await this.getPayments();
      const totalPaid = payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount);
      }, 0);

      const totalAmount = parseFloat(this.total_amount);
      
      let paymentStatus = 'unpaid';
      if (totalPaid >= totalAmount) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partial';
      }

      await this.update({ payment_status: paymentStatus });
      return paymentStatus;
    }

    // Instance method to check if invoice is overdue
    isOverdue() {
      if (!this.due_date || this.payment_status === 'paid') {
        return false;
      }
      return new Date() > new Date(this.due_date);
    }
  }

  Invoice.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoice_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 30]
      }
    },
    invoice_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['sales', 'purchase']]
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
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
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
    exchange_rate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      defaultValue: 1.0,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'approved', 'paid', 'cancelled']]
      }
    },
    payment_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'unpaid',
      validate: {
        isIn: [['unpaid', 'partial', 'paid']]
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
    modelName: 'Invoice',
    tableName: 'invoices',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Invoice;
};