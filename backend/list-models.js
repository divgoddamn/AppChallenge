// backend/list-models.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listAvailableModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // List available models
    const modelsResponse = await genAI.listModels();
    
    console.log('Available models:');
    modelsResponse.models.forEach(model => {
      console.log(`- ${model.name}: ${model.description}`);
      if (model.supportedGenerationMethods) {
        console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
    });
    
    return modelsResponse.models;
  } catch (error) {
    console.error('Error listing models:', error.message);
    return [];
  }
}

listAvailableModels();