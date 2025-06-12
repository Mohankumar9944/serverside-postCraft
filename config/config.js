// config/config.js
require('dotenv').config();

export const development = {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true, // depends on your DB config
        }
    }
};
export const production = {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        }
    }
};
