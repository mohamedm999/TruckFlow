import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Trailer.js', () => ({
  default: { findOne: jest.fn(), create: jest.fn() },
}));

describe('Trailer Controller', () => {
    let createTrailer, Trailer, req, res;

    beforeAll(async () => {
        const trailerController = await import('../controllers/trailerController.js');
        createTrailer = trailerController.createTrailer;
        Trailer = (await import('../models/Trailer.js')).default;
    });

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    it('should create a trailer successfully', async () => {
        req.body = { registrationNumber: 'TR-1234', type: 'Flatbed' };

        Trailer.findOne.mockResolvedValue(null);
        Trailer.create.mockResolvedValue({ _id: 'trailer_id' });

        await createTrailer(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should throw error if trailer already exists', async () => {
         req.body = { registrationNumber: 'TR-EXIST' };
         Trailer.findOne.mockResolvedValue({ _id: 'existing_id' });

         await expect(createTrailer(req, res)).rejects.toThrow('Trailer already exists');
    });
});

