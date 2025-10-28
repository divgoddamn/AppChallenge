// backend/api/resources.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Joi = require('joi');

// Validation schemas
const createResourceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('shelter', 'food', 'health', 'job', 'education', 'rehab', 'legal').required(),
  address: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  phone: Joi.string().optional(),
  hours: Joi.string().optional(),
  description: Joi.string().optional(),
  capacity: Joi.string().valid('Available', 'Full', 'Limited').optional(),
  eligibility: Joi.array().items(Joi.string()).optional().default(['all']),
  website: Joi.string().uri().optional(),
  contactPerson: Joi.string().optional(),
  requirements: Joi.string().optional(),
  services: Joi.array().items(Joi.string()).optional()
});

// Get all resources with optional filtering
router.get('/', async (req, res) => {
  try {
    const {
      type,
      eligibility,
      isActive = true,
      limit = 50,
      offset = 0,
      search
    } = req.query;

    const whereClause = { isActive: isActive === 'true' };

    if (type) whereClause.type = type;
    if (eligibility) whereClause.eligibility = { [Op.contains]: [eligibility] };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const resources = await Resource.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resources',
      error: error.message
    });
  }
});

// Get a specific resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource',
      error: error.message
    });
  }
});

// Create a new resource
router.post('/', async (req, res) => {
  try {
    const { error, value } = createResourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details
      });
    }

    const resource = await Resource.create(value);

    res.status(201).json({
      success: true,
      data: resource,
      message: 'Resource created successfully'
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating resource',
      error: error.message
    });
  }
});

// Update a resource by ID
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = createResourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details
      });
    }

    const [updatedRowsCount] = await Resource.update(value, {
      where: { id: req.params.id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const updatedResource = await Resource.findByPk(req.params.id);

    res.json({
      success: true,
      data: updatedResource,
      message: 'Resource updated successfully'
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resource',
      error: error.message
    });
  }
});

// Delete a resource by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Resource.destroy({
      where: { id: req.params.id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resource',
      error: error.message
    });
  }
});

// Get resources near a location
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const distance = req.query.distance || 10; // Distance in miles, default 10
    
    // Convert miles to degrees (rough approximation)
    const latDelta = distance / 69; // 1 degree of latitude is ~69 miles
    const lngDelta = distance / Math.abs(Math.cos(lat * Math.PI / 180) * 69); // 1 degree of longitude varies by latitude

    const resources = await Resource.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn('ABS', sequelize.col('latitude') - parseFloat(lat)), '<=', latDelta
          ),
          sequelize.where(
            sequelize.fn('ABS', sequelize.col('longitude') - parseFloat(lng)), '<=', lngDelta
          )
        ],
        isActive: true
      }
    });

    res.json({
      success: true,
      data: resources,
      count: resources.length,
      distance: `${distance} miles`
    });
  } catch (error) {
    console.error('Error fetching nearby resources:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby resources',
      error: error.message
    });
  }
});

module.exports = router;