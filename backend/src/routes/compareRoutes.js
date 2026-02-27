import express from 'express';
import CompareController from '../controllers/CompareController.js';

const router = express.Router();

// POST /api/v1/compare
router.post('/', CompareController.compareTopics.bind(CompareController));

export default router;
