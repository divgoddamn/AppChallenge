// backend/api/resume.js
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const GeminiService = require('../services/geminiService');

// Initialize Gemini service
let geminiService;
try {
  geminiService = new GeminiService();
} catch (error) {
  console.error('Failed to initialize Gemini service:', error.message);
}

// Validation schema for resume generation
const resumeSchema = Joi.object({
  name: Joi.string().required(),
  contactInfo: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string(),
    location: Joi.string()
  }).optional(),
  experience: Joi.array().items(Joi.object({
    company: Joi.string(),
    position: Joi.string(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    description: Joi.string()
  })).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  education: Joi.array().items(Joi.object({
    institution: Joi.string(),
    degree: Joi.string(),
    year: Joi.string()
  })).optional(),
  summary: Joi.string().optional()
});

// Generate a resume using Gemini
router.post('/generate', async (req, res) => {
  try {
    const { error, value } = resumeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details
      });
    }

    if (!geminiService) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not properly configured'
      });
    }

    const resumeData = value;
    const resumePrompt = generateResumePrompt(resumeData);

    const resumeText = await geminiService.generateText(resumePrompt, {
      temperature: 0.6,
      maxTokens: 1500
    });

    res.json({
      success: true,
      data: {
        resume: resumeText,
        originalData: resumeData
      }
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating resume',
      error: error.message
    });
  }
});

// Generate a prompt for resume creation
function generateResumePrompt(resumeData) {
  let prompt = `Create a professional resume based on the following information:\n\n`;
  
  prompt += `Name: ${resumeData.name}\n`;
  
  if (resumeData.contactInfo) {
    prompt += `Contact Information:\n`;
    if (resumeData.contactInfo.email) prompt += `Email: ${resumeData.contactInfo.email}\n`;
    if (resumeData.contactInfo.phone) prompt += `Phone: ${resumeData.contactInfo.phone}\n`;
    if (resumeData.contactInfo.location) prompt += `Location: ${resumeData.contactInfo.location}\n`;
  }
  
  if (resumeData.summary) {
    prompt += `Professional Summary: ${resumeData.summary}\n`;
  }
  
  if (resumeData.experience && resumeData.experience.length > 0) {
    prompt += `Work Experience:\n`;
    resumeData.experience.forEach((exp, index) => {
      prompt += `${index + 1}. ${exp.position} at ${exp.company}`;
      if (exp.startDate || exp.endDate) {
        prompt += ` (${exp.startDate || 'N/A'} - ${exp.endDate || 'Present'})`;
      }
      prompt += `\n   ${exp.description}\n`;
    });
  }
  
  if (resumeData.education && resumeData.education.length > 0) {
    prompt += `Education:\n`;
    resumeData.education.forEach((edu, index) => {
      prompt += `${index + 1}. ${edu.degree} from ${edu.institution}`;
      if (edu.year) prompt += ` (${edu.year})`;
      prompt += `\n`;
    });
  }
  
  if (resumeData.skills && resumeData.skills.length > 0) {
    prompt += `Skills: ${resumeData.skills.join(', ')}\n`;
  }
  
  prompt += `\nFormat the resume in a clean, professional format using text formatting. Include appropriate sections like Contact Information, Professional Summary, Work Experience, Education, and Skills. Use clear headings and bullet points where appropriate. Focus on highlighting the person's experience and skills in a way that would be attractive to potential employers.`;
  
  return prompt;
}

// Simple resume template endpoint (for reference)
router.get('/template', (req, res) => {
  const template = {
    contactInfo: {
      name: "Your Full Name",
      email: "your.email@example.com",
      phone: "(555) 123-4567",
      location: "City, State"
    },
    summary: "Professional summary highlighting key skills and experience",
    experience: [
      {
        company: "Company Name",
        position: "Job Title",
        startDate: "Month Year",
        endDate: "Month Year",
        description: "Detailed description of responsibilities and achievements"
      }
    ],
    education: [
      {
        institution: "University/College Name",
        degree: "Degree",
        year: "Year"
      }
    ],
    skills: ["Skill 1", "Skill 2", "Skill 3"]
  };

  res.json({
    success: true,
    data: template
  });
});

module.exports = router;