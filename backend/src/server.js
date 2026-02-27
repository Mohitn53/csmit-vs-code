import dotenv from 'dotenv';
import app from './app.js';
import { scheduleDailyUpdate } from './jobs/dailyUpdate.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Start Express server
    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('🚀 Tech Intelligence Forecasting Platform API');
      console.log('='.repeat(60));
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Server running on: http://localhost:${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
      console.log('='.repeat(60));
      console.log('Available endpoints:');
      console.log(`  - GET  /api/v1/health`);
      console.log(`  - GET  /api/v1/topics`);
      console.log(`  - GET  /api/v1/topics/:id`);
      console.log(`  - GET  /api/v1/topics/:id/metrics`);
      console.log(`  - GET  /api/v1/topics/:id/forecast`);
      console.log(`  - GET  /api/v1/topics/categories`);
      console.log(`  - GET  /api/v1/topics/rising`);
      console.log(`  - POST /api/v1/compare`);
      console.log('='.repeat(60));
    });

    // Schedule daily update job
    scheduleDailyUpdate();

    console.log('✓ Server initialization complete');
    console.log('');
    console.log('💡 Next steps:');
    console.log('  1. Ensure Supabase is configured (.env file)');
    console.log('  2. Run schema.sql in Supabase SQL Editor');
    console.log('  3. Seed topics data');
    console.log('  4. Trigger initial data generation (optional)');
    console.log('');

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
