const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // 1. Create Product_Master
    await queryInterface.createTable('Product_Master', {
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
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // 2. Create Invoice_Master
    await queryInterface.createTable('Invoice_Master', {
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
        allowNull: false
      },
      CustomerName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      TotalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // 3. Create Invoice_Detail
    await queryInterface.createTable('Invoice_Detail', {
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
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Invoice_Detail');
    await queryInterface.dropTable('Invoice_Master');
    await queryInterface.dropTable('Product_Master');
  }
};
