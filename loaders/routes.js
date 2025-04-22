const express = require('express');
const authRoutes = require('../routes/auth.routes');
const leadRoutes = require('../routes/lead.routes');

const initializeRoutes = (app) => {
  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/leads', leadRoutes);

  // Health check endpoint
  app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'API is healthy',
    });
  });

  // Handle 404 for undefined routes
  app.all('*', (req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: `Can't find ${req.originalUrl} on this server!`,
    });
  });
};

module.exports = { initializeRoutes };