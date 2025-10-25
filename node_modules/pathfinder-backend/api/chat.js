// backend/api/chat.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Job = require('../models/Job');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Joi = require('joi');
const GeminiService = require('../services/geminiService');

// Initialize Gemini service
let geminiService;
try {
  geminiService = new GeminiService();
} catch (error) {
  console.error('Failed to initialize Gemini service:', error.message);
}

// Validation schema for chat messages
const chatMessageSchema = Joi.object({
  message: Joi.string().required().max(1000),
  userId: Joi.string().optional(),
  context: Joi.object().optional()
});

// Handle chat messages
router.post('/', async (req, res) => {
  try {
    const { error, value } = chatMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details
      });
    }

    const { message, context = {} } = value;

    // Process the user message and generate an appropriate response
    const response = await processUserMessage(message, context);

    res.json({
      success: true,
      data: {
        response: response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message',
      error: error.message
    });
  }
});

// Process user message and generate AI response
async function processUserMessage(userMessage, context) {
  // If Gemini service isn't available, use fallback responses
  if (!geminiService) {
    return getFallbackResponse(userMessage);
  }

  try {
    // Determine user intent based on message
    const intent = await determineIntent(userMessage);
    
    // Generate appropriate response based on intent
    let response;
    
    switch (intent) {
      case 'find_resource':
        const { resourceType, location } = await extractResourceInfo(userMessage);
        response = await findResources(resourceType, location, context);
        break;
        
      case 'find_job':
        response = await findJobs(userMessage, context);
        break;
        
      case 'government_benefits':
        response = await explainGovernmentBenefits(userMessage);
        break;
        
      case 'general_help':
      default:
        response = await generateGeneralResponse(userMessage);
        break;
    }
    
    return response;
  } catch (error) {
    console.error('Error in processUserMessage:', error);
    return getFallbackResponse(userMessage);
  }
}

// Fallback response function when Gemini is not available
function getFallbackResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('shelter') || message.includes('sleep') || message.includes('homeless')) {
    return "I can help you find shelter resources. Based on your location, there are several shelters nearby:\n\n- Manchester Homeless Shelter: (603) 555-0123\n- Family Promise of Greater Nashua: (603) 555-0124\n\nWould you like more details about these resources?";
  }
  else if (message.includes('food') || message.includes('eat') || message.includes('hungry')) {
    return "I can help you find food resources. Here are some food assistance options near you:\n\n- Manchester Food Bank: (603) 555-0126\n- Nashua Soup Kitchen: (603) 555-0127\n\nWould you like directions to any of these?";
  }
  else if (message.includes('job') || message.includes('work') || message.includes('employment')) {
    return "I can help you find job opportunities. Entry-level positions available in the area include:\n\n- Retail associate at local stores\n- Warehouse positions\n- Food service jobs\n\nWould you like to learn more about job search resources?";
  }
  else if (message.includes('health') || message.includes('clinic') || message.includes('doctor')) {
    return "I can help you find health services. Here are some nearby health resources:\n\n- Manchester Community Health Center: (603) 555-0128\n- Nashua Free Clinic: (603) 555-0129\n\nWould you like more information about these services?";
  }
  else {
    return "I'm here to help you find resources and support. I can help with:\n\n- Finding shelters\n- Locating food programs\n- Job opportunities\n- Health services\n- Government benefits information\n\nPlease let me know what you need assistance with.";
  }
}

// Determine intent using Gemini or fallback
async function determineIntent(message) {
  if (!geminiService) {
    const msg = message.toLowerCase();
    if (msg.includes('shelter') || msg.includes('sleep') || msg.includes('homeless')) {
      return 'find_resource';
    } else if (msg.includes('job') || msg.includes('work') || msg.includes('employment')) {
      return 'find_job';
    } else if (msg.includes('benefit') || msg.includes('government') || msg.includes('snap') || msg.includes('medicaid')) {
      return 'government_benefits';
    } else {
      return 'general_help';
    }
  }
  
  try {
    const prompt = `You are a helpful assistant for PathFinder, an app that helps homeless and housing-insecure individuals find resources. Classify the user's message into one of these intents: find_resource, find_job, government_benefits, general_help. Respond with only the intent name.

User message: ${message}`;

    const result = await geminiService.generateText(prompt, {
      temperature: 0,
      maxTokens: 20
    });

    const intent = result.trim().toLowerCase();
    
    // Validate the response
    const validIntents = ['find_resource', 'find_job', 'government_benefits', 'general_help'];
    return validIntents.includes(intent) ? intent : 'general_help';
  } catch (error) {
    console.error('Error determining intent:', error);
    // Fallback intent detection
    const msg = message.toLowerCase();
    if (msg.includes('shelter') || msg.includes('sleep') || msg.includes('homeless')) {
      return 'find_resource';
    } else if (msg.includes('job') || msg.includes('work') || msg.includes('employment')) {
      return 'find_job';
    } else if (msg.includes('benefit') || msg.includes('government') || msg.includes('snap') || msg.includes('medicaid')) {
      return 'government_benefits';
    } else {
      return 'general_help';
    }
  }
}

