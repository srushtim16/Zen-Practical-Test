const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'zen_practical_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      freezeTableName: true
    }
  }
);

module.exports = sequelize;
