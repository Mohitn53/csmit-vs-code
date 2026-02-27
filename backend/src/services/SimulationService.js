import { CATEGORY_VOLATILITY, SCORE_BOUNDARIES } from '../config/scoringConfig.js';

/**
 * SimulationService
 * Generates simulated daily metrics for topics
 * Phase 1: Uses statistical simulation
 * Phase 2+: Can be replaced with real data ingestion
 */
export class SimulationService {
  
  constructor() {
    this.baseScores = new Map(); // Store base scores for each topic
  }

  /**
   * Initialize base score for a topic
   * @param {string} topicId
   * @param {string} category
   * @returns {Object} - Base scores for all pillars
   */
  initializeBaseScores(topicId, category) {
    // If already initialized, return existing
    if (this.baseScores.has(topicId)) {
      return this.baseScores.get(topicId);
    }

    // Generate initial base scores (slightly randomized per category)
    const categoryConfig = CATEGORY_VOLATILITY[category] || CATEGORY_VOLATILITY['Web & Frameworks'];
    const baseRange = this.getCategoryBaseRange(category);

    const scores = {
      developer: this.randomInRange(baseRange.min, baseRange.max),
      search: this.randomInRange(baseRange.min, baseRange.max),
      jobs: this.randomInRange(baseRange.min, baseRange.max),
      media: this.randomInRange(baseRange.min, baseRange.max)
    };

    this.baseScores.set(topicId, scores);
    return scores;
  }

  /**
   * Generate daily scores for a topic
   * @param {string} topicId
   * @param {string} category
   * @returns {Object} - Generated scores
   */
  generateDailyScores(topicId, category) {
    const baseScores = this.initializeBaseScores(topicId, category);
    const categoryConfig = CATEGORY_VOLATILITY[category] || CATEGORY_VOLATILITY['Web & Frameworks'];

    const [minVariance, maxVariance] = categoryConfig.varianceRange;

    // Apply variance to each pillar
    const developer_score = this.applyVariance(
      baseScores.developer,
      minVariance,
      maxVariance,
      categoryConfig.trendBias
    );

    const search_score = this.applyVariance(
      baseScores.search,
      minVariance,
      maxVariance,
      categoryConfig.trendBias
    );

    const job_score = this.applyVariance(
      baseScores.jobs,
      minVariance,
      maxVariance,
      categoryConfig.trendBias
    );

    const media_score = this.applyVariance(
      baseScores.media,
      minVariance,
      maxVariance,
      categoryConfig.trendBias
    );

    // Update base scores for next generation (create drift)
    this.baseScores.set(topicId, {
      developer: developer_score,
      search: search_score,
      jobs: job_score,
      media: media_score
    });

    return {
      developer_score: this.clampScore(developer_score),
      search_score: this.clampScore(search_score),
      job_score: this.clampScore(job_score),
      media_score: this.clampScore(media_score)
    };
  }

  /**
   * Apply variance to a base score
   * @param {number} baseScore
   * @param {number} minVariance
   * @param {number} maxVariance
   * @param {string} trendBias
   * @returns {number}
   */
  applyVariance(baseScore, minVariance, maxVariance, trendBias) {
    const variance = this.randomInRange(minVariance, maxVariance);
    const direction = this.getDirection(trendBias);
    
    return baseScore + (variance * direction);
  }

  /**
   * Get direction multiplier based on trend bias
   * @param {string} trendBias
   * @returns {number} - -1, 0, or 1
   */
  getDirection(trendBias) {
    switch (trendBias) {
      case 'upward':
        return Math.random() < 0.7 ? 1 : -1; // 70% chance upward
      case 'downward':
        return Math.random() < 0.7 ? -1 : 1; // 70% chance downward
      case 'stable':
        return Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? 1 : -1); // 60% stable
      case 'volatile':
        return Math.random() < 0.5 ? 1 : -1; // 50/50
      default: // neutral
        const rand = Math.random();
        if (rand < 0.33) return -1;
        if (rand < 0.67) return 0;
        return 1;
    }
  }

  /**
   * Get base score range for category
   * @param {string} category
   * @returns {Object} - min and max
   */
  getCategoryBaseRange(category) {
    const ranges = {
      'AI & ML': { min: 70, max: 100 },
      'Cloud & DevOps': { min: 60, max: 90 },
      'Edge & Hardware': { min: 50, max: 80 },
      'Security': { min: 65, max: 95 },
      'Mobility': { min: 55, max: 85 },
      'Mobile': { min: 60, max: 90 },
      'Web & Frameworks': { min: 65, max: 95 },
      'Data & Analytics': { min: 60, max: 90 },
      'Gaming': { min: 50, max: 80 },
      'Blockchain': { min: 40, max: 100 }
    };

    return ranges[category] || { min: 50, max: 90 };
  }

  /**
   * Generate random number in range
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Clamp score to valid boundaries
   * @param {number} score
   * @returns {number}
   */
  clampScore(score) {
    const clamped = Math.max(
      SCORE_BOUNDARIES.min,
      Math.min(SCORE_BOUNDARIES.max, score)
    );
    return Math.round(clamped * 100) / 100;
  }

  /**
   * Reset base scores (for testing)
   */
  reset() {
    this.baseScores.clear();
  }
}

export default new SimulationService();
