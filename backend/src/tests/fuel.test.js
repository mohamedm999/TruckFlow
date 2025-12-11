
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

let createFuelRecord, getFuelRecords, getFuelRecord, updateFuelRecord, deleteFuelRecord, FuelRecord, Truck, truckDoc;

describe('Fuel Controller', () => {
    let req, res;

    beforeAll(async () => {
        const fuelController = await import('../controllers/fuelController.js');
        createFuelRecord = fuelController.createFuelRecord;
        getFuelRecords = fuelController.getFuelRecords;
        getFuelRecord = fuelController.getFuelRecord;
        updateFuelRecord = fuelController.updateFuelRecord;
        deleteFuelRecord = fuelController.deleteFuelRecord;
        
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

        it('should throw error if fuel record creation fails', async () => {
             req.body = {
                truck: 'truck_id',
                date: new Date(),
                odometer: 1200,
                liters: 100,
                pricePerLiter: 1.5,
                fullTank: true
            };

            Truck.findById.mockResolvedValue(truckDoc);
            FuelRecord.create.mockResolvedValue(null);

            await expect(createFuelRecord(req, res)).rejects.toThrow('Invalid fuel record data');
        });
    });

    describe('getFuelRecords', () => {
        it('should get all fuel records', async () => {
            const mockRecords = [{ _id: 'r1' }, { _id: 'r2' }];
            const mockPopulateChain = {
                populate: jest.fn(function() {
                    if (this.populate.mock.calls.length === 1) {
                        return this;
                    }
                    return { sort: jest.fn().mockResolvedValue(mockRecords) };
                }),
            };
            FuelRecord.find.mockReturnValue(mockPopulateChain);

            await getFuelRecords(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRecords });
        });
    });

    describe('getFuelRecord', () => {
        it('should get a single fuel record', async () => {
            req.params = { id: 'record_id' };
            const mockRecord = { _id: 'record_id' };
            const mockPopulateChain = {
                populate: jest.fn(function() {
                    if (this.populate.mock.calls.length === 1) {
                        return this;
                    }
                    return Promise.resolve(mockRecord);
                }),
            };
            FuelRecord.findById.mockReturnValue(mockPopulateChain);

            await getFuelRecord(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRecord });
        });

        it('should throw error if fuel record not found', async () => {
            req.params = { id: 'invalid_id' };
            const mockPopulateChain = {
                populate: jest.fn(function() {
                    if (this.populate.mock.calls.length === 1) {
                        return this;
                    }
                    return Promise.resolve(null);
                }),
            };
            FuelRecord.findById.mockReturnValue(mockPopulateChain);

            await expect(getFuelRecord(req, res)).rejects.toThrow('Fuel record not found');
        });
    });

    describe('updateFuelRecord', () => {
        it('should update a fuel record', async () => {
            req.params = { id: 'record_id' };
            req.body = { liters: 120 };
            const mockRecord = { _id: 'record_id', liters: 100, save: jest.fn().mockResolvedValue({ _id: 'record_id', liters: 120 }) };
            FuelRecord.findById.mockResolvedValue(mockRecord);

            await updateFuelRecord(req, res);

            expect(mockRecord.liters).toBe(120);
            expect(mockRecord.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should throw error if fuel record not found', async () => {
            req.params = { id: 'invalid_id' };
            FuelRecord.findById.mockResolvedValue(null);

            await expect(updateFuelRecord(req, res)).rejects.toThrow('Fuel record not found');
        });
    });

    describe('deleteFuelRecord', () => {
        it('should delete a fuel record', async () => {
            req.params = { id: 'record_id' };
            const mockRecord = { _id: 'record_id', deleteOne: jest.fn().mockResolvedValue({}) };
            FuelRecord.findById.mockResolvedValue(mockRecord);

            await deleteFuelRecord(req, res);

            expect(mockRecord.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Fuel record removed' });
        });

        it('should throw error if fuel record not found', async () => {
            req.params = { id: 'invalid_id' };
            FuelRecord.findById.mockResolvedValue(null);

            await expect(deleteFuelRecord(req, res)).rejects.toThrow('Fuel record not found');
        });
    });
});

