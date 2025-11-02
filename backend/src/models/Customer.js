'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      // Association with invoices
      Customer.hasMany(models.Invoice, {
        foreignKey: 'customer_id',
        as: 'invoices'
      });

      // Association with payments
      Customer.hasMany(models.Payment, {
        foreignKey: 'customer_id',
        as: 'payments'
      });

      // Association with service requests
      Customer.hasMany(models.ServiceRequest, {
        foreignKey: 'customer_id',
        as: 'serviceRequests'
      });

      // Association with customer activities
      // TODO: Implement CustomerActivity model
      // Customer.hasMany(models.CustomerActivity, {
      //   foreignKey: 'customer_id',
      //   as: 'activities'
      // });

      // Association with sales opportunities
      // TODO: Implement SalesOpportunity model
      // Customer.hasMany(models.SalesOpportunity, {
      //   foreignKey: 'customer_id',
      //   as: 'salesOpportunities'
      // });

      // Many-to-many association with customer segments
      // TODO: Implement CustomerSegment and CustomerSegmentAssignment models
      // Customer.belongsToMany(models.CustomerSegment, {
      //   through: models.CustomerSegmentAssignment,
      //   foreignKey: 'customer_id',
      //   otherKey: 'segment_id',
      //   as: 'segments'
      // });
    }

    // Instance method to calculate current balance
    async getCurrentBalance() {
      const invoices = await this.getInvoices({
        where: { status: { [sequelize.Sequelize.Op.ne]: 'cancelled' } }
      });
      
      const payments = await this.getPayments();

      const totalInvoiced = invoices.reduce((sum, invoice) => {
        return sum + (invoice.invoice_type === 'sales' ? 
          parseFloat(invoice.total_amount) : 
          -parseFloat(invoice.total_amount));
      }, 0);

      const totalPaid = payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount);
      }, 0);

      return totalInvoiced - totalPaid;
    }

    // Instance method to get overdue invoices
    async getOverdueInvoices() {
      const currentDate = new Date();
      return await this.getInvoices({
        where: {
          due_date: { [sequelize.Sequelize.Op.lt]: currentDate },
          payment_status: { [sequelize.Sequelize.Op.ne]: 'paid' },
          status: { [sequelize.Sequelize.Op.ne]: 'cancelled' }
        }
      });
    }

    // Instance method to check credit limit
    async isCreditLimitExceeded() {
      const currentBalance = await this.getCurrentBalance();
      return currentBalance > this.credit_limit;
    }
  }

  Customer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 20]
      }
    },
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    customer_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['customer', 'supplier', 'both']]
      }
    },
    tax_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    tax_office: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
        len: [0, 100]
      }
    },
    contact_person: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    payment_terms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: 0
      }
    },
    credit_limit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Customer;
};