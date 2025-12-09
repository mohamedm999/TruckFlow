
import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../models/Tire.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

let createTire, Tire;

describe('Tire Controller', () => {
    let req, res;

    beforeAll(async () => {
        const tireController = await import('../controllers/tireController.js');
        createTire = tireController.createTire;
        
        const tireModule = await import('../models/Tire.js');
        Tire = tireModule.default;
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

    describe('createTire', () => {
        it('should create a tire successfully', async () => {
            req.body = {
                serialNumber: 'SN-TIRE-001',
                brand: 'Michelin',
                size: '295/80R22.5',
                status: 'Active'
            };

            Tire.findOne.mockResolvedValue(null);
            Tire.create.mockResolvedValue({ ...req.body, _id: 'tire_id' });

            await createTire(req, res);

            expect(Tire.findOne).toHaveBeenCalledWith({ serialNumber: 'SN-TIRE-001' });
            expect(Tire.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should throw error if tire already exists', async () => {
             req.body = { serialNumber: 'SN-EXIST' };
             Tire.findOne.mockResolvedValue({ _id: 'existing_id' });

             await expect(createTire(req, res)).rejects.toThrow('Tire already exists');
        });
    });
});
