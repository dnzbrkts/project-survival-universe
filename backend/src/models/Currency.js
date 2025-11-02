'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    static associate(models) {
      // Association with exchange rates
      Currency.hasMany(models.ExchangeRate, {
        foreignKey: 'currency_code',
        sourceKey: 'currency_code',
        as: 'exchangeRates'
      });
    }

    // Instance method to get latest exchange rate
    async getLatestExchangeRate() {
      const ExchangeRate = sequelize.models.ExchangeRate;
      return await ExchangeRate.findOne({
        where: {
          currency_code: this.currency_code,
          is_active: true
        },
        order: [['rate_date', 'DESC']]
      });
    }

    // Static method to get base currency
    static async getBaseCurrency() {
      return await Currency.findOne({
        where: {
          is_base_currency: true,
          is_active: true
        }
      });
    }

    // Static method to get active currencies
    static async getActiveCurrencies() {
      return await Currency.findAll({
        where: {
          is_active: true
        },
        order: [['currency_code', 'ASC']]
      });
    }
  }

  Currency.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    currency_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 3],
        isUppercase: true
      }
    },
    currency_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    symbol: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: [0, 10]
      }
    },
    decimal_places: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      validate: {
        min: 0,
        max: 8
      }
    },
    is_base_currency: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Currency',
    tableName: 'currencies',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['currency_code']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['is_base_currency']
      }
    ]
  });

  return Currency;
};