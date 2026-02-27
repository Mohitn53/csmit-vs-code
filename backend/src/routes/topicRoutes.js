import express from 'express';
import TopicController from '../controllers/TopicController.js';

const router = express.Router();

// GET /api/v1/topics/categories - Must be before :id route
router.get('/categories', TopicController.getCategories.bind(TopicController));

// GET /api/v1/topics/rising
router.get('/rising', TopicController.getTopRisingTopics.bind(TopicController));

// GET /api/v1/topics
router.get('/', TopicController.getAllTopics.bind(TopicController));

// GET /api/v1/topics/:id
router.get('/:id', TopicController.getTopicById.bind(TopicController));

// GET /api/v1/topics/:id/metrics
router.get('/:id/metrics', TopicController.getTopicMetrics.bind(TopicController));

// GET /api/v1/topics/:id/forecast
router.get('/:id/forecast', TopicController.getTopicForecast.bind(TopicController));

export default router;
