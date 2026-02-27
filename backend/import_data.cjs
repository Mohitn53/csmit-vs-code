const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  try {
    const dataPath = 'C:\\Users\\Mohit\\AppData\\Local\\Packages\\5319275A.WhatsAppDesktop_cv1g1gvanyjgm\\LocalState\\sessions\\F565B51E4C7A21320620B34F1B894CF2CC6BC580\\transfers\\2026-09\\tech_metrics_final.json';
    
    console.log('Reading JSON file...');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const jsonData = JSON.parse(rawData);
    
    console.log('Processing data...');
    const records = [];
    
    for (const [topicName, metrics] of Object.entries(jsonData)) {
      for (const metric of metrics) {
        records.push({
          topic_name: topicName,
          iso_week: metric.iso_week,
          jobs: metric.jobs,
          github: metric.github,
          trends: metric.trends,
          news: metric.news
        });
      }
    }
    
    console.log(`Found ${records.length} records to insert.`);
    
    // Insert in batches of 1000 to avoid payload size limits
    const batchSize = 1000;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(records.length/batchSize)}...`);
      
      const { error } = await supabase
        .from('tech_metrics')
        .upsert(batch, { onConflict: 'topic_name,iso_week' });
        
      if (error) {
        console.error('Error inserting batch:', error);
      }
    }
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during import:', error);
  }
}

importData();
