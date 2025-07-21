const express = require('express');
const assessmentRoutes = require('./assessmentRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API version info
router.get('/', (req, res) => {
  res.json({
    name: 'Relationship Tool API',
    version: '1.0.0',
    description: 'Attachment Style Assessment Tool',
    endpoints: {
      health: '/api/health',
      assessment: '/api/assessment'
    }
  });
});

// Mount assessment routes
router.use('/assessment', assessmentRoutes);

module.exports = router; 