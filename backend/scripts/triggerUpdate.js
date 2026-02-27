import dotenv from 'dotenv';
import { runDailyUpdate } from '../src/jobs/dailyUpdate.js';

dotenv.config();

/**
 * Manual trigger script for daily update
 * Run this to generate metrics and forecasts immediately
 */

console.log('Manual Daily Update Trigger');
console.log('This will generate metrics and forecasts for all topics');
console.log('');

runDailyUpdate()
  .then(() => {
    console.log('Update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Update failed:', error);
    process.exit(1);
  });
