module.exports = {
  // Question configuration
  questions: [
    // Anxiety subscale (Q1-Q8)
    { id: 1, text: "I often worry that my partner doesn't really care about me.", subscale: "anxiety", reverse: false },
    { id: 2, text: "I need a lot of reassurance that my partner won't leave me.", subscale: "anxiety", reverse: false },
    { id: 3, text: "When I feel distant from my partner, I get upset or anxious.", subscale: "anxiety", reverse: false },
    { id: 4, text: "I fear being abandoned if I get too close.", subscale: "anxiety", reverse: false },
    { id: 5, text: "I find myself constantly checking that my partner still loves me.", subscale: "anxiety", reverse: false },
    { id: 6, text: "Small signs of indifference (e.g. a late reply) make me panic about the relationship.", subscale: "anxiety", reverse: false },
    { id: 7, text: "I worry I'm not \"good enough\" for my partner.", subscale: "anxiety", reverse: false },
    { id: 8, text: "I sometimes replay conversations in my head, fearing I said something wrong.", subscale: "anxiety", reverse: false },
    
    // Avoidance subscale (Q9-Q16)
    { id: 9, text: "I'm uncomfortable when my partner wants too much closeness.", subscale: "avoidance", reverse: false },
    { id: 10, text: "I prefer to keep some emotional distance in my relationships.", subscale: "avoidance", reverse: false },
    { id: 11, text: "I feel suffocated when my partner is very dependent on me.", subscale: "avoidance", reverse: false },
    { id: 12, text: "I find it hard to trust someone enough to open up to them.", subscale: "avoidance", reverse: false },
    { id: 13, text: "I value my independence and worry closeness might trap me.", subscale: "avoidance", reverse: false },
    { id: 14, text: "When things get intense emotionally, I withdraw.", subscale: "avoidance", reverse: false },
    { id: 15, text: "I often change the subject when conversations get too personal.", subscale: "avoidance", reverse: false },
    { id: 16, text: "I'm more comfortable handling problems on my own than talking them through.", subscale: "avoidance", reverse: false },
    
    // Disorganized/Fearful subscale (Q17-Q22)
    { id: 17, text: "I have mixed feelings—sometimes craving closeness, sometimes pushing people away.", subscale: "disorganization", reverse: false },
    { id: 18, text: "My reactions in close moments can feel unpredictable, even to me.", subscale: "disorganization", reverse: false },
    { id: 19, text: "When upset, I can't tell if I want more support or to be left alone.", subscale: "disorganization", reverse: false },
    { id: 20, text: "I swing between being very clingy and very distant with my partner.", subscale: "disorganization", reverse: false },
    { id: 21, text: "I sometimes feel like I don't know whether I love someone or fear them at the same time.", subscale: "disorganization", reverse: false },
    { id: 22, text: "I can go from feeling completely secure to totally panicked about losing my partner.", subscale: "disorganization", reverse: false },
    
    // Secure subscale (Q23-Q28)
    { id: 23, text: "When I'm upset, I trust my partner will be there for me.", subscale: "secure", reverse: false },
    { id: 24, text: "I feel comfortable talking through problems with my partner.", subscale: "secure", reverse: false },
    { id: 25, text: "I'm generally satisfied with the amount of closeness in my relationships.", subscale: "secure", reverse: false },
    { id: 26, text: "I feel confident relying on my partner when I need support.", subscale: "secure", reverse: false },
    { id: 27, text: "I find it easy to be emotionally close and open with my partner.", subscale: "secure", reverse: false },
    { id: 28, text: "My partner's needs and my needs feel balanced and manageable.", subscale: "secure", reverse: false },
    
    // Attention check (Q29)
    { id: 29, text: "(Please select \"Agree\" for this statement to show you're reading closely.)", subscale: "attention", reverse: false },
    
    // Defensive responding check (Q30)
    { id: 30, text: "I never feel jealous or insecure in my relationships.", subscale: "defensive", reverse: true }
  ],

  // Attention check question (QC question)
  attentionCheck: {
    questionId: 29, // Q29 as attention check
    expectedAnswer: 4 // Expected rating of 4 ("Agree")
  },

  // Scoring thresholds
  thresholds: {
    anxiety: 3.5, // Threshold for anxiety classification
    avoidance: 3.5, // Threshold for avoidance classification
    disorganization: 3.5, // Threshold for disorganization flag
    defensiveResponding: 4 // Threshold for defensive responding flag (Q30 ≥ 4)
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
    disorganization: { start: 17, end: 22, name: "Disorganization" },
    secure: { start: 23, end: 28, name: "Secure" }
  }
}; 