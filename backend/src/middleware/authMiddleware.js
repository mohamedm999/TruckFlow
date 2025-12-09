import User from '../models/User.js';
import { ApiError } from './errorMiddleware.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

/**
 * Protect routes - verify Access Token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    // Verify access token
    const decoded = verifyAccessToken(token);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Not authorized, user not found');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Access token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid access token'));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Not authorized'));
    }
  }
};

/**
 * Authorize by role
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not authorized to access this route`));
    }

    next();
  };
};

/**
 * Admin only middleware
 */
export const adminOnly = authorize('admin');

/**
 * Chauffeur only middleware
 */
export const chauffeurOnly = authorize('chauffeur');
