const Assessment = require('../models/Assessment');
const config = require('../config/assessment');
const { AppError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('crypto');

// Scoring engine
class ScoringEngine {
  static calculateSubscaleScore(responses, subscaleName) {
    const subscale = config.subscales[subscaleName];
    if (!subscale) throw new AppError(`Invalid subscale: ${subscaleName}`, 400);
    
    const questionIds = [];
    for (let i = subscale.start; i <= subscale.end; i++) {
      questionIds.push(i);
    }
    
    const scores = questionIds.map(id => {
      const question = config.questions.find(q => q.id === id);
      const response = responses[id];
      
      if (response === undefined) {
        throw new AppError(`Missing response for question ${id}`, 400);
      }
      
      // Apply reverse coding if needed
      return question.reverse ? (6 - response) : response;
    });
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
  
  static classifyAttachmentStyle(anxietyScore, avoidanceScore) {
    if (anxietyScore < 3 && avoidanceScore < 3) {
      return 'secure';
    } else if (anxietyScore >= 3 && avoidanceScore < 3) {
      return 'anxious';
    } else if (anxietyScore < 3 && avoidanceScore >= 3) {
      return 'avoidant';
    } else {
      return 'fearful';
    }
  }
}

// Validation engine
class ValidationEngine {
  static checkAttentionCheck(responses) {
    const { questionId, expectedAnswer } = config.attentionCheck;
    const actualAnswer = responses[questionId];
    
    return actualAnswer === expectedAnswer;
  }
  
  static checkDefensiveResponding(responses) {
    // Check for overly positive responses on reverse-coded items
    const reverseQuestions = config.questions.filter(q => q.reverse);
    const highResponses = reverseQuestions.filter(q => responses[q.id] >= 4).length;
    
    return highResponses >= reverseQuestions.length * 0.8; // 80% threshold
  }
  
  static validateAllQuestionsAnswered(responses) {
    const expectedQuestions = config.questions.map(q => q.id);
    const answeredQuestions = Object.keys(responses).map(Number);
    
    return expectedQuestions.every(q => answeredQuestions.includes(q));
  }
}

// Assessment controller methods
const assessmentController = {
  // Get questions for a specific page
  getQuestions: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const questionsPerPage = config.questionsPerPage;
      const startIndex = (page - 1) * questionsPerPage;
      const endIndex = startIndex + questionsPerPage;
      
      const pageQuestions = config.questions.slice(startIndex, endIndex);
      const totalPages = Math.ceil(config.questions.length / questionsPerPage);
      
      res.json({
        questions: pageQuestions,
        pagination: {
          currentPage: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        responseOptions: config.responseOptions
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Create a new assessment session
  createSession: async (req, res, next) => {
    try {
      const sessionId = uuidv4();
      const { userAgent, ipAddress } = req.body;
      
      const assessment = new Assessment({
        sessionId,
        userAgent,
        ipAddress,
        responses: new Map()
      });
      
      await assessment.save();
      
      res.status(201).json({
        sessionId,
        message: 'Assessment session created successfully'
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Submit assessment responses and get results
  submitAssessment: async (req, res, next) => {
    try {
      const { sessionId, responses, userAgent, ipAddress } = req.body;
      
      // Find the assessment session
      const assessment = await Assessment.findOne({ sessionId });
      if (!assessment) {
        throw new AppError('Assessment session not found', 404);
      }
      
      // Validate all questions are answered
      if (!ValidationEngine.validateAllQuestionsAnswered(responses)) {
        throw new AppError('All 30 questions must be answered', 400);
      }
      
      // Perform validation checks
      const attentionCheckPassed = ValidationEngine.checkAttentionCheck(responses);
      const defensiveResponding = ValidationEngine.checkDefensiveResponding(responses);
      
      // Calculate scores
      const anxietyScore = ScoringEngine.calculateSubscaleScore(responses, 'anxiety');
      const avoidanceScore = ScoringEngine.calculateSubscaleScore(responses, 'avoidance');
      const disorganizationScore = ScoringEngine.calculateSubscaleScore(responses, 'disorganization');
      const secureScore = ScoringEngine.calculateSubscaleScore(responses, 'secure');
      
      // Classify attachment style
      const primaryStyle = ScoringEngine.classifyAttachmentStyle(anxietyScore, avoidanceScore);
      
      // Check for disorganization flag
      const disorganizationFlag = disorganizationScore >= config.thresholds.disorganization;
      
      // Generate notes
      const notes = [];
      if (!attentionCheckPassed) {
        notes.push('Attention check failed - results may be unreliable');
      }
      if (defensiveResponding) {
        notes.push('Potential defensive responding detected');
      }
      if (disorganizationFlag) {
        notes.push('High disorganization score - may indicate push-pull dynamics');
      }
      
      // Update assessment with results
      assessment.responses = new Map(Object.entries(responses));
      assessment.completedAt = new Date();
      assessment.completionTime = assessment.calculateCompletionTime();
      assessment.userAgent = userAgent || assessment.userAgent;
      assessment.ipAddress = ipAddress || assessment.ipAddress;
      
      // Update validation flags
      assessment.validation.attentionCheckPassed = attentionCheckPassed;
      assessment.validation.defensiveResponding = defensiveResponding;
      assessment.validation.allQuestionsAnswered = true;
      
      // Update scores
      assessment.scores = {
        anxiety: anxietyScore,
        avoidance: avoidanceScore,
        disorganization: disorganizationScore,
        secure: secureScore
      };
      
      // Update classification
      assessment.classification = {
        primaryStyle,
        disorganizationFlag
      };
      
      // Update notes
      assessment.notes = notes;
      
      await assessment.save();
      
      // Return results
      res.json({
        sessionId,
        primaryStyle,
        subscaleScores: {
          anxiety: anxietyScore,
          avoidance: avoidanceScore,
          disorganization: disorganizationScore,
          secure: secureScore
        },
        flags: {
          attentionCheckPassed,
          defensiveResponding,
          disorganizationFlag
        },
        notes,
        completionTime: assessment.completionTime
      });
      
    } catch (error) {
      next(error);
    }
  },
  
  // Get assessment results by session ID
  getResults: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      
      const assessment = await Assessment.findOne({ sessionId });
      if (!assessment) {
        throw new AppError('Assessment not found', 404);
      }
      
      if (!assessment.isComplete) {
        throw new AppError('Assessment not yet completed', 400);
      }
      
      res.json({
        sessionId: assessment.sessionId,
        primaryStyle: assessment.classification.primaryStyle,
        subscaleScores: assessment.scores,
        flags: assessment.validation,
        notes: assessment.notes,
        completedAt: assessment.completedAt,
        completionTime: assessment.completionTime
      });
      
    } catch (error) {
      next(error);
    }
  },
  
  // Get assessment statistics
  getStats: async (req, res, next) => {
    try {
      const stats = await Assessment.getStats();
      
      res.json({
        statistics: stats,
        totalAssessments: stats.reduce((sum, stat) => sum + stat.count, 0)
      });
      
    } catch (error) {
      next(error);
    }
  }
};

module.exports = assessmentController; 