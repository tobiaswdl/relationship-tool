module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/relationshiptool',
  mongoOptions: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  }
}; 