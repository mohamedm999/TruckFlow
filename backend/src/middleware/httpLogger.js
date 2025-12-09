import morgan from 'morgan';
import logger from '../config/logger.js';

// Create a stream object for morgan to use winston
const stream = {
  write: (message) => {
    // Remove newline at the end
    logger.http(message.trim());
  }
};

// Skip logging in test environment
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};

// Morgan middleware using winston
export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default httpLogger;
