module.exports = (sequelize, DataTypes) => {
const AccountingMovement = sequelize.define('AccountingMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accounting_entry_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Yevmiye kayıt ID'
  },
  account_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Hesap kodu (örn: 120.01)'
  },
  account_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Hesap adı'
  },
  debit_amount: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Borç tutarı'
  },
  credit_amount: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Alacak tutarı'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Hareket açıklaması'
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
  original_amount: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true,
    comment: 'Orijinal para birimi tutarı'
  }
}, {
  tableName: 'accounting_movements',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['accounting_entry_id']
    },
    {
      fields: ['account_code']
    },
    {
      fields: ['created_at']
    }
  ]
});

AccountingMovement.associate = function(models) {
  AccountingMovement.belongsTo(models.AccountingEntry, {
    foreignKey: 'accounting_entry_id',
    as: 'entry'
  });
  
  AccountingMovement.belongsTo(models.AccountingAccount, {
    foreignKey: 'account_code',
    targetKey: 'account_code',
    as: 'account'
  });
};

return AccountingMovement;
};