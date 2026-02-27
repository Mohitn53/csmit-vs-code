/**
 * ForecastService
 * Generates forecasts based on historical metrics
 * Phase 1: Simple statistical forecasting
 * Phase 2+: Can integrate with Python ML models
 */
export class ForecastService {
  
  /**
   * Generate forecast for a topic based on historical metrics
   * @param {Array<Object>} metrics - Historical metrics (ordered newest first)
   * @returns {Object} - Forecast data
   */
  generateForecast(metrics) {
    if (!metrics || metrics.length === 0) {
      return this.getDefaultForecast();
    }

    const weightedScores = metrics.map(m => m.weighted_score);
    
    // Calculate moving averages
    const ma7 = this.calculateMovingAverage(weightedScores, 7);
    const ma30 = this.calculateMovingAverage(weightedScores, 30);
    
    // Calculate trend
    const trend = this.calculateTrend(weightedScores);
    
    // Calculate volatility
    const volatility = this.calculateVolatility(weightedScores);
    
    // Generate predictions
    const currentScore = weightedScores[0];
    const predicted_7d = this.projectScore(currentScore, trend, 7);
    const predicted_30d = this.projectScore(currentScore, trend, 30);
    
    // Calculate confidence based on volatility and data points
    const confidence = this.calculateConfidence(metrics.length, volatility);
    
    // Determine risk level
    const risk = this.determineRisk(trend, volatility);
    
    return {
      predicted_7d: Math.round(predicted_7d * 100) / 100,
      predicted_30d: Math.round(predicted_30d * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      risk
    };
  }

  /**
   * Calculate simple moving average
   * @param {Array<number>} values
   * @param {number} period
   * @returns {number}
   */
  calculateMovingAverage(values, period) {
    if (values.length === 0) return 0;
    
    const subset = values.slice(0, Math.min(period, values.length));
    const sum = subset.reduce((acc, val) => acc + val, 0);
    
    return sum / subset.length;
  }

  /**
   * Calculate trend (slope of linear regression)
   * @param {Array<number>} values - Most recent first
   * @returns {number} - Trend slope
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const n = Math.min(values.length, 30); // Use last 30 days max
    const subset = values.slice(0, n).reverse(); // Oldest first for calculation
    
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += subset[i];
      sumXY += i * subset[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    return slope;
  }

  /**
   * Calculate volatility (standard deviation)
   * @param {Array<number>} values
   * @returns {number}
   */
  calculateVolatility(values) {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Project score into the future
   * @param {number} currentScore
   * @param {number} trend - Daily trend slope
   * @param {number} days - Days to project
   * @returns {number}
   */
  projectScore(currentScore, trend, days) {
    const projection = currentScore + (trend * days);
    
    // Clamp to reasonable bounds
    return Math.max(1, Math.min(120, projection));
  }

  /**
   * Calculate confidence level
   * @param {number} dataPoints - Number of historical data points
   * @param {number} volatility
   * @returns {number} - Confidence (0-100)
   */
  calculateConfidence(dataPoints, volatility) {
    // More data points = higher confidence
    let confidence = Math.min(dataPoints * 3, 70); // Max 70 from data points
    
    // Lower volatility = higher confidence
    const volatilityPenalty = Math.min(volatility, 30);
    confidence += (30 - volatilityPenalty);
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Determine risk level
   * @param {number} trend
   * @param {number} volatility
   * @returns {string} - 'low', 'medium', or 'high'
   */
  determineRisk(trend, volatility) {
    // High volatility = higher risk
    if (volatility > 15) return 'high';
    
    // Strong downward trend = high risk
    if (trend < -0.5) return 'high';
    
    // Moderate volatility or slight downward trend
    if (volatility > 8 || trend < -0.2) return 'medium';
    
    // Stable or growing
    return 'low';
  }

  /**
   * Get default forecast when no data available
   * @returns {Object}
   */
  getDefaultForecast() {
    return {
      predicted_7d: 50,
      predicted_30d: 50,
      confidence: 20,
      risk: 'high'
    };
  }
}

export default new ForecastService();
