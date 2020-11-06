import winston from 'winston';

const myFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.label(),
  winston.format.align(),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level} - ${info.message}`,
  ),
);
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: myFormat,
    }),
  ],
});
export default logger;
