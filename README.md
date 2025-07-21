# Relationship Tool - Attachment Style Assessment

A comprehensive web application for assessing attachment styles in relationships. Built with Node.js, Express, MongoDB, and modern JavaScript.

## Features

- **30-Question Assessment**: Comprehensive attachment style evaluation
- **Real-time Scoring**: Instant calculation of subscale scores
- **Validation System**: Attention checks and quality control measures
- **Responsive Design**: Works on desktop and mobile devices
- **RESTful API**: Clean, documented API endpoints
- **Data Persistence**: MongoDB storage with session management
- **Security**: Rate limiting, input validation, and error handling

## Project Structure

```
relationshiptool/
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection settings
│   └── assessment.js       # Assessment questions and scoring logic
├── controllers/            # Business logic controllers
│   └── assessmentController.js
├── middleware/             # Express middleware
│   ├── validation.js       # Request validation
│   └── errorHandler.js     # Error handling
├── models/                 # MongoDB models
│   └── Assessment.js       # Assessment data model
├── public/                 # Static files (frontend)
│   ├── index.html          # Main HTML template
│   ├── styles.css          # CSS styles
│   └── app.js              # Frontend JavaScript
├── routing/                # API routes
│   ├── index.js            # Main router
│   └── assessmentRoutes.js # Assessment endpoints
├── views/                  # Server-side templates
│   └── templates/          # HTML templates
├── server.js               # Main application entry point
├── package.json            # Dependencies and scripts
├── env.example             # Environment variables template
└── README.md               # Project documentation
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tobiaswdl/relationshiptool.git
   cd relationshiptool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGO_URI` in your `.env` file

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Assessment Endpoints

- `GET /api/assessment/questions?page=1` - Get questions for a specific page
- `POST /api/assessment/session` - Create a new assessment session
- `POST /api/assessment/submit` - Submit assessment responses and get results
- `GET /api/assessment/results/:sessionId` - Get assessment results by session ID
- `GET /api/assessment/stats` - Get assessment statistics

### Utility Endpoints

- `GET /api/health` - Health check
- `GET /api/` - API information

## Assessment Structure

The assessment consists of 30 questions across 4 subscales:

1. **Anxiety (Q1-Q8)**: Measures worry about abandonment and rejection
2. **Avoidance (Q9-Q16)**: Measures discomfort with intimacy and dependence
3. **Disorganized/Fearful (Q17-Q22)**: Measures mixed feelings and push-pull dynamics
4. **Secure (Q23-Q28)**: Measures comfort with intimacy and emotional support
5. **Attention Check (Q29)**: Quality control question
6. **Defensive Responding Check (Q30)**: Detects overly positive responses

### Scoring Logic

- **Primary Classification**: Based on Anxiety vs. Avoidance scores (threshold: 3.5)
  - Secure: Low anxiety (< 3.5) and low avoidance (< 3.5)
  - Anxious: High anxiety (≥ 3.5) and low avoidance (< 3.5)
  - Avoidant: Low anxiety (< 3.5) and high avoidance (≥ 3.5)
  - Fearful/Disorganized: High anxiety (≥ 3.5) and high avoidance (≥ 3.5)

### Validation Features

- **Attention Check**: Question 29 must be answered with value 4 ("Agree")
- **Defensive Responding**: Question 30 ≥ 4 triggers a warning about overly positive responses
- **Disorganization Flag**: Triggers when disorganization score ≥ 3.5

## Frontend Flow

1. **Intro Screen**: Brief instructions and "Start Test" button
2. **Question Screens**: 6 questions per page with progress bar
3. **Submission**: "Finish" button on last page submits responses
4. **Results**: Displays classification, scores, and notes

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGO_URI` | MongoDB connection string | localhost:27017/relationshiptool |
| `JWT_SECRET` | JWT signing secret | - |
| `SESSION_SECRET` | Session secret | - |

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers

## Database Schema

### Assessment Model

```javascript
{
  sessionId: String,           // Unique session identifier
  startedAt: Date,            // Session start time
  completedAt: Date,          // Session completion time
  responses: Map,             // Question responses
  validation: {               // Validation flags
    attentionCheckPassed: Boolean,
    defensiveResponding: Boolean,
    allQuestionsAnswered: Boolean
  },
  scores: {                   // Subscale scores
    anxiety: Number,
    avoidance: Number,
    disorganization: Number,
    secure: Number
  },
  classification: {           // Results
    primaryStyle: String,
    disorganizationFlag: Boolean
  },
  notes: [String],            // Assessment notes
  completionTime: Number      // Completion time in seconds
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue on GitHub or contact the development team. 