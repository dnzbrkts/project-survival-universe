module.exports = (sequelize, DataTypes) => {
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payment_number: {
    type: DataTypes.STRING(30),
    unique: true,
    allowNull: false,
    comment: 'Ödeme numarası'
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Fatura ID'
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Müşteri ID'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Ödeme yöntemi (cash, bank_transfer, credit_card, check)'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    comment: 'Ödeme tutarı'
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'TRY',
    comment: 'Para birimi'
  },
  exchange_rate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
    defaultValue: 1.0,
    comment: 'Döviz kuru'
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Ödeme tarihi'
  },
  reference_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Referans numarası'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notlar'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'completed',
    comment: 'Ödeme durumu (pending, completed, cancelled)'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Kaydı oluşturan kullanıcı ID'
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['invoice_id']
    },
    {
      fields: ['customer_id']
    },
    {
      fields: ['payment_date']
    },
    {
      fields: ['status']
    }
  ]
});

Payment.associate = function(models) {
  Payment.belongsTo(models.Invoice, {
    foreignKey: 'invoice_id',
    as: 'invoice'
  });
  
  Payment.belongsTo(models.Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
  });
  
  Payment.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator'
  });
};

return Payment;
};