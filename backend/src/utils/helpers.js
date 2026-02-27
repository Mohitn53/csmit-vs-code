/**
 * Utility functions
 */

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function
 * @returns {Function}
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Format date to ISO string
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  return date.toISOString();
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random ID (for testing)
 * @returns {string}
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export default {
  asyncHandler,
  formatDate,
  sleep,
  generateId
};
