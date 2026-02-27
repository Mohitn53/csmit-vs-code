import express from 'express';
import topicRoutes from './topicRoutes.js';
import compareRoutes from './compareRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tech Intelligence API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/topics', topicRoutes);
router.use('/compare', compareRoutes);

export default router;
