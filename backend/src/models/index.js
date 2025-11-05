/**
 * Sequelize Model Index
 * Tüm modellerin merkezi yönetimi
 */

const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

// Model dosyalarını import et
const SystemModule = require('./SystemModule');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const UserRole = require('./UserRole');
const RolePermission = require('./RolePermission');
const UserPermission = require('./UserPermission');
const ModuleAccessLog = require('./ModuleAccessLog');

// Yeni modeller
const ProductCategory = require('./ProductCategory');
const Product = require('./Product');
const StockMovement = require('./StockMovement');
const Customer = require('./Customer');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');
const Payment = require('./Payment');
const ServiceRequest = require('./ServiceRequest');
const ServiceActivity = require('./ServiceActivity');
const ServicePartsUsed = require('./ServicePartsUsed');
const Currency = require('./Currency');
const ExchangeRate = require('./ExchangeRate');
const Barcode = require('./Barcode');

// Muhasebe modelleri
const AccountingAccount = require('./AccountingAccount');
const AccountingEntry = require('./AccountingEntry');
const AccountingMovement = require('./AccountingMovement');

// Model'leri sequelize instance ile başlat
const models = {
  SystemModule: SystemModule(sequelize, Sequelize.DataTypes),
  User: User(sequelize, Sequelize.DataTypes),
  Role: Role(sequelize, Sequelize.DataTypes),
  Permission: Permission(sequelize, Sequelize.DataTypes),
  UserRole: UserRole(sequelize, Sequelize.DataTypes),
  RolePermission: RolePermission(sequelize, Sequelize.DataTypes),
  UserPermission: UserPermission(sequelize, Sequelize.DataTypes),
  ModuleAccessLog: ModuleAccessLog(sequelize, Sequelize.DataTypes),
  
  // Yeni modeller
  ProductCategory: ProductCategory(sequelize, Sequelize.DataTypes),
  Product: Product(sequelize, Sequelize.DataTypes),
  StockMovement: StockMovement(sequelize, Sequelize.DataTypes),
  Customer: Customer(sequelize, Sequelize.DataTypes),
  Invoice: Invoice(sequelize, Sequelize.DataTypes),
  InvoiceItem: InvoiceItem(sequelize, Sequelize.DataTypes),
  Payment: Payment(sequelize, Sequelize.DataTypes),
  ServiceRequest: ServiceRequest,
  ServiceActivity: ServiceActivity,
  ServicePartsUsed: ServicePartsUsed,
  Currency: Currency(sequelize, Sequelize.DataTypes),
  ExchangeRate: ExchangeRate(sequelize, Sequelize.DataTypes),
  Barcode: Barcode(sequelize, Sequelize.DataTypes),
  
  // Muhasebe modelleri
  AccountingAccount: AccountingAccount(sequelize, Sequelize.DataTypes),
  AccountingEntry: AccountingEntry(sequelize, Sequelize.DataTypes),
  AccountingMovement: AccountingMovement(sequelize, Sequelize.DataTypes)
};

// Model ilişkilerini kur
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sequelize instance'ını ve modelleri export et
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;