module.exports = (sequelize, DataTypes) => {
const AccountingAccount = sequelize.define('AccountingAccount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  account_code: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
    comment: 'Hesap kodu (örn: 120.01)'
  },
  account_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Hesap adı'
  },
  account_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Hesap tipi (asset, liability, equity, revenue, expense)'
  },
  parent_account_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Ana hesap kodu'
  },
  account_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Hesap seviyesi (1: Ana grup, 2: Alt grup, 3: Detay)'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Hesap aktif mi?'
  },
  is_system_account: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Sistem hesabı mı?'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Hesap açıklaması'
  },
  normal_balance: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'debit',
    comment: 'Normal bakiye (debit/credit)'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Sıralama'
  }
}, {
  tableName: 'accounting_accounts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['account_type']
    },
    {
      fields: ['parent_account_code']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['account_level']
    }
  ]
});

AccountingAccount.associate = function(models) {
  AccountingAccount.hasMany(models.AccountingMovement, {
    foreignKey: 'account_code',
    sourceKey: 'account_code',
    as: 'movements'
  });
};

return AccountingAccount;
};