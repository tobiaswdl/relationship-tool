const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  // Session information
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  
  // Response data
  responses: {
    type: Map,
    of: Number,
    required: true
  },
  
  // Validation flags
  validation: {
    attentionCheckPassed: {
      type: Boolean,
      default: false
    },
    defensiveResponding: {
      type: Boolean,
      default: false
    },
    allQuestionsAnswered: {
      type: Boolean,
      default: false
    }
  },
  
  // Scoring results
  scores: {
    anxiety: {
      type: Number,
      min: 1,
      max: 5
    },
    avoidance: {
      type: Number,
      min: 1,
      max: 5
    },
    disorganization: {
      type: Number,
      min: 1,
      max: 5
    },
    secure: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Classification results
  classification: {
    primaryStyle: {
      type: String,
      enum: ['secure', 'anxious', 'avoidant', 'fearful'],
      required: false
    },
    disorganizationFlag: {
      type: Boolean,
      default: false
    }
  },
  
  // Notes and flags
  notes: [{
    type: String
  }],
  
  // Metadata
  userAgent: String,
  ipAddress: String,
  completionTime: Number // in seconds
  
}, {
  timestamps: true
});

// Indexes for performance
assessmentSchema.index({ sessionId: 1 });
assessmentSchema.index({ completedAt: -1 });
assessmentSchema.index({ 'classification.primaryStyle': 1 });

// Virtual for checking if assessment is complete
assessmentSchema.virtual('isComplete').get(function() {
  return this.completedAt !== undefined;
});

// Method to calculate completion time
assessmentSchema.methods.calculateCompletionTime = function() {
  if (this.completedAt && this.startedAt) {
    return Math.round((this.completedAt - this.startedAt) / 1000);
  }
  return null;
};

// Static method to get assessment statistics
assessmentSchema.statics.getStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$classification.primaryStyle',
        count: { $sum: 1 },
        avgCompletionTime: { $avg: '$completionTime' }
      }
    }
  ]);
};

module.exports = mongoose.model('Assessment', assessmentSchema); 