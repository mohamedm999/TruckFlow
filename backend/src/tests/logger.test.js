import { jest } from '@jest/globals';

describe('Logger', () => {
    let logger;

    beforeAll(async () => {
        const loggerModule = await import('../config/logger.js');
        logger = loggerModule.default;
    });

    it('should have info method', () => {
        expect(typeof logger.info).toBe('function');
    });

    it('should have error method', () => {
        expect(typeof logger.error).toBe('function');
    });

    it('should have warn method', () => {
        expect(typeof logger.warn).toBe('function');
    });

    it('should have debug method', () => {
        expect(typeof logger.debug).toBe('function');
    });

    it('should log info messages', () => {
        const spy = jest.spyOn(logger, 'info');
        logger.info('Test info message');
        expect(spy).toHaveBeenCalledWith('Test info message');
        spy.mockRestore();
    });

    it('should log error messages', () => {
        const spy = jest.spyOn(logger, 'error');
        logger.error('Test error message');
        expect(spy).toHaveBeenCalledWith('Test error message');
        spy.mockRestore();
    });
});
