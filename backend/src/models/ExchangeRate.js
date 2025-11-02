'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExchangeRate extends Model {
    static associate(models) {
      // Association with currency
      ExchangeRate.belongsTo(models.Currency, {
        foreignKey: 'currency_code',
        targetKey: 'currency_code',
        as: 'currency'
      });
    }

    // Static method to get latest rate for currency
    static async getLatestRate(currencyCode) {
      return await ExchangeRate.findOne({
        where: {
          currency_code: currencyCode,
          is_active: true
        },
        order: [['rate_date', 'DESC']]
      });
    }

    // Static method to get rates for specific date
    static async getRatesForDate(date) {
      return await ExchangeRate.findAll({
        where: {
          rate_date: date,
          is_active: true
        },
        include: [
          {
            model: sequelize.models.Currency,
            as: 'currency',
            where: { is_active: true }
          }
        ]
      });
    }

    // Instance method to calculate cross rate
    async calculateCrossRate(targetCurrencyCode) {
      const targetRate = await ExchangeRate.getLatestRate(targetCurrencyCode);
      
      if (!targetRate) {
        throw new Error(`Hedef para birimi kuru bulunamadı: ${targetCurrencyCode}`);
      }

      // Cross rate hesaplama (TRY üzerinden)
      const crossBuyRate = this.buy_rate / targetRate.sell_rate;
      const crossSellRate = this.sell_rate / targetRate.buy_rate;

      return {
        from_currency: this.currency_code,
        to_currency: targetCurrencyCode,
        buy_rate: crossBuyRate,
        sell_rate: crossSellRate,
        calculation_date: new Date()
      };
    }
  }

  ExchangeRate.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    currency_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: {
        len: [3, 3],
        isUppercase: true
      }
    },
    buy_rate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    sell_rate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    rate_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'manual',
      validate: {
        isIn: [['manual', 'tcmb', 'api', 'external']]
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'ExchangeRate',
    tableName: 'exchange_rates',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['currency_code', 'rate_date']
      },
      {
        fields: ['rate_date']
      },
      {
        fields: ['currency_code']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  return ExchangeRate;
};