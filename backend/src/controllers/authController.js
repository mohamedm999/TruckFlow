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

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(401, 'Account is deactivated');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const accessToken = generateAccessToken(user);
  const { token: refreshToken, expiresAt } = generateRefreshToken();
 
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt
  });

  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

  res.json({
    success: true,
    data: {
      user: formatUserResponse(user),
      accessToken
    }
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }

  const storedToken = await RefreshToken.findValidToken(refreshToken);
  
  if (!storedToken || !storedToken.user) {

    res.clearCookie('refreshToken', getClearCookieOptions());
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  if (!storedToken.user.isActive) {
    await RefreshToken.revokeAllUserTokens(storedToken.user._id);
    res.clearCookie('refreshToken', getClearCookieOptions());
    throw new ApiError(401, 'Account is deactivated');
  }

  const accessToken = generateAccessToken(storedToken.user);

  res.json({
    success: true,
    data: { accessToken }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
 
  res.clearCookie('refreshToken', getClearCookieOptions());

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await RefreshToken.revokeAllUserTokens(req.user._id);

  res.clearCookie('refreshToken', getClearCookieOptions());

  res.json({
    success: true,
    message: 'Logged out from all devices'
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.json({
    success: true,
    data: formatUserResponse(user)
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  
  await RefreshToken.revokeAllUserTokens(user._id);

  const accessToken = generateAccessToken(user);
  const { token: refreshToken, expiresAt } = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt
  });

  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

  res.json({
    success: true,
    message: 'Password updated successfully',
    data: { accessToken }
  });
});
