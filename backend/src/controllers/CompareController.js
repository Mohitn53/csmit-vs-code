import TopicService from '../services/TopicService.js';

/**
 * CompareController
 * Handles comparison of multiple topics
 */
export class CompareController {
  
  /**
   * POST /api/v1/compare
   * Compare multiple topics
   * Body: { topic_ids: [id1, id2, id3] }
   */
  async compareTopics(req, res, next) {
    try {
      const { topic_ids } = req.body;

      // Validate input
      if (!topic_ids || !Array.isArray(topic_ids)) {
        return res.status(400).json({
          success: false,
          error: 'topic_ids must be an array'
        });
      }

      if (topic_ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one topic_id is required'
        });
      }

      if (topic_ids.length > 5) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 5 topics can be compared at once'
        });
      }

      // Get comparison data
      const comparisons = await TopicService.compareTopics(topic_ids);

      if (comparisons.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No valid topics found'
        });
      }

      res.json({
        success: true,
        data: comparisons,
        count: comparisons.length
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CompareController();
