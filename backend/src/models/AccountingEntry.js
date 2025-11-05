module.exports = (sequelize, DataTypes) => {
const AccountingEntry = sequelize.define('AccountingEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  entry_number: {
    type: DataTypes.STRING(30),
    unique: true,
    allowNull: false,
    comment: 'Yevmiye kayıt numarası'
  },
  entry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Kayıt tarihi'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Kayıt açıklaması'
  },
  reference_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Referans tipi (invoice, payment, expense, etc.)'
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Referans ID'
  },
  total_debit: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Toplam borç tutarı'
  },
  total_credit: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Toplam alacak tutarı'
  },
  is_balanced: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Kayıt dengeli mi?'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Kayıt durumu (active, cancelled, reversed)'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Kaydı oluşturan kullanıcı ID'
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Kaydı onaylayan kullanıcı ID'
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Onay tarihi'
  }
}, {
  tableName: 'accounting_entries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['entry_date']
    },
    {
      fields: ['reference_type', 'reference_id']
    },
    {
      fields: ['created_by']
    },
    {
      fields: ['status']
    }
  ]
});

AccountingEntry.associate = function(models) {
  AccountingEntry.hasMany(models.AccountingMovement, {
    foreignKey: 'accounting_entry_id',
    as: 'movements'
  });
  
  AccountingEntry.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator'
  });
  
  AccountingEntry.belongsTo(models.User, {
    foreignKey: 'approved_by',
    as: 'approver'
  });
};

return AccountingEntry;
};