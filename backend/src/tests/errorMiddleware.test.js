import { jest } from '@jest/globals';

jest.unstable_mockModule('../config/logger.js', () => ({
  default: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

let errorHandler, notFound, ApiError, logger;

describe('Error Middleware', () => {
    let req, res, next;

    beforeAll(async () => {
        const errorMiddleware = await import('../middleware/errorMiddleware.js');
        errorHandler = errorMiddleware.errorHandler;
        notFound = errorMiddleware.notFound;
        ApiError = errorMiddleware.ApiError;
        
        const loggerModule = await import('../config/logger.js');
        logger = loggerModule.default;
    });

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('ApiError', () => {
        it('should create an ApiError with status and message', () => {
            const error = new ApiError(404, 'Not found');
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Not found');
            expect(error instanceof Error).toBe(true);
        });
    });

    describe('errorHandler', () => {
        it('should handle ApiError', () => {
            const error = new ApiError(404, 'Resource not found');
            errorHandler(error, req, res, next);

            expect(logger.warn).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Resource not found',
            });
        });

        it('should handle validation errors', () => {
            const error = new Error('Validation failed');
            error.name = 'ValidationError';
            error.errors = {
                field1: { message: 'Field1 is required' },
                field2: { message: 'Field2 is invalid' },
            };

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Field1 is required, Field2 is invalid',
            });
        });

        it('should handle CastError', () => {
            const error = new Error('Cast failed');
            error.name = 'CastError';

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Cast failed',
            });
        });

        it('should handle duplicate key error (code 11000)', () => {
            const error = new Error('Duplicate key');
            error.code = 11000;
            error.keyValue = { email: 'test@test.com' };

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Duplicate value for field: email',
            });
        });

        it('should handle JWT errors', () => {
            const error = new Error('JWT invalid');
            error.name = 'JsonWebTokenError';

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid token',
            });
        });

        it('should handle JWT expired errors', () => {
            const error = new Error('JWT expired');
            error.name = 'TokenExpiredError';

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Token expired',
            });
        });

        it('should handle generic errors', () => {
            const error = new Error('Something went wrong');

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Something went wrong',
            });
        });

        it('should use default message for generic errors without message', () => {
            const error = new Error();

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal Server Error',
            });
        });

        it('should handle CastError with ObjectId kind', () => {
            const error = new Error('Cast failed');
            error.name = 'CastError';
            error.kind = 'ObjectId';

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Resource not found',
            });
        });
    });

    describe('notFound', () => {
        it('should create 404 error and call next', () => {
            req.originalUrl = '/api/nonexistent';
            notFound(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ApiError));
            const error = next.mock.calls[0][0];
            expect(error.statusCode).toBe(404);
            expect(error.message).toContain('/api/nonexistent');
        });
    });
});

