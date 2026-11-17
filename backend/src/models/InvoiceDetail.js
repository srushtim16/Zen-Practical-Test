const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvoiceDetail = sequelize.define('Invoice_Detail', {
  InvoiceDetail_Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  Invoice_Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Invoice_Master',
      key: 'Invoice_Id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  Product_Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Product_Master',
      key: 'Product_ID'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  Rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  Unit: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Qty: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  Disc_Percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  NetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: 'Invoice_Detail',
  timestamps: true
});

module.exports = InvoiceDetail;
