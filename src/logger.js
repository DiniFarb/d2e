import pkg from 'winston';
const { createLogger, transports, format } = pkg;

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.printf(info => `${info.level}: ${info.message}`)
    }),
    new transports.File({
      filename: './logs/server.log',
      json: false,
      maxsize: 5242880,
      maxFiles: 1,
    }),
  ]
});
export default logger;
