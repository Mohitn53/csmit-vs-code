import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';

/**
 * Express Application Configuration
 */
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// API routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Tech Intelligence Forecasting Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      topics: '/api/v1/topics',
      compare: '/api/v1/compare'
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
