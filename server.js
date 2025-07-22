const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const chalk = require('chalk'); // Add at the top if not present

// Debug: Print environment variables (mask password)
const maskedMongoUri = (process.env.MONGO_URI || '').replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$2:***@');
console.log('--- ENV DEBUG ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI:', maskedMongoUri);
console.log('-----------------');

const config = require('./config/database');
const routes = require('./routing');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Enhanced startup log
function printStartupBanner() {
  const cyan = '\x1b[36m';
  const green = '\x1b[32m';
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  console.log(`${cyan}${bold}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${reset}`);
  console.log(`${cyan}${bold}┃${reset}        ${green}Relationship Tool Server Starting...${reset}         ${cyan}${bold}┃${reset}`);
  console.log(`${cyan}${bold}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${reset}`);
  console.log(`${bold}NODE_ENV:${reset} ${process.env.NODE_ENV}`);
  const maskedMongoUri = (process.env.MONGO_URI || '').replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$2:***@');
  console.log(`${bold}MONGO_URI:${reset} ${maskedMongoUri}`);
  console.log('');
  console.log('------------------------------------------------------');
  console.log('');
}
printStartupBanner();

// Enhanced logging middleware for HTTP requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 500 ? '\x1b[41m\x1b[97m' // red bg, white text
      : res.statusCode >= 400 ? '\x1b[33m' // yellow
      : res.statusCode >= 300 ? '\x1b[36m' // cyan
      : '\x1b[32m'; // green
    const methodColor = req.method === 'POST' ? '\x1b[35m' : req.method === 'GET' ? '\x1b[34m' : '\x1b[37m';
    console.log(`  ${methodColor}${req.method}\x1b[0m ${req.originalUrl} ${statusColor}${res.statusCode}\x1b[0m - ${duration}ms \x1b[90m${req.headers['user-agent'] || ''}\x1b[0m`);
    console.log('------------------------------------------------------');
    console.log('');
  });
  next();
});

// Logging middleware
app.use(morgan('combined'));

// Static files
app.use(express.static('public'));

// Set view engine for EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const assessmentConfig = require('./config/assessment');

// Serve the quiz page dynamically
app.get('/quiz', (req, res) => {
  res.render('quiz', { questions: assessmentConfig.questions });
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
mongoose.connect(config.mongoURI, config.mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app; 