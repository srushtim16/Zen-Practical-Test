const app = require('./app');
const { sequelize } = require('./models');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully to MySQL.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
