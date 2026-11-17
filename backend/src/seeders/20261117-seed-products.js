module.exports = {
  up: async (queryInterface) => {
    const products = [
      {
        Product_Name: 'Dell Inspiron 15 Laptop',
        Rate: 52000.00,
        Unit: 'Pcs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_Name: 'Logitech Wireless Mouse',
        Rate: 750.00,
        Unit: 'Pcs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_Name: 'Mechanical Gaming Keyboard',
        Rate: 2400.00,
        Unit: 'Pcs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_Name: 'Samsung 24" IPS Monitor',
        Rate: 9500.00,
        Unit: 'Pcs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_Name: 'HP LaserJet Printer',
        Rate: 14500.00,
        Unit: 'Pcs',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Product_Master', products, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Product_Master', null, {});
  }
};

