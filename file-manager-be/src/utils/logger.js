const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { transports } = winston;
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} - ${level} :- ${message}`;
  })
);

// Configure size-based log rotation
const sizeBasedRotateTransport = new DailyRotateFile({
  filename: `${logDirectory}/application.log`,
  maxSize: '5m',
  maxFiles: '3',
  zippedArchive: true,
  createSymlink: true,
});

// Configure logger instance
const logger = winston.createLogger({
  level: 'info', 
  format: logFormat,
  transports: [
    new transports.Console({ format: winston.format.simple() }),
    sizeBasedRotateTransport,
  ],
});

module.exports = logger;