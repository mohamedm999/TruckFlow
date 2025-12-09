import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate Access Token (short-lived)
 * @param {Object} user - User object with _id and role
 * @returns {string} JWT access token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

/**
 * Generate Refresh Token (long-lived, opaque)
 * @returns {Object} { token, expiresAt }
 */
export const generateRefreshToken = () => {
  const token = crypto.randomBytes(64).toString('hex');
  const days = parseInt(process.env.JWT_REFRESH_EXPIRE_DAYS) || 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  
  return { token, expiresAt };
};

/**
 * Verify Access Token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * Cookie options for refresh token
 */
export const getRefreshTokenCookieOptions = () => {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRE_DAYS) || 7;
  
  return {
    httpOnly: true,                    // Not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
    sameSite: 'strict',                // CSRF protection
    maxAge: days * 24 * 60 * 60 * 1000, // Expiration in ms
    path: '/api/auth'                  // Only sent to auth routes
  };
};

/**
 * Clear refresh token cookie options
 */
export const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth'
});
