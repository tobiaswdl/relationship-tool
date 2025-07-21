const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://tobiaswedel:rvZuds3hhónHozlo@relationship.qeo717y.mongodb.net/relationshiptool?retryWrites=true&w=majority&appName=relationship';

console.log('Testing MongoDB Atlas connection...');
console.log('Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('CodeName:', err.codeName);
    process.exit(1);
  }); 