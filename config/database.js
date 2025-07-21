module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/relationshiptool',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false
  }
}; 