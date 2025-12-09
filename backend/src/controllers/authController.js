import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { formatUserResponse } from '../utils/helpers.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenCookieOptions,
  getClearCookieOptions
} from '../utils/tokenUtils.js';

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(401, 'Account is deactivated');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const { token: refreshToken, expiresAt } = generateRefreshToken();

  // Save refresh token to database
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt
  });

  // Set refresh token as HttpOnly cookie
  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

  res.json({
    success: true,
    data: {
      user: formatUserResponse(user),
      accessToken
    }
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (requires valid refresh token cookie)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }

  // Find valid refresh token in DB
  const storedToken = await RefreshToken.findValidToken(refreshToken);
  
  if (!storedToken || !storedToken.user) {
    // Clear invalid cookie
    res.clearCookie('refreshToken', getClearCookieOptions());
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // Check if user is still active
  if (!storedToken.user.isActive) {
    await RefreshToken.revokeAllUserTokens(storedToken.user._id);
    res.clearCookie('refreshToken', getClearCookieOptions());
    throw new ApiError(401, 'Account is deactivated');
  }

  // Generate new access token
  const accessToken = generateAccessToken(storedToken.user);

  res.json({
    success: true,
    data: { accessToken }
  });
});

/**
 * @desc    Logout user (revoke refresh token)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    // Delete refresh token from DB
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  // Clear cookie
  res.clearCookie('refreshToken', getClearCookieOptions());

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Logout from all devices
 * @route   POST /api/auth/logout-all
 * @access  Private
 */
export const logoutAll = asyncHandler(async (req, res) => {
  // Revoke all refresh tokens for this user
  await RefreshToken.revokeAllUserTokens(req.user._id);

  // Clear current cookie
  res.clearCookie('refreshToken', getClearCookieOptions());

  res.json({
    success: true,
    message: 'Logged out from all devices'
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.json({
    success: true,
    data: formatUserResponse(user)
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  // Revoke all existing refresh tokens (force re-login)
  await RefreshToken.revokeAllUserTokens(user._id);

  // Generate new tokens
  const accessToken = generateAccessToken(user);
  const { token: refreshToken, expiresAt } = generateRefreshToken();

  // Save new refresh token
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt
  });

  // Set new refresh token cookie
  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

  res.json({
    success: true,
    message: 'Password updated successfully',
    data: { accessToken }
  });
});
