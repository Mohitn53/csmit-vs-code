import TopicRepository from '../repositories/TopicRepository.js';
import DailyMetricRepository from '../repositories/DailyMetricRepository.js';
import ForecastRepository from '../repositories/ForecastRepository.js';
import SimulationService from './SimulationService.js';
import ScoringService from './ScoringService.js';
import ForecastService from './ForecastService.js';
import DailyMetric from '../domain/DailyMetric.js';
import Forecast from '../domain/Forecast.js';

/**
 * TopicService
 * Business logic for topic operations
 */
export class TopicService {
  
  /**
   * Get all topics with optional filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getAllTopics(filters = {}) {
    return await TopicRepository.findAll(filters);
  }

  /**
   * Get topic by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getTopicById(id) {
    return await TopicRepository.findById(id);
  }

  /**
   * Get topic with latest metrics and forecast
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getTopicDetails(id) {
    const topic = await TopicRepository.findById(id);
    
    if (!topic) {
      return null;
    }

    // Get latest metric
    const latestMetric = await DailyMetricRepository.findLatestByTopicId(id);
    
    // Get latest forecast
    const latestForecast = await ForecastRepository.findLatestByTopicId(id);
    
    // Get recent metrics for trend calculation
    const recentMetrics = await DailyMetricRepository.findRecentByDays(id, 7);
    
    // Calculate growth rate
    const growthRate = recentMetrics.length > 1 
      ? ScoringService.calculateGrowthRate(recentMetrics.reverse())
      : 0;

    return {
      ...topic.toJSON(),
      latest_metric: latestMetric ? latestMetric.toJSON() : null,
      latest_forecast: latestForecast ? latestForecast.toJSON() : null,
      growth_rate: growthRate,
      status: latestMetric 
        ? ScoringService.getMomentumStatus(latestMetric.weighted_score)
        : 'unknown'
    };
  }

  /**
   * Get metrics for a topic
   * @param {string} topicId
   * @param {Object} options
   * @returns {Promise<Array>}
   */
  async getTopicMetrics(topicId, options = {}) {
    return await DailyMetricRepository.findByTopicId(topicId, options);
  }

  /**
   * Get forecast for a topic
   * @param {string} topicId
   * @returns {Promise<Object|null>}
   */
  async getTopicForecast(topicId) {
    return await ForecastRepository.findLatestByTopicId(topicId);
  }

  /**
   * Compare multiple topics
   * @param {Array<string>} topicIds
   * @returns {Promise<Array>}
   */
  async compareTopics(topicIds) {
    const comparisons = [];

    for (const topicId of topicIds) {
      const details = await this.getTopicDetails(topicId);
      if (details) {
        comparisons.push(details);
      }
    }

    return comparisons;
  }

  /**
   * Get all categories
   * @returns {Promise<Array<string>>}
   */
  async getCategories() {
    return await TopicRepository.getCategories();
  }

  /**
   * Generate and save daily metrics for a topic
   * @param {string} topicId
   * @param {string} category
   * @returns {Promise<Object>}
   */
  async generateDailyMetric(topicId, category) {
    // Generate simulated scores
    const scores = SimulationService.generateDailyScores(topicId, category);
    
    // Calculate weighted score
    const weighted_score = ScoringService.calculateWeightedScore(scores);
    
    // Create metric
    const metric = new DailyMetric({
      topic_id: topicId,
      ...scores,
      weighted_score
    });
    
    // Validate and save
    metric.validate();
    return await DailyMetricRepository.create(metric);
  }

  /**
   * Generate and save forecast for a topic
   * @param {string} topicId
   * @returns {Promise<Object>}
   */
  async generateForecast(topicId) {
    // Get recent metrics (last 30 days)
    const metrics = await DailyMetricRepository.findRecentByDays(topicId, 30);
    
    // Generate forecast
    const forecastData = ForecastService.generateForecast(metrics);
    
    // Create forecast domain object
    const forecast = new Forecast({
      topic_id: topicId,
      ...forecastData
    });
    
    // Validate and save
    forecast.validate();
    return await ForecastRepository.create(forecast);
  }

  /**
   * Get top rising topics
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getTopRisingTopics(limit = 10) {
    const topics = await TopicRepository.findAll({ limit: 100 });
    const topicsWithGrowth = [];

    for (const topic of topics) {
      const recentMetrics = await DailyMetricRepository.findRecentByDays(topic.id, 7);
      
      if (recentMetrics.length > 1) {
        const growthRate = ScoringService.calculateGrowthRate(recentMetrics.reverse());
        const latestMetric = recentMetrics[recentMetrics.length - 1];
        
        topicsWithGrowth.push({
          ...topic.toJSON(),
          growth_rate: growthRate,
          current_score: latestMetric.weighted_score
        });
      }
    }

    // Sort by growth rate descending
    topicsWithGrowth.sort((a, b) => b.growth_rate - a.growth_rate);
    
    return topicsWithGrowth.slice(0, limit);
  }
}

export default new TopicService();
