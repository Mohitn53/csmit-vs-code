/**
 * Request Logger Middleware
 * Logs incoming requests
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);

  // Log response time
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

export default requestLogger;
