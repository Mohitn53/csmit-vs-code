import TopicService from '../services/TopicService.js';

/**
 * TopicController
 * Handles HTTP requests for topic endpoints
 * No business logic - delegates to services
 */
export class TopicController {
  
  /**
   * GET /api/v1/topics
   * Get all topics with optional filters
   */
  async getAllTopics(req, res, next) {
    try {
      const { limit, offset, category } = req.query;
      
      const filters = {};
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);
      if (category) filters.category = category;

      const topics = await TopicService.getAllTopics(filters);

      res.json({
        success: true,
        data: topics.map(t => t.toJSON()),
        count: topics.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/topics/:id
   * Get topic details by ID
   */
  async getTopicById(req, res, next) {
    try {
      const { id } = req.params;

      const topic = await TopicService.getTopicDetails(id);

      if (!topic) {
        return res.status(404).json({
          success: false,
          error: 'Topic not found'
        });
      }

      res.json({
        success: true,
        data: topic
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/topics/:id/metrics
   * Get metrics for a topic
   */
  async getTopicMetrics(req, res, next) {
    try {
      const { id } = req.params;
      const { limit, offset } = req.query;

      // Verify topic exists
      const topic = await TopicService.getTopicById(id);
      if (!topic) {
        return res.status(404).json({
          success: false,
          error: 'Topic not found'
        });
      }

      const options = {};
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);

      const metrics = await TopicService.getTopicMetrics(id, options);

      res.json({
        success: true,
        data: metrics.map(m => m.toJSON()),
        count: metrics.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/topics/:id/forecast
   * Get forecast for a topic
   */
  async getTopicForecast(req, res, next) {
    try {
      const { id } = req.params;

      // Verify topic exists
      const topic = await TopicService.getTopicById(id);
      if (!topic) {
        return res.status(404).json({
          success: false,
          error: 'Topic not found'
        });
      }

      const forecast = await TopicService.getTopicForecast(id);

      if (!forecast) {
        return res.status(404).json({
          success: false,
          error: 'No forecast available for this topic'
        });
      }

      res.json({
        success: true,
        data: forecast.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/topics/categories
   * Get all unique categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await TopicService.getCategories();

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/topics/rising
   * Get top rising topics
   */
  async getTopRisingTopics(req, res, next) {
    try {
      const { limit = 10 } = req.query;

      const topics = await TopicService.getTopRisingTopics(parseInt(limit));

      res.json({
        success: true,
        data: topics
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TopicController();
