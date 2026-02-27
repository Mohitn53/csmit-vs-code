import supabase from '../config/supabaseClient.js';
import DailyMetric from '../domain/DailyMetric.js';

/**
 * DailyMetricRepository
 * Handles all database operations for daily metrics
 */
export class DailyMetricRepository {
  
  /**
   * Create a new daily metric
   * @param {DailyMetric} metric
   * @returns {Promise<DailyMetric>}
   */
  async create(metric) {
    const { data, error } = await supabase
      .from('daily_metrics')
      .insert({
        topic_id: metric.topic_id,
        developer_score: metric.developer_score,
        search_score: metric.search_score,
        job_score: metric.job_score,
        media_score: metric.media_score,
        weighted_score: metric.weighted_score
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create daily metric: ${error.message}`);
    }

    return DailyMetric.fromDB(data);
  }

  /**
   * Create multiple metrics in bulk
   * @param {Array<DailyMetric>} metrics
   * @returns {Promise<Array<DailyMetric>>}
   */
  async createBulk(metrics) {
    const metricsData = metrics.map(metric => ({
      topic_id: metric.topic_id,
      developer_score: metric.developer_score,
      search_score: metric.search_score,
      job_score: metric.job_score,
      media_score: metric.media_score,
      weighted_score: metric.weighted_score
    }));

    const { data, error } = await supabase
      .from('daily_metrics')
      .insert(metricsData)
      .select();

    if (error) {
      throw new Error(`Failed to create metrics: ${error.message}`);
    }

    return data.map(row => DailyMetric.fromDB(row));
  }

  /**
   * Get metrics for a specific topic
   * @param {string} topicId
   * @param {Object} options
   * @returns {Promise<Array<DailyMetric>>}
   */
  async findByTopicId(topicId, options = {}) {
    const { limit = 30, offset = 0 } = options;

    let query = supabase
      .from('daily_metrics')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch metrics: ${error.message}`);
    }

    return data.map(row => DailyMetric.fromDB(row));
  }

  /**
   * Get latest metric for a topic
   * @param {string} topicId
   * @returns {Promise<DailyMetric|null>}
   */
  async findLatestByTopicId(topicId) {
    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch latest metric: ${error.message}`);
    }

    return DailyMetric.fromDB(data);
  }

  /**
   * Get metrics within a date range
   * @param {string} topicId
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array<DailyMetric>>}
   */
  async findByDateRange(topicId, startDate, endDate) {
    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('topic_id', topicId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch metrics by date range: ${error.message}`);
    }

    return data.map(row => DailyMetric.fromDB(row));
  }

  /**
   * Get recent metrics (last N days)
   * @param {string} topicId
   * @param {number} days
   * @returns {Promise<Array<DailyMetric>>}
   */
  async findRecentByDays(topicId, days = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.findByDateRange(topicId, startDate, endDate);
  }

  /**
   * Delete metrics older than specified days
   * @param {number} days
   * @returns {Promise<boolean>}
   */
  async deleteOlderThan(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { error } = await supabase
      .from('daily_metrics')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      throw new Error(`Failed to delete old metrics: ${error.message}`);
    }

    return true;
  }
}

export default new DailyMetricRepository();
