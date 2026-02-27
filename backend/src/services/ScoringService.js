import { SCORING_WEIGHTS } from '../config/scoringConfig.js';

/**
 * ScoringService
 * Calculates weighted scores from pillar metrics
 */
export class ScoringService {
  
  /**
   * Calculate weighted score from individual pillar scores
   * @param {Object} scores - Individual pillar scores
   * @returns {number} - Weighted score
   */
  calculateWeightedScore(scores) {
    const {
      developer_score,
      search_score,
      job_score,
      media_score
    } = scores;

    const weightedScore =
      (developer_score * SCORING_WEIGHTS.developer) +
      (search_score * SCORING_WEIGHTS.search) +
      (job_score * SCORING_WEIGHTS.jobs) +
      (media_score * SCORING_WEIGHTS.media);

    // Round to 2 decimal places
    return Math.round(weightedScore * 100) / 100;
  }

  /**
   * Calculate percentage change between two scores
   * @param {number} oldScore
   * @param {number} newScore
   * @returns {number} - Percentage change
   */
  calculatePercentageChange(oldScore, newScore) {
    if (oldScore === 0) return 0;
    const change = ((newScore - oldScore) / oldScore) * 100;
    return Math.round(change * 100) / 100;
  }

  /**
   * Determine momentum status based on score
   * @param {number} score
   * @returns {string} - Status: rising, stable, declining
   */
  getMomentumStatus(score) {
    if (score >= 80) return 'rising';
    if (score >= 50) return 'stable';
    return 'declining';
  }

  /**
   * Calculate growth rate from historical data
   * @param {Array<Object>} metrics - Historical metrics
   * @returns {number} - Growth rate
   */
  calculateGrowthRate(metrics) {
    if (metrics.length < 2) return 0;

    const latest = metrics[0].weighted_score;
    const oldest = metrics[metrics.length - 1].weighted_score;

    return this.calculatePercentageChange(oldest, latest);
  }
}

export default new ScoringService();
