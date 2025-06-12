import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

// Create the Sequelize instance exactly as in your main app
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true, // Needed for TiDB Cloud
    },
  },
  logging: console.log, // optional: enable logging for debugging
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error(error); // full error for debugging
  }
})();
