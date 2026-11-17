const sequelize = require('../config/database');
const ProductMaster = require('./ProductMaster');
const InvoiceMaster = require('./InvoiceMaster');
const InvoiceDetail = require('./InvoiceDetail');

// Associations
InvoiceMaster.hasMany(InvoiceDetail, {
  foreignKey: 'Invoice_Id',
  as: 'details',
  onDelete: 'CASCADE'
});

InvoiceDetail.belongsTo(InvoiceMaster, {
  foreignKey: 'Invoice_Id',
  as: 'invoice'
});

ProductMaster.hasMany(InvoiceDetail, {
  foreignKey: 'Product_Id',
  as: 'invoiceDetails'
});

InvoiceDetail.belongsTo(ProductMaster, {
  foreignKey: 'Product_Id',
  as: 'product'
});

module.exports = {
  sequelize,
  ProductMaster,
  InvoiceMaster,
  InvoiceDetail
};
