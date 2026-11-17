const sequelize = require('../config/database');
const seeder = require('../seeders/20261117-seed-products');

async function run() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.');

    console.log('Running seeders...');
    const queryInterface = sequelize.getQueryInterface();

    await seeder.down(queryInterface);
    await seeder.up(queryInterface);

    console.log('Seeders executed successfully: Sample products inserted into Product_Master.');
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
}

run();