// Extract resource information from user message
async function extractResourceInfo(message) {
  if (!geminiService) {
    // Simple fallback resource extraction
    const msg = message.toLowerCase();
    if (msg.includes('shelter') || msg.includes('sleep') || msg.includes('homeless')) {
      return { resourceType: 'shelter', location: 'current location' };
    } else if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry')) {
      return { resourceType: 'food', location: 'current location' };
    } else if (msg.includes('health') || msg.includes('clinic') || msg.includes('doctor')) {
      return { resourceType: 'health', location: 'current location' };
    } else if (msg.includes('job') || msg.includes('work') || msg.includes('employment')) {
      return { resourceType: 'job', location: 'current location' };
    } else {
      return { resourceType: 'shelter', location: 'current location' };
    }
  }
  
  try {
    const prompt = `Extract the resource type and location from the user's message. Resource types should be one of: shelter, food, health, job, education, rehab, legal. If no location is specified, use 'current location'. Respond in JSON format: {resourceType: string, location: string}

User message: ${message}`;

    const result = await geminiService.generateText(prompt, {
      temperature: 0,
      maxTokens: 100
    });

    // Clean up the response to extract JSON
    const jsonString = result.replace(/```json\n?/, '').replace(/```/, '').trim();
    
    let extractedInfo;
    try {
      extractedInfo = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // If JSON parsing fails, try to extract information from plain text
      extractedInfo = { resourceType: 'shelter', location: 'current location' };
    }

    return extractedInfo;
  } catch (error) {
    console.error('Error extracting resource info:', error);
    // Fallback resource extraction
    const msg = message.toLowerCase();
    if (msg.includes('shelter') || msg.includes('sleep') || msg.includes('homeless')) {
      return { resourceType: 'shelter', location: 'current location' };
    } else if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry')) {
      return { resourceType: 'food', location: 'current location' };
    } else if (msg.includes('health') || msg.includes('clinic') || msg.includes('doctor')) {
      return { resourceType: 'health', location: 'current location' };
    } else if (msg.includes('job') || msg.includes('work') || msg.includes('employment')) {
      return { resourceType: 'job', location: 'current location' };
    } else {
      return { resourceType: 'shelter', location: 'current location' };
    }
  }
}

// Find resources based on type and location
async function findResources(resourceType, location, context) {
  try {
    // For demo purposes, we'll search in the database
    // In a real app, we might also use geocoding for location
    const resources = await Resource.findAll({
      where: {
        type: resourceType,
        isActive: true,
        // If we had user location in context, we could filter by proximity
      },
      limit: 5
    });

    if (resources.length === 0) {
      return `I couldn't find any ${resourceType} resources right now. Would you like me to search for other types of assistance?`;
    }

    const resourceList = resources.map(r => 
      `- ${r.name}: ${r.address}${r.phone ? `, Phone: ${r.phone}` : ''}`
    ).join('\n');

    return `I found these ${resourceType} resources for you:\n\n${resourceList}\n\nWould you like more information about any of these?`;
  } catch (error) {
    console.error('Error finding resources:', error);
    return `I'm having trouble finding ${resourceType} resources right now. Please try again later.`;
  }
}

// Find jobs based on user request
async function findJobs(message, context) {
  try {
    const jobs = await Job.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${message}%` } },
          { company: { [Op.iLike]: `%${message}%` } },
          { description: { [Op.iLike]: `%${message}%` } }
        ]
      },
      limit: 3
    });

    if (jobs.length === 0) {
      return "I couldn't find any job opportunities matching your request. Would you like me to search for different positions?";
    }

    const jobList = jobs.map(j => 
      `- ${j.title} at ${j.company}: ${j.location}${j.salary ? `, Salary: ${j.salary}` : ''}`
    ).join('\n');

    return `I found these job opportunities for you:\n\n${jobList}\n\nWould you like more details about any of these positions?`;
  } catch (error) {
    console.error('Error finding jobs:', error);
    return "I'm having trouble finding job opportunities right now. Please try again later.";
  }
}

// Explain government benefits
async function explainGovernmentBenefits(message) {
  if (!geminiService) {
    return "I can help you find information about government benefits:\n\n- SNAP (food stamps): Provides money for groceries\n- Medicaid: Low-cost or free healthcare\n- Housing vouchers: Help with rent payments\n- WIC: Food assistance for women, infants, and children\n\nTo apply, visit benefits.gov or contact your local social services office.";
  }
  
  try {
    const prompt = `You are an expert on government benefits for homeless and housing-insecure individuals. Explain the benefits in simple, clear language. Include information about eligibility, how to apply, and where to find more information. Be empathetic and encouraging.

User message: Explain government benefits related to this: ${message}`;

    const result = await geminiService.generateText(prompt, {
      temperature: 0.3,
      maxTokens: 300
    });

    return result;
  } catch (error) {
    console.error('Error explaining benefits:', error);
    return "I can help you find information about government benefits. Common programs include SNAP (food assistance), Medicaid (healthcare), and housing vouchers. You can apply through your local social services office or online.";
  }
}

// Generate general response
async function generateGeneralResponse(message) {
  if (!geminiService) {
    return "I'm here to help you find resources and support. I can help with:\n\n- Finding shelters\n- Locating food programs\n- Job opportunities\n- Health services\n- Government benefits information\n\nPlease let me know what you need assistance with.";
  }
  
  try {
    const prompt = `You are PathFinder Assistant, an AI designed to help homeless and housing-insecure individuals find resources and support. Be empathetic, encouraging, and focus on providing helpful, actionable information. If asked about resources, try to determine what kind of help they need.

User message: ${message}`;

    const result = await geminiService.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 200
    });

    return result;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm here to help you find resources and support. Let me know what kind of assistance you're looking for, and I'll do my best to help.";
  }
}

module.exports = router;