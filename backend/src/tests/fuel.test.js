
import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../models/FuelRecord.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

let createFuelRecord, FuelRecord, Truck, truckDoc;

describe('Fuel Controller', () => {
    let req, res;

    beforeAll(async () => {
        const fuelController = await import('../controllers/fuelController.js');
        createFuelRecord = fuelController.createFuelRecord;
        
        const fuelRecordModule = await import('../models/FuelRecord.js');
        FuelRecord = fuelRecordModule.default;

        const truckModule = await import('../models/Truck.js');
        Truck = truckModule.default;
    });

    beforeEach(() => {
        req = {
            body: {},
            user: { _id: 'driver_id' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();

        truckDoc = {
            _id: 'truck_id',
            currentOdometer: 1000,
            save: jest.fn(),
        };
    });

    describe('createFuelRecord', () => {
        it('should create a fuel record and update truck odometer if higher', async () => {
            req.body = {
                truck: 'truck_id',
                date: new Date(),
                odometer: 1200,
                liters: 100,
                pricePerLiter: 1.5,
                fullTank: true
            };

            Truck.findById.mockResolvedValue(truckDoc);
            FuelRecord.create.mockResolvedValue({ ...req.body, _id: 'record_id' });

            await createFuelRecord(req, res);

            expect(Truck.findById).toHaveBeenCalledWith('truck_id');
            expect(FuelRecord.create).toHaveBeenCalled();
            expect(truckDoc.currentOdometer).toBe(1200);
            expect(truckDoc.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should create a fuel record but NOT update truck odometer if lower', async () => {
             req.body = {
                truck: 'truck_id',
                date: new Date(),
                odometer: 900, // Lower than current 1000
                liters: 50,
                pricePerLiter: 1.5,
                fullTank: true
            };

            Truck.findById.mockResolvedValue(truckDoc);
            FuelRecord.create.mockResolvedValue({ ...req.body, _id: 'record_id' });

            await createFuelRecord(req, res);

            expect(Truck.findById).toHaveBeenCalledWith('truck_id');
            expect(FuelRecord.create).toHaveBeenCalled();
            expect(truckDoc.currentOdometer).toBe(1000); // Should remain 1000
            expect(truckDoc.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should throw error if truck not found', async () => {
             req.body = { truck: 'invalid_id' };
             Truck.findById.mockResolvedValue(null);

             await expect(createFuelRecord(req, res)).rejects.toThrow('Truck not found');
        });
    });
});
