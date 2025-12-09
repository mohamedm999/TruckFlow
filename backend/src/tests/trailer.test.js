
import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../models/Trailer.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

let createTrailer, Trailer;

describe('Trailer Controller', () => {
    let req, res;

    beforeAll(async () => {
        const trailerController = await import('../controllers/trailerController.js');
        createTrailer = trailerController.createTrailer;
        
        const trailerModule = await import('../models/Trailer.js');
        Trailer = trailerModule.default;
    });

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('createTrailer', () => {
        it('should create a trailer successfully', async () => {
            req.body = {
                registrationNumber: 'TR-1234',
                type: 'Flatbed',
                capacity: 20000,
                status: 'Active'
            };

            Trailer.findOne.mockResolvedValue(null);
            Trailer.create.mockResolvedValue({ ...req.body, _id: 'trailer_id' });

            await createTrailer(req, res);

            expect(Trailer.findOne).toHaveBeenCalledWith({ registrationNumber: 'TR-1234' });
            expect(Trailer.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should throw error if trailer already exists', async () => {
             req.body = { registrationNumber: 'TR-EXIST' };
             Trailer.findOne.mockResolvedValue({ _id: 'existing_id' });

             await expect(createTrailer(req, res)).rejects.toThrow('Trailer already exists');
        });
    });
});
