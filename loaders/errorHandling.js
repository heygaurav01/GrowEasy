const { APIError } = require('../utils/apiError');
const logger = require('../utils/logger');

const initializeErrorHandling = (app) => {
  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);

    if (err instanceof APIError) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join('. '),
      });
    }

    // Handle mongoose duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate field value entered',
      });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
      });
    }

    // Handle JWT expired errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
      });
    }

    // Default server error
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  });
};

module.exports = { initializeErrorHandling };