const { body, validationResult } = require('express-validator');

// Validation rules for assessment responses
const validateAssessmentResponses = [
  body('responses')
    .isObject()
    .withMessage('Responses must be an object'),
  
  body('responses.*')
    .isInt({ min: 1, max: 5 })
    .withMessage('Each response must be an integer between 1 and 5'),
  
  body('sessionId')
    .isString()
    .notEmpty()
    .withMessage('Session ID is required'),
  
  body('userAgent')
    .optional()
    .isString()
    .withMessage('User agent must be a string'),
  
  body('ipAddress')
    .optional()
    .isIP()
    .withMessage('IP address must be a valid IP')
];

// Validation rules for getting questions
const validateGetQuestions = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

// Validation rules for session creation
const validateCreateSession = [
  body('userAgent')
    .optional()
    .isString()
    .withMessage('User agent must be a string'),
  
  body('ipAddress')
    .optional()
    .isIP()
    .withMessage('IP address must be a valid IP')
];

// Generic validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Custom validation for assessment completion
const validateAssessmentCompletion = (req, res, next) => {
  const { responses } = req.body;
  const config = require('../config/assessment');
  
  // Check if all 30 questions are answered
  const expectedQuestions = config.questions.map(q => q.id);
  const answeredQuestions = Object.keys(responses).map(Number);
  
  const missingQuestions = expectedQuestions.filter(q => !answeredQuestions.includes(q));
  
  if (missingQuestions.length > 0) {
    return res.status(400).json({
      error: 'Incomplete assessment',
      message: 'All 30 questions must be answered',
      missingQuestions
    });
  }
  
  // Check if all responses are valid (1-5)
  const invalidResponses = Object.entries(responses).filter(([questionId, response]) => {
    return !Number.isInteger(response) || response < 1 || response > 5;
  });
  
  if (invalidResponses.length > 0) {
    return res.status(400).json({
      error: 'Invalid responses',
      message: 'All responses must be integers between 1 and 5',
      invalidResponses
    });
  }
  
  next();
};

// Rate limiting for assessment submissions
const assessmentRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 assessment submissions per windowMs
  message: {
    error: 'Too many assessment submissions',
    message: 'Please wait before submitting another assessment'
  }
};

module.exports = {
  validateAssessmentResponses,
  validateGetQuestions,
  validateCreateSession,
  handleValidationErrors,
  validateAssessmentCompletion,
  assessmentRateLimit
}; 