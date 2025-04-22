require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./config/database');
const { initializeMiddlewares } = require('./loaders/middlewares');
const { initializeRoutes } = require('./loaders/routes');
const { initializeErrorHandling } = require('./loaders/errorHandling');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize application
(async () => {
  try {
    // Connect to database
    await connectToDatabase();

    // Initialize middlewares
    initializeMiddlewares(app);

    // Initialize routes
    initializeRoutes(app);

    // Initialize error handling
    initializeErrorHandling(app);

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
})();

module.exports = app;