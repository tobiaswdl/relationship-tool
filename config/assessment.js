module.exports = {
  // Question configuration
  questions: [
    // Anxiety subscale (Q1-Q8)
    { id: 1, text: "I worry about being abandoned", subscale: "anxiety", reverse: false },
    { id: 2, text: "I worry that my partner doesn't really love me", subscale: "anxiety", reverse: false },
    { id: 3, text: "I worry that romantic partners won't care about me as much as I care about them", subscale: "anxiety", reverse: false },
    { id: 4, text: "I worry about being rejected or abandoned", subscale: "anxiety", reverse: false },
    { id: 5, text: "I worry that I won't measure up to other people", subscale: "anxiety", reverse: false },
    { id: 6, text: "I worry that others won't care about me as much as I care about them", subscale: "anxiety", reverse: false },
    { id: 7, text: "I worry about being alone", subscale: "anxiety", reverse: false },
    { id: 8, text: "I worry that others don't value me as much as I value them", subscale: "anxiety", reverse: false },
    
    // Avoidance subscale (Q9-Q16)
    { id: 9, text: "I prefer not to show a partner how I feel deep down", subscale: "avoidance", reverse: false },
    { id: 10, text: "I prefer not to be too close to romantic partners", subscale: "avoidance", reverse: false },
    { id: 11, text: "I get uncomfortable when a romantic partner wants to be very close", subscale: "avoidance", reverse: false },
    { id: 12, text: "I find it difficult to trust others completely", subscale: "avoidance", reverse: false },
    { id: 13, text: "I find it difficult to allow myself to depend on romantic partners", subscale: "avoidance", reverse: false },
    { id: 14, text: "I prefer to keep to myself and not depend on others", subscale: "avoidance", reverse: false },
    { id: 15, text: "I find it difficult to open up to romantic partners", subscale: "avoidance", reverse: false },
    { id: 16, text: "I prefer not to depend on others", subscale: "avoidance", reverse: false },
    
    // Disorganization subscale (Q17-Q24)
    { id: 17, text: "I find myself thinking about traumatic experiences", subscale: "disorganization", reverse: false },
    { id: 18, text: "I find myself acting in ways that I don't understand", subscale: "disorganization", reverse: false },
    { id: 19, text: "I find myself doing things that I don't want to do", subscale: "disorganization", reverse: false },
    { id: 20, text: "I find myself feeling confused about my relationships", subscale: "disorganization", reverse: false },
    { id: 21, text: "I find myself feeling overwhelmed by my emotions", subscale: "disorganization", reverse: false },
    { id: 22, text: "I find myself feeling disconnected from my body", subscale: "disorganization", reverse: false },
    { id: 23, text: "I find myself feeling like I'm not myself", subscale: "disorganization", reverse: false },
    { id: 24, text: "I find myself feeling like I'm in a fog", subscale: "disorganization", reverse: false },
    
    // Secure subscale (Q25-Q30) - reverse coded
    { id: 25, text: "I find it easy to get close to others", subscale: "secure", reverse: true },
    { id: 26, text: "I am comfortable depending on others", subscale: "secure", reverse: true },
    { id: 27, text: "I am comfortable having others depend on me", subscale: "secure", reverse: true },
    { id: 28, text: "I don't worry about being abandoned", subscale: "secure", reverse: true },
    { id: 29, text: "I don't worry about being rejected", subscale: "secure", reverse: true },
    { id: 30, text: "I am comfortable with intimacy", subscale: "secure", reverse: true }
  ],

  // Attention check question (QC question)
  attentionCheck: {
    questionId: 15, // Q15 as attention check
    expectedAnswer: 3 // Expected rating of 3
  },

  // Scoring thresholds
  thresholds: {
    disorganization: 3.5, // Threshold for disorganization flag
    defensiveResponding: 4.5 // Threshold for defensive responding flag
  },

  // Response options
  responseOptions: [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" }
  ],

  // Questions per page for UI
  questionsPerPage: 6,

  // Subscale definitions
  subscales: {
    anxiety: { start: 1, end: 8, name: "Anxiety" },
    avoidance: { start: 9, end: 16, name: "Avoidance" },
    disorganization: { start: 17, end: 24, name: "Disorganization" },
    secure: { start: 25, end: 30, name: "Secure" }
  }
}; 