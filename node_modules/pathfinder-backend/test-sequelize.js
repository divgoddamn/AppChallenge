// backend/test-sequelize.js
const { Sequelize } = require('sequelize');

console.log('Testing Sequelize instantiation...');

// Try to create a simple sequelize instance
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false
});

console.log('Sequelize instance created');
console.log('sequelize.define exists:', typeof sequelize.define);

// Test basic functionality
try {
  const TestModel = sequelize.define('Test', {});
  console.log('Model created successfully - Sequelize is working correctly');
} catch (error) {
  console.error('Error creating model:', error.message);
}