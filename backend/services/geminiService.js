// backend/services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    this.generativeAI = new GoogleGenerativeAI(apiKey);
    
    // Try different models in order of preference
    this.initializeModel();
  }

  initializeModel() {
    // List of available models in order of preference
    const modelNames = [
      "gemini-1.5-flash",    // Often most available
      "gemini-1.0-pro",      // Original Gemini Pro
      "gemini-pro"           // Alternative format
    ];
    
    // Try each model until one works
    for (const modelName of modelNames) {
      try {
        this.model = this.generativeAI.getGenerativeModel({ model: modelName });
        console.log(`✅ Successfully initialized with ${modelName}`);
        this.currentModel = modelName;
        return;
      } catch (error) {
        console.log(`❌ Failed to initialize ${modelName}:`, error.message);
      }
    }
    
    // If no model could be initialized, provide fallback behavior
    console.warn('⚠️  Warning: No Gemini model could be initialized. Using fallback responses.');
    this.model = null;
  }

  async generateText(prompt, options = {}) {
    if (!this.model) {
      // Return a helpful fallback message when no model is available
      return "I'm sorry, but the AI service is temporarily unavailable. Our team has been notified and is working to resolve the issue. In the meantime, I can guide you to resources based on what you're looking for.";
    }
    
    try {
      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1000,
        }
      });
      
      return result.response.text();
    } catch (error) {
      console.error('Error with Gemini API:', error.message);
      
      // Try to initialize again in case model was available but now not accessible
      if (error.message.includes('404 Not Found') || error.message.includes('not found for API version')) {
        console.warn('Gemini model not found, attempting to reinitialize...');
        this.initializeModel();
        if (!this.model) {
          // If reinitialization fails, return fallback
          return "I'm sorry, but the AI service is temporarily unavailable. Our team has been notified and is working to resolve the issue. In the meantime, I can guide you to resources based on what you're looking for.";
        }
        
        // Try again with the new model
        return this.generateText(prompt, options);
      }
      
      throw error;
    }
  }

  async chat(messages, options = {}) {
    if (!this.model) {
      // Return a helpful fallback message when no model is available
      return "I'm sorry, but the AI service is temporarily unavailable. Our team has been notified and is working to resolve the issue. In the meantime, I can guide you to resources based on what you're looking for.";
    }
    
    try {
      // Convert messages to Gemini format
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model', // Gemini uses 'model' instead of 'assistant'
        parts: [{ text: msg.content }]
      }));

      const result = await this.model.generateContent({
        contents: contents,
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1000,
        }
      });
      
      return result.response.text();
    } catch (error) {
      console.error('Error with Gemini API chat:', error.message);
      
      // Try to initialize again in case model was available but now not accessible
      if (error.message.includes('404 Not Found') || error.message.includes('not found for API version')) {
        console.warn('Gemini model not found, attempting to reinitialize...');
        this.initializeModel();
        if (!this.model) {
          // If reinitialization fails, return fallback
          return "I'm sorry, but the AI service is temporarily unavailable. Our team has been notified and is working to resolve the issue. In the meantime, I can guide you to resources based on what you're looking for.";
        }
        
        // Try again with the new model
        return this.chat(messages, options);
      }
      
      throw error;
    }
  }
}

module.exports = GeminiService;