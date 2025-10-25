// backend/config/database.js
const { Sequelize } = require('sequelize');

// Using environment variables for database configuration
const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'pathfinder',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres'
} = process.env;

// Create Sequelize instance with fallback
let sequelize;

// Check if PostgreSQL is accessible, otherwise use SQLite for testing
try {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds
    },
  });
} catch (error) {
  console.warn('PostgreSQL connection failed, using SQLite for testing:', error.message);
  
  // Fallback to SQLite if PostgreSQL is not available
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
}

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.warn('PostgreSQL connection failed, attempting to use SQLite for testing:', error.message);
    
    // Fallback to SQLite if PostgreSQL is not available
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', // Use in-memory SQLite for immediate testing
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    });
    
    try {
      await sequelize.authenticate();
      console.log('SQLite in-memory database connection established for testing.');
    } catch (sqliteError) {
      console.error('Could not establish any database connection:', sqliteError.message);
    }
  }
};

module.exports = {
  sequelize,
  testConnection
};