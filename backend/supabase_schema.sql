-- Create the tech_metrics table
CREATE TABLE IF NOT EXISTS tech_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_name VARCHAR(255) NOT NULL,
  iso_week VARCHAR(10) NOT NULL,
  jobs INTEGER NOT NULL,
  github INTEGER NOT NULL,
  trends FLOAT NOT NULL,
  news INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_name, iso_week)
);

-- Create an index for faster querying by topic
CREATE INDEX IF NOT EXISTS idx_tech_metrics_topic ON tech_metrics(topic_name);
CREATE INDEX IF NOT EXISTS idx_tech_metrics_week ON tech_metrics(iso_week);

-- Enable Row Level Security (RLS)
ALTER TABLE tech_metrics ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the metrics
CREATE POLICY "Allow public read access" ON tech_metrics
  FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert/update (optional, adjust as needed)
CREATE POLICY "Allow authenticated insert" ON tech_metrics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
