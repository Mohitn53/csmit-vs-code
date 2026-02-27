/**
 * DailyMetric Domain Model
 * Represents daily simulated metrics for a topic
 */
export class DailyMetric {
  constructor({
    id = null,
    topic_id,
    developer_score,
    search_score,
    job_score,
    media_score,
    weighted_score,
    created_at = null
  }) {
    this.id = id;
    this.topic_id = topic_id;
    this.developer_score = developer_score;
    this.search_score = search_score;
    this.job_score = job_score;
    this.media_score = media_score;
    this.weighted_score = weighted_score;
    this.created_at = created_at;
  }

  // Validate metric data
  validate() {
    if (!this.topic_id) {
      throw new Error('Metric must have a topic_id');
    }
    
    const scores = [
      this.developer_score,
      this.search_score,
      this.job_score,
      this.media_score
    ];

    for (const score of scores) {
      if (typeof score !== 'number' || score < 0 || score > 120) {
        throw new Error('All scores must be numbers between 0 and 120');
      }
    }

    if (typeof this.weighted_score !== 'number') {
      throw new Error('Weighted score must be a number');
    }

    return true;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      topic_id: this.topic_id,
      developer_score: this.developer_score,
      search_score: this.search_score,
      job_score: this.job_score,
      media_score: this.media_score,
      weighted_score: this.weighted_score,
      created_at: this.created_at
    };
  }

  // Create from database row
  static fromDB(row) {
    return new DailyMetric({
      id: row.id,
      topic_id: row.topic_id,
      developer_score: parseFloat(row.developer_score),
      search_score: parseFloat(row.search_score),
      job_score: parseFloat(row.job_score),
      media_score: parseFloat(row.media_score),
      weighted_score: parseFloat(row.weighted_score),
      created_at: row.created_at
    });
  }
}

export default DailyMetric;
