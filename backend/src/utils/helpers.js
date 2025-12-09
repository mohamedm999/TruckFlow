// Utility functions for TruckFlow backend

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

/**
 * Format user object for API response
 * Removes sensitive data and formats consistently
 * @param {Object} user - Mongoose user document
 * @returns {Object} Formatted user object
 */
export const formatUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  role: user.role,
  phone: user.phone,
  licenseNumber: user.licenseNumber,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

/**
 * Format paginated response
 * @param {Array} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Paginated response object
 */
export const formatPaginatedResponse = (data, page, limit, total) => ({
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  }
});
