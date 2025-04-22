const httpStatus = require('http-status');
const { Lead } = require('../models/lead.model');
const { APIError } = require('../utils/apiError');
const logger = require('../utils/logger');

exports.createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(httpStatus.CREATED).json({
      status: 'success',
      data: {
        lead,
      },
    });
  } catch (error) {
    logger.error('Error creating lead:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Error creating lead',
    });
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ owner: req.user.id });

    res.status(httpStatus.OK).json({
      status: 'success',
      results: leads.length,
      data: {
        leads,
      },
    });
  } catch (error) {
    logger.error('Error getting leads:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Error getting leads',
    });
  }
};

// Implement other CRUD operations (getLead, updateLead, deleteLead) similarly