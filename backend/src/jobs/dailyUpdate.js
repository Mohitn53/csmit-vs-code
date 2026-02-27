import cron from 'node-cron';
import TopicRepository from '../repositories/TopicRepository.js';
import TopicService from '../services/TopicService.js';

/**
 * Daily Update Job
 * Generates daily metrics and forecasts for all topics
 * Runs at midnight every day (0 0 * * *)
 */

let isRunning = false;

export const runDailyUpdate = async () => {
  if (isRunning) {
    console.log('Daily update already in progress, skipping...');
    return;
  }

  try {
    isRunning = true;
    const startTime = Date.now();
    
    console.log('='.repeat(50));
    console.log('Starting daily update job...', new Date().toISOString());
    console.log('='.repeat(50));

    // Get all topics
    const topics = await TopicRepository.findAll({ limit: null });
    console.log(`Found ${topics.length} topics to process`);

    let successCount = 0;
    let errorCount = 0;

    // Process each topic
    for (const topic of topics) {
      try {
        // Generate daily metric
        const metric = await TopicService.generateDailyMetric(
          topic.id,
          topic.category
        );
        
        // Generate forecast
        const forecast = await TopicService.generateForecast(topic.id);
        
        successCount++;
        console.log(`✓ Processed: ${topic.primary_name} (Score: ${metric.weighted_score.toFixed(2)})`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to process ${topic.primary_name}:`, error.message);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('='.repeat(50));
    console.log('Daily update completed!');
    console.log(`Success: ${successCount} | Errors: ${errorCount}`);
    console.log(`Duration: ${duration}s`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Fatal error in daily update job:', error);
  } finally {
    isRunning = false;
  }
};

/**
 * Schedule daily update job
 * Runs at midnight (00:00) every day
 */
export const scheduleDailyUpdate = () => {
  // Schedule for midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Triggered scheduled daily update');
    await runDailyUpdate();
  });

  console.log('✓ Daily update job scheduled (runs at midnight)');
};

/**
 * Run update immediately (for testing/manual trigger)
 */
export const triggerManualUpdate = async () => {
  console.log('Manual update triggered');
  await runDailyUpdate();
};

export default {
  scheduleDailyUpdate,
  runDailyUpdate,
  triggerManualUpdate
};
