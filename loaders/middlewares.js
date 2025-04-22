const express = require('express'); // Add this line
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const { APIError } = require('../utils/apiError');
const httpStatus = require('http-status');

const initializeMiddlewares = (app) => {
  // Enable CORS
  app.use(cors());
  app.options('*', cors());

  // Set security HTTP headers
  app.use(helmet());

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Limit requests from same API
  const limiter = rateLimit({
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });
  app.use('/api', limiter);

  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Test middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });
};

module.exports = { initializeMiddlewares };