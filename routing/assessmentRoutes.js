const express = require('express');
const rateLimit = require('express-rate-limit');
const assessmentController = require('../controllers/assessmentController');
const {
  validateAssessmentResponses,
  validateGetQuestions,
  validateCreateSession,
  handleValidationErrors,
  validateAssessmentCompletion,
  assessmentRateLimit
} = require('../middleware/validation');

const router = express.Router();

// Rate limiting for assessment submissions
const submissionLimiter = rateLimit(assessmentRateLimit);

// GET /api/assessment/questions - Get questions for a specific page
router.get('/questions',
  validateGetQuestions,
  handleValidationErrors,
  assessmentController.getQuestions
);

// POST /api/assessment/session - Create a new assessment session
router.post('/session',
  validateCreateSession,
  handleValidationErrors,
  assessmentController.createSession
);

// POST /api/assessment/submit - Submit assessment responses and get results
router.post('/submit',
  submissionLimiter,
  validateAssessmentResponses,
  validateAssessmentCompletion,
  handleValidationErrors,
  assessmentController.submitAssessment
);

// GET /api/assessment/results/:sessionId - Get assessment results by session ID
router.get('/results/:sessionId',
  assessmentController.getResults
);

// GET /api/assessment/stats - Get assessment statistics (admin endpoint)
router.get('/stats',
  assessmentController.getStats
);

module.exports = router; 