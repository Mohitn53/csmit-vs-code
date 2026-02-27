import supabase from '../config/supabaseClient.js';
import Forecast from '../domain/Forecast.js';

/**
 * ForecastRepository
 * Handles all database operations for forecasts
 */
export class ForecastRepository {
  
  /**
   * Create a new forecast
   * @param {Forecast} forecast
   * @returns {Promise<Forecast>}
   */
  async create(forecast) {
    const { data, error } = await supabase
      .from('forecasts')
      .insert({
        topic_id: forecast.topic_id,
        predicted_7d: forecast.predicted_7d,
        predicted_30d: forecast.predicted_30d,
        confidence: forecast.confidence,
        risk: forecast.risk
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create forecast: ${error.message}`);
    }

    return Forecast.fromDB(data);
  }

  /**
   * Create multiple forecasts in bulk
   * @param {Array<Forecast>} forecasts
   * @returns {Promise<Array<Forecast>>}
   */
  async createBulk(forecasts) {
    const forecastsData = forecasts.map(forecast => ({
      topic_id: forecast.topic_id,
      predicted_7d: forecast.predicted_7d,
      predicted_30d: forecast.predicted_30d,
      confidence: forecast.confidence,
      risk: forecast.risk
    }));

    const { data, error } = await supabase
      .from('forecasts')
      .insert(forecastsData)
      .select();

    if (error) {
      throw new Error(`Failed to create forecasts: ${error.message}`);
    }

    return data.map(row => Forecast.fromDB(row));
  }

  /**
   * Get latest forecast for a topic
   * @param {string} topicId
   * @returns {Promise<Forecast|null>}
   */
  async findLatestByTopicId(topicId) {
    const { data, error } = await supabase
      .from('forecasts')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch latest forecast: ${error.message}`);
    }

    return Forecast.fromDB(data);
  }

  /**
   * Get all forecasts for a topic
   * @param {string} topicId
   * @param {Object} options
   * @returns {Promise<Array<Forecast>>}
   */
  async findByTopicId(topicId, options = {}) {
    const { limit = 30, offset = 0 } = options;

    let query = supabase
      .from('forecasts')
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
      throw new Error(`Failed to fetch forecasts: ${error.message}`);
    }

    return data.map(row => Forecast.fromDB(row));
  }

  /**
   * Delete forecasts older than specified days
   * @param {number} days
   * @returns {Promise<boolean>}
   */
  async deleteOlderThan(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { error } = await supabase
      .from('forecasts')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      throw new Error(`Failed to delete old forecasts: ${error.message}`);
    }

    return true;
  }
}

export default new ForecastRepository();
