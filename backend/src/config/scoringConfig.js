// Scoring weights for weighted score calculation
export const SCORING_WEIGHTS = {
  developer: 0.3,
  search: 0.25,
  jobs: 0.3,
  media: 0.15
};

// Score boundaries
export const SCORE_BOUNDARIES = {
  min: 1,
  max: 120
};

// Category-based volatility settings
export const CATEGORY_VOLATILITY = {
  'AI & ML': {
    volatility: 'high',
    varianceRange: [10, 25],
    trendBias: 'upward',
    cyclical: false
  },
  'Cloud & DevOps': {
    volatility: 'medium',
    varianceRange: [5, 15],
    trendBias: 'stable',
    cyclical: false
  },
  'Edge & Hardware': {
    volatility: 'medium',
    varianceRange: [5, 12],
    trendBias: 'stable',
    cyclical: false
  },
  'Security': {
    volatility: 'stable',
    varianceRange: [3, 8],
    trendBias: 'stable',
    cyclical: false
  },
  'Mobility': {
    volatility: 'medium-high',
    varianceRange: [7, 18],
    trendBias: 'neutral',
    cyclical: false
  },
  'Mobile': {
    volatility: 'medium',
    varianceRange: [5, 15],
    trendBias: 'neutral',
    cyclical: true,
    cycleLength: 90 // days
  },
  'Web & Frameworks': {
    volatility: 'high',
    varianceRange: [8, 20],
    trendBias: 'neutral',
    cyclical: false
  },
  'Data & Analytics': {
    volatility: 'medium',
    varianceRange: [4, 12],
    trendBias: 'stable',
    cyclical: false
  },
  'Gaming': {
    volatility: 'medium',
    varianceRange: [6, 14],
    trendBias: 'neutral',
    cyclical: true,
    cycleLength: 180
  },
  'Blockchain': {
    volatility: 'very-high',
    varianceRange: [15, 35],
    trendBias: 'volatile',
    cyclical: true,
    cycleLength: 120
  }
};

export default {
  SCORING_WEIGHTS,
  SCORE_BOUNDARIES,
  CATEGORY_VOLATILITY
};
