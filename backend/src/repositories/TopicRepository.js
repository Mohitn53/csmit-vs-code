import supabase from '../config/supabaseClient.js';
import Topic from '../domain/Topic.js';

/**
 * TopicRepository
 * Handles all database operations for topics
 */
export class TopicRepository {
  
  /**
   * Get all topics with optional pagination
   * @param {Object} options - Query options
   * @returns {Promise<Array<Topic>>}
   */
  async findAll(options = {}) {
    const { limit = 100, offset = 0, category = null } = options;
    
    let query = supabase
      .from('topics')
      .select('*')
      .order('primary_name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch topics: ${error.message}`);
    }

    return data.map(row => Topic.fromDB(row));
  }

  /**
   * Get topic by ID
   * @param {string} id - Topic UUID
   * @returns {Promise<Topic|null>}
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch topic: ${error.message}`);
    }

    return Topic.fromDB(data);
  }

  /**
   * Get topic by primary name
   * @param {string} primaryName
   * @returns {Promise<Topic|null>}
   */
  async findByName(primaryName) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('primary_name', primaryName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch topic: ${error.message}`);
    }

    return Topic.fromDB(data);
  }

  /**
   * Get all topics by category
   * @param {string} category
   * @returns {Promise<Array<Topic>>}
   */
  async findByCategory(category) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('category', category)
      .order('primary_name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch topics by category: ${error.message}`);
    }

    return data.map(row => Topic.fromDB(row));
  }

  /**
   * Create a new topic
   * @param {Topic} topic
   * @returns {Promise<Topic>}
   */
  async create(topic) {
    const { data, error } = await supabase
      .from('topics')
      .insert({
        primary_name: topic.primary_name,
        category: topic.category,
        synonyms: topic.synonyms,
        job_roles: topic.job_roles
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create topic: ${error.message}`);
    }

    return Topic.fromDB(data);
  }

  /**
   * Create multiple topics in bulk
   * @param {Array<Topic>} topics
   * @returns {Promise<Array<Topic>>}
   */
  async createBulk(topics) {
    const topicsData = topics.map(topic => ({
      primary_name: topic.primary_name,
      category: topic.category,
      synonyms: topic.synonyms,
      job_roles: topic.job_roles
    }));

    const { data, error } = await supabase
      .from('topics')
      .insert(topicsData)
      .select();

    if (error) {
      throw new Error(`Failed to create topics: ${error.message}`);
    }

    return data.map(row => Topic.fromDB(row));
  }

  /**
   * Update a topic
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<Topic>}
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('topics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update topic: ${error.message}`);
    }

    return Topic.fromDB(data);
  }

  /**
   * Delete a topic
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete topic: ${error.message}`);
    }

    return true;
  }

  /**
   * Get all unique categories
   * @returns {Promise<Array<string>>}
   */
  async getCategories() {
    const { data, error } = await supabase
      .from('topics')
      .select('category')
      .order('category', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    // Extract unique categories
    const categories = [...new Set(data.map(row => row.category))];
    return categories;
  }
}

export default new TopicRepository();
