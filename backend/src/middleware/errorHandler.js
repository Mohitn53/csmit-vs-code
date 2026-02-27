/**
 * Global Error Handler Middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Don't expose Supabase/database errors to client
  if (message.includes('Supabase') || message.includes('PostgreSQL')) {
    if (process.env.NODE_ENV === 'production') {
      message = 'Database operation failed';
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Not Found Handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
};

export default {
  errorHandler,
  notFoundHandler
};
