import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/FuelRecord.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: { findById: jest.fn() },
}));

describe('Fuel Controller', () => {
    let createFuelRecord, FuelRecord, Truck, req, res;

    beforeAll(async () => {
        const fuelController = await import('../controllers/fuelController.js');
        createFuelRecord = fuelController.createFuelRecord;
        FuelRecord = (await import('../models/FuelRecord.js')).default;
        Truck = (await import('../models/Truck.js')).default;
    });

    beforeEach(() => {
        req = { body: {}, user: { _id: 'driver_id' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    it('should create fuel record and update truck odometer', async () => {
        req.body = { truck: 'truck_id', odometer: 1200, liters: 100 };
        const truck = { currentOdometer: 1000, save: jest.fn() };
        const mockRecord = { _id: 'record_id', populate: jest.fn().mockReturnThis() };
        
        Truck.findById.mockResolvedValue(truck);
        FuelRecord.create.mockResolvedValue(mockRecord);

        await createFuelRecord(req, res);

        expect(truck.currentOdometer).toBe(1200);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should throw error if truck not found', async () => {
        req.body = { truck: 'invalid_id' };
        Truck.findById.mockResolvedValue(null);

        await expect(createFuelRecord(req, res)).rejects.toThrow('Truck not found');
    });
});

