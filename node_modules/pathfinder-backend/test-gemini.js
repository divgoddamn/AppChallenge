// backend/test-gemini.js
require('dotenv').config();
const GeminiService = require('./services/geminiService');

async function testGeminiConnection() {
  try {
    console.log('Testing Gemini API connection...');
    const geminiService = new GeminiService();
    
    const testPrompt = 'Hello, this is a test. Please respond with "Gemini API is working" if you receive this message.';
    const response = await geminiService.generateText(testPrompt);
    
    console.log('✅ Gemini API is working!');
    console.log('Response:', response);
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to Gemini API:', error.message);
    return false;
  }
}

// Run the test
testGeminiConnection();