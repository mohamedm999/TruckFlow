// Utility functions for TruckFlow backend
// Add helper functions here as needed

/**
 * Format date to ISO string
 * @param {Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

/**
 * Calculate days between two dates
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {number}
 */
export const daysBetween = (startDate, endDate) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((endDate - startDate) / oneDay));
};
