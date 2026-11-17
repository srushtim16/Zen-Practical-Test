const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvoiceMaster = sequelize.define('Invoice_Master', {
  Invoice_Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  Invoice_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  Invoice_Date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  CustomerName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  tableName: 'Invoice_Master',
  timestamps: true
});

module.exports = InvoiceMaster;
