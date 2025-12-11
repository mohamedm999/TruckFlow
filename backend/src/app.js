import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import httpLogger from './middleware/httpLogger.js';
import logger from './config/logger.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import truckRoutes from './routes/truckRoutes.js';
import trailerRoutes from './routes/trailerRoutes.js';
import tireRoutes from './routes/tireRoutes.js';
import fuelRoutes from './routes/fuelRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3002'],
  credentials: true
}));

// Compression middleware (gzip)
app.use(compression());

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging with Winston
app.use(httpLogger);

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/trailers', trailerRoutes);
app.use('/api/tires', tireRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export { logger };
export default app;
