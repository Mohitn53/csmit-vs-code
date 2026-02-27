/**
 * Forecast Domain Model
 * Represents forecasted trends for a topic
 */
export class Forecast {
  constructor({
    id = null,
    topic_id,
    predicted_7d,
    predicted_30d,
    confidence,
    risk,
    created_at = null
  }) {
    this.id = id;
    this.topic_id = topic_id;
    this.predicted_7d = predicted_7d;
    this.predicted_30d = predicted_30d;
    this.confidence = confidence;
    this.risk = risk;
    this.created_at = created_at;
  }

  // Validate forecast data
  validate() {
    if (!this.topic_id) {
      throw new Error('Forecast must have a topic_id');
    }

    if (typeof this.predicted_7d !== 'number') {
      throw new Error('7-day prediction must be a number');
    }

    if (typeof this.predicted_30d !== 'number') {
      throw new Error('30-day prediction must be a number');
    }

    if (typeof this.confidence !== 'number' || this.confidence < 0 || this.confidence > 100) {
      throw new Error('Confidence must be a number between 0 and 100');
    }

    const validRiskLevels = ['low', 'medium', 'high'];
    if (!validRiskLevels.includes(this.risk)) {
      throw new Error('Risk must be one of: low, medium, high');
    }

    return true;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      topic_id: this.topic_id,
      predicted_7d: this.predicted_7d,
      predicted_30d: this.predicted_30d,
      confidence: this.confidence,
      risk: this.risk,
      created_at: this.created_at
    };
  }

  // Create from database row
  static fromDB(row) {
    return new Forecast({
      id: row.id,
      topic_id: row.topic_id,
      predicted_7d: parseFloat(row.predicted_7d),
      predicted_30d: parseFloat(row.predicted_30d),
      confidence: parseFloat(row.confidence),
      risk: row.risk,
      created_at: row.created_at
    });
  }
}

export default Forecast;
