import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Tire.js', () => ({
  default: { findOne: jest.fn(), create: jest.fn() },
}));

describe('Tire Controller', () => {
    let createTire, Tire, req, res;

    beforeAll(async () => {
        const tireController = await import('../controllers/tireController.js');
        createTire = tireController.createTire;
        Tire = (await import('../models/Tire.js')).default;
    });

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    it('should create a tire successfully', async () => {
        req.body = { serialNumber: 'SN-TIRE-001', brand: 'Michelin' };
        const mockTire = { _id: 'tire_id', populate: jest.fn().mockReturnThis() };

        Tire.findOne.mockResolvedValue(null);
        Tire.create.mockResolvedValue(mockTire);

        await createTire(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should throw error if tire already exists', async () => {
         req.body = { serialNumber: 'SN-EXIST' };
         Tire.findOne.mockResolvedValue({ _id: 'existing_id' });

         await expect(createTire(req, res)).rejects.toThrow('Tire already exists');
    });
});

