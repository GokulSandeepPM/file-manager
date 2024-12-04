const mongoose = require('mongoose');
const dotenv = require("dotenv");
const logger = require("../utils/logger");

dotenv.config();
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  logger.error('MongoDB URI is not defined in the .env file!');
  process.exit(1); 
}
logger.info(`Mongo DB URL : ${dbURI}`); 

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;