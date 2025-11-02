'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Barcode extends Model {
    static associate(models) {
      Barcode.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });

      // TODO: Implement BarcodeScanLog model
      // Barcode.hasMany(models.BarcodeScanLog, {
      //   foreignKey: 'barcode_id',
      //   as: 'scanLogs'
      // });
    }

    static async findByBarcode(barcodeValue) {
      return await Barcode.findOne({
        where: { 
          barcode_value: barcodeValue,
          is_active: true 
        },
        include: [{
          model: sequelize.models.Product,
          as: 'product'
        }]
      });
    }
  }

  Barcode.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    barcode_value: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    barcode_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'EAN13',
      validate: {
        isIn: [['EAN13', 'EAN8', 'CODE128', 'QR', 'CODE39']]
      }
    },
    is_primary: {
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
    modelName: 'Barcode',
    tableName: 'barcodes',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Barcode;
};