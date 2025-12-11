
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

let createTrailer, getTrailers, getTrailer, updateTrailer, deleteTrailer, Trailer;

describe('Trailer Controller', () => {
    let req, res;

    beforeAll(async () => {
        const trailerController = await import('../controllers/trailerController.js');
        createTrailer = trailerController.createTrailer;
        getTrailers = trailerController.getTrailers;
        getTrailer = trailerController.getTrailer;
        updateTrailer = trailerController.updateTrailer;
        deleteTrailer = trailerController.deleteTrailer;
        
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

        it('should throw error if trailer creation fails', async () => {
             req.body = {
                registrationNumber: 'TR-1234',
                type: 'Flatbed',
                capacity: 20000,
                status: 'Active'
            };

            Trailer.findOne.mockResolvedValue(null);
            Trailer.create.mockResolvedValue(null);

            await expect(createTrailer(req, res)).rejects.toThrow('Invalid trailer data');
        });
    });

    describe('getTrailers', () => {
        it('should get all trailers', async () => {
            const mockTrailers = [{ _id: 't1' }, { _id: 't2' }];
            Trailer.find.mockResolvedValue(mockTrailers);

            await getTrailers(req, res);

            expect(Trailer.find).toHaveBeenCalledWith({});
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTrailers });
        });
    });

    describe('getTrailer', () => {
        it('should get a single trailer', async () => {
            req.params = { id: 'trailer_id' };
            const mockTrailer = { _id: 'trailer_id' };
            Trailer.findById.mockResolvedValue(mockTrailer);

            await getTrailer(req, res);

            expect(Trailer.findById).toHaveBeenCalledWith('trailer_id');
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTrailer });
        });

        it('should throw error if trailer not found', async () => {
            req.params = { id: 'invalid_id' };
            Trailer.findById.mockResolvedValue(null);

            await expect(getTrailer(req, res)).rejects.toThrow('Trailer not found');
        });
    });

    describe('updateTrailer', () => {
        it('should update a trailer', async () => {
            req.params = { id: 'trailer_id' };
            req.body = { capacity: 25000 };
            const mockTrailer = { _id: 'trailer_id', capacity: 20000, save: jest.fn().mockResolvedValue({ _id: 'trailer_id', capacity: 25000 }) };
            Trailer.findById.mockResolvedValue(mockTrailer);

            await updateTrailer(req, res);

            expect(mockTrailer.capacity).toBe(25000);
            expect(mockTrailer.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should throw error if trailer not found', async () => {
            req.params = { id: 'invalid_id' };
            Trailer.findById.mockResolvedValue(null);

            await expect(updateTrailer(req, res)).rejects.toThrow('Trailer not found');
        });
    });

    describe('deleteTrailer', () => {
        it('should delete a trailer', async () => {
            req.params = { id: 'trailer_id' };
            const mockTrailer = { _id: 'trailer_id', deleteOne: jest.fn().mockResolvedValue({}) };
            Trailer.findById.mockResolvedValue(mockTrailer);

            await deleteTrailer(req, res);

            expect(mockTrailer.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Trailer removed' });
        });

        it('should throw error if trailer not found', async () => {
            req.params = { id: 'invalid_id' };
            Trailer.findById.mockResolvedValue(null);

            await expect(deleteTrailer(req, res)).rejects.toThrow('Trailer not found');
        });
    });
});

