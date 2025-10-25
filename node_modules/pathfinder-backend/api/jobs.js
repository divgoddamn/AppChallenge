// backend/api/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Joi = require('joi');

// Validation schemas
const createJobSchema = Joi.object({
  title: Joi.string().required(),
  company: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.string().optional(),
  location: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  salary: Joi.string().optional(),
  employmentType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship').optional(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  source: Joi.string().optional(),
  sourceId: Joi.string().optional(),
  isRemote: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

// Get all jobs with optional filtering
router.get('/', async (req, res) => {
  try {
    const {
      search,
      location,
      employmentType,
      isRemote,
      isActive = true,
      limit = 50,
      offset = 0
    } = req.query;

    const whereClause = { isActive: isActive === 'true' };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { requirements: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }

    if (employmentType) {
      whereClause.employmentType = employmentType;
    }

    if (isRemote !== undefined) {
      whereClause.isRemote = isRemote === 'true';
    }

    const jobs = await Job.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['postedDate', 'DESC']]
    });

    res.json({
      success: true,
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// Get a specific job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// Create a new job
router.post('/', async (req, res) => {
  try {
    const { error, value } = createJobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details
      });
    }

    const job = await Job.create(value);

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
});

// Update a job by ID
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = createJobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details
      });
    }

    const [updatedRowsCount] = await Job.update(value, {
      where: { id: req.params.id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const updatedJob = await Job.findByPk(req.params.id);

    res.json({
      success: true,
      data: updatedJob,
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: true,
      message: 'Error updating job',
      error: error.message
    });
  }
});

// Delete a job by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Job.destroy({
      where: { id: req.params.id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
});

// Get jobs near a location
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const distance = req.query.distance || 10; // Distance in miles, default 10
    
    // Convert miles to degrees (rough approximation)
    const latDelta = distance / 69; // 1 degree of latitude is ~69 miles
    const lngDelta = distance / Math.abs(Math.cos(lat * Math.PI / 180) * 69); // 1 degree of longitude varies by latitude

    const jobs = await Job.findAll({
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
      data: jobs,
      count: jobs.length,
      distance: `${distance} miles`
    });
  } catch (error) {
    console.error('Error fetching nearby jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby jobs',
      error: error.message
    });
  }
});

module.exports = router;