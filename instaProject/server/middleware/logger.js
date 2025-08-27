const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '1d',
      maxSize: '20m'
    })
  ]
});

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const user = req.user?.username || "Anonymous"; 
    const logMessage = `${req.method} ${req.originalUrl} | User: ${user} | Status: ${res.statusCode} | ${duration}ms`;
    
    logger.info(logMessage);
  });

  next();
};

module.exports = { logger, loggerMiddleware };
