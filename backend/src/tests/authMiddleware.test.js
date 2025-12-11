

import { jest } from '@jest/globals';

// Mock dependencies using unstable_mockModule for ESM support
jest.unstable_mockModule('../models/User.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../utils/tokenUtils.js', () => ({
  verifyAccessToken: jest.fn(),
}));

// Mock ApiError class
jest.unstable_mockModule('../middleware/errorMiddleware.js', () => ({
  ApiError: class ApiError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'ApiError';
    }
  },
  errorHandler: jest.fn(),
  notFound: jest.fn(),
}));

let protect, authorize, User, verifyAccessToken, ApiError;

describe('Auth Middleware', () => {
  let req, res, next;

  beforeAll(async () => {
    const authMiddleware = await import('../middleware/authMiddleware.js');
    protect = authMiddleware.protect;
    authorize = authMiddleware.authorize;

    const userModule = await import('../models/User.js');
    User = userModule.default;

    const tokenUtils = await import('../utils/tokenUtils.js');
    verifyAccessToken = tokenUtils.verifyAccessToken;

    const errorMiddleware = await import('../middleware/errorMiddleware.js');
    ApiError = errorMiddleware.ApiError;
  });

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should call next with error if no token is provided', async () => {
      await protect(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Not authorized, no token provided');
    });

    it('should call next with error if token verification fails (invalid token)', async () => {
      req.headers.authorization = 'Bearer invalid_token';
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';
      verifyAccessToken.mockImplementation(() => {
        throw error;
      });

      await protect(req, res, next);

      expect(verifyAccessToken).toHaveBeenCalledWith('invalid_token');
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toBe('Invalid access token');
    });

    it('should call next with error if token valid but user not found', async () => {
      req.headers.authorization = 'Bearer valid_token';
      verifyAccessToken.mockReturnValue({ id: 'user_id' });
      
      const mockSelect = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ select: mockSelect });

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('user_id');
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toBe('Not authorized, user not found');
    });

    it('should call next with error if user is deactivated', async () => {
      req.headers.authorization = 'Bearer valid_token';
      verifyAccessToken.mockReturnValue({ id: 'user_id' });

      const mockUser = { _id: 'user_id', isActive: false };
      const mockSelect = jest.fn().mockResolvedValue(mockUser);
      User.findById.mockReturnValue({ select: mockSelect });

      await protect(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toBe('Account is deactivated');
    });

    it('should attach user to req and call next if everything is valid', async () => {
      req.headers.authorization = 'Bearer valid_token';
      verifyAccessToken.mockReturnValue({ id: 'user_id' });

      const mockUser = { _id: 'user_id', isActive: true, role: 'admin' };
      const mockSelect = jest.fn().mockResolvedValue(mockUser);
      User.findById.mockReturnValue({ select: mockSelect });

      await protect(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(); // called with no arguments
    });
    
     it('should call next with error if token is expired', async () => {
      req.headers.authorization = 'Bearer expired_token';
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      verifyAccessToken.mockImplementation(() => {
        throw error;
      });

      await protect(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toBe('Access token expired');
    });

    it('should call next with generic error for unknown errors', async () => {
      req.headers.authorization = 'Bearer valid_token';
      const error = new Error('Unknown error');
      verifyAccessToken.mockImplementation(() => {
        throw error;
      });

      await protect(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toBe('Not authorized');
    });
  });

  describe('authorize middleware', () => {
    it('should call next with error if req.user is missing', () => {
        const middleware = authorize('admin');
        middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
        expect(next.mock.calls[0][0].message).toBe('Not authorized');
    });

    it('should call next with error if user role is not authorized', () => {
        req.user = { role: 'user' };
        const middleware = authorize('admin', 'chauffeur');
        middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
        expect(next.mock.calls[0][0].statusCode).toBe(403);
    });

    it('should call next if user role is authorized', () => {
        req.user = { role: 'admin' };
        const middleware = authorize('admin', 'chauffeur');
        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });
  });
});


