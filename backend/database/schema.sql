-- Tech Intelligence Forecasting Platform
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: topics
-- ============================================
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  synonyms JSONB DEFAULT '[]'::jsonb,
  job_roles JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category);
CREATE INDEX IF NOT EXISTS idx_topics_primary_name ON topics(primary_name);

-- ============================================
-- TABLE: daily_metrics
-- ============================================
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  developer_score NUMERIC(5,2) NOT NULL CHECK (developer_score >= 0 AND developer_score <= 120),
  search_score NUMERIC(5,2) NOT NULL CHECK (search_score >= 0 AND search_score <= 120),
  job_score NUMERIC(5,2) NOT NULL CHECK (job_score >= 0 AND job_score <= 120),
  media_score NUMERIC(5,2) NOT NULL CHECK (media_score >= 0 AND media_score <= 120),
  weighted_score NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_metrics_topic_id ON daily_metrics(topic_id);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_created_at ON daily_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_topic_date ON daily_metrics(topic_id, created_at DESC);

-- ============================================
-- TABLE: forecasts
-- ============================================
CREATE TABLE IF NOT EXISTS forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  predicted_7d NUMERIC(6,2) NOT NULL,
  predicted_30d NUMERIC(6,2) NOT NULL,
  confidence NUMERIC(4,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  risk TEXT NOT NULL CHECK (risk IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching latest forecasts
CREATE INDEX IF NOT EXISTS idx_forecasts_topic_id ON forecasts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_created_at ON forecasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forecasts_topic_latest ON forecasts(topic_id, created_at DESC);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE topics IS 'Technology topics being tracked';
COMMENT ON TABLE daily_metrics IS 'Daily simulated metrics for each topic';
COMMENT ON TABLE forecasts IS 'Forecasted trends for topics';

COMMENT ON COLUMN topics.synonyms IS 'JSON array of alternative names for the topic';
COMMENT ON COLUMN topics.job_roles IS 'JSON array of related job roles from Adzuna';
COMMENT ON COLUMN daily_metrics.weighted_score IS 'Calculated weighted score from all pillars';
COMMENT ON COLUMN forecasts.confidence IS 'Confidence percentage (0-100)';
