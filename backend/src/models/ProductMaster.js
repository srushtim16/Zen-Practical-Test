const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductMaster = sequelize.define('Product_Master', {
  Product_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  Product_Name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  Unit: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Product_Master',
  timestamps: true
});

module.exports = ProductMaster;

