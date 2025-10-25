// backend/check-models.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkAvailableModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with known available models
    const availableModels = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest'
    ];
    
    for (const modelName of availableModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, are you available?');
        console.log(`✅ Model ${modelName} is available and working!`);
        return model; // Return the first working model
      } catch (error) {
        console.log(`❌ Model ${modelName} is not available: ${error.message}`);
      }
    }
    
    console.log('No standard models found. Please check the Google AI documentation for current available models.');
    return null;
  } catch (error) {
    console.error('Error checking models:', error.message);
    return null;
  }
}

checkAvailableModels();