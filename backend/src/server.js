import 'dotenv/config';
import app, { logger } from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    logger.info('MongoDB Connected');
    
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();
