const sequelize = require('../config/database');
const migration = require('../migrations/20261117-create-tables');

async function run() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Running migrations...');
    const queryInterface = sequelize.getQueryInterface();

    // Check if tables already exist and drop if fresh
    const tables = await queryInterface.showAllTables();
    if (tables.includes('Invoice_Detail')) {
      await queryInterface.dropTable('Invoice_Detail');
    }
    if (tables.includes('Invoice_Master')) {
      await queryInterface.dropTable('Invoice_Master');
    }
    if (tables.includes('Product_Master')) {
      await queryInterface.dropTable('Product_Master');
    }

    await migration.up(queryInterface);
    console.log('Migrations executed successfully: Product_Master, Invoice_Master, Invoice_Detail tables created.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
