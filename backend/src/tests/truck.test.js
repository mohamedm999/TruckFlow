
import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../models/Truck.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

let createTruck, getTrucks, getTruck, updateTruck, deleteTruck, Truck;

describe('Truck Controller', () => {
    let req, res;

    beforeAll(async () => {
        const truckController = await import('../controllers/truckController.js');
        createTruck = truckController.createTruck;
        getTrucks = truckController.getTrucks;
        getTruck = truckController.getTruck;
        updateTruck = truckController.updateTruck;
        deleteTruck = truckController.deleteTruck;
        
        const truckModule = await import('../models/Truck.js');
        Truck = truckModule.default;
    });

    beforeEach(() => {
        req = {
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('createTruck', () => {
        it('should create a truck successfully', async () => {
            req.body = {
                registrationNumber: 'TRUCK-001',
                brand: 'Volvo',
                model: 'FH16',
                year: 2023,
                status: 'Active',
                currentOdometer: 0
            };

            Truck.findOne.mockResolvedValue(null);
            Truck.create.mockResolvedValue({ ...req.body, _id: 'truck_id' });

            await createTruck(req, res);

            expect(Truck.findOne).toHaveBeenCalledWith({ registrationNumber: 'TRUCK-001' });
            expect(Truck.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ registrationNumber: 'TRUCK-001' }) }));
        });

        it('should throw error if truck already exists', async () => {
             req.body = { registrationNumber: 'TRUCK-EXIST' };
             Truck.findOne.mockResolvedValue({ _id: 'existing_id' });

             await expect(createTruck(req, res)).rejects.toThrow('Truck already exists');
        });

        it('should throw error if truck creation fails', async () => {
             req.body = {
                registrationNumber: 'TRUCK-001',
                brand: 'Volvo',
                model: 'FH16',
                year: 2023,
                status: 'Active',
                currentOdometer: 0
            };

            Truck.findOne.mockResolvedValue(null);
            Truck.create.mockResolvedValue(null);

            await expect(createTruck(req, res)).rejects.toThrow('Invalid truck data');
        });
    });

    describe('getTrucks', () => {
        it('should get all trucks', async () => {
            const mockTrucks = [{ _id: 't1' }, { _id: 't2' }];
            Truck.find.mockResolvedValue(mockTrucks);

            await getTrucks(req, res);

            expect(Truck.find).toHaveBeenCalledWith({});
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTrucks });
        });
    });

    describe('getTruck', () => {
        it('should get a single truck by ID', async () => {
            req.params.id = 'truck_id';
            const mockTruck = { _id: 'truck_id', registrationNumber: 'T1' };
            Truck.findById.mockResolvedValue(mockTruck);

            await getTruck(req, res);

            expect(Truck.findById).toHaveBeenCalledWith('truck_id');
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTruck });
        });

        it('should throw error if truck not found', async () => {
            req.params.id = 'invalid_id';
            Truck.findById.mockResolvedValue(null);

            await expect(getTruck(req, res)).rejects.toThrow('Truck not found');
        });
    });

    describe('updateTruck', () => {
        it('should update a truck', async () => {
            req.params.id = 'truck_id';
            req.body = { brand: 'Scania' };
            
            const mockTruck = { 
                _id: 'truck_id', 
                brand: 'Volvo',
                save: jest.fn().mockResolvedValue({ _id: 'truck_id', brand: 'Scania' }) 
            };
            Truck.findById.mockResolvedValue(mockTruck);

            await updateTruck(req, res);

            expect(Truck.findById).toHaveBeenCalledWith('truck_id');
            expect(mockTruck.brand).toBe('Scania');
            expect(mockTruck.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should update truck with currentOdometer', async () => {
            req.params.id = 'truck_id';
            req.body = { currentOdometer: 5000 };
            
            const mockTruck = { 
                _id: 'truck_id',
                currentOdometer: 1000,
                save: jest.fn().mockResolvedValue({ _id: 'truck_id', currentOdometer: 5000 }) 
            };
            Truck.findById.mockResolvedValue(mockTruck);

            await updateTruck(req, res);

            expect(mockTruck.currentOdometer).toBe(5000);
            expect(mockTruck.save).toHaveBeenCalled();
        });

        it('should throw error if truck to update not found', async () => {
            req.params.id = 'invalid_id';
            Truck.findById.mockResolvedValue(null);

            await expect(updateTruck(req, res)).rejects.toThrow('Truck not found');
        });
    });

    describe('deleteTruck', () => {
        it('should delete a truck', async () => {
            req.params.id = 'truck_id';
            const mockTruck = { 
                _id: 'truck_id', 
                deleteOne: jest.fn().mockResolvedValue({}) 
            };
            Truck.findById.mockResolvedValue(mockTruck);

            await deleteTruck(req, res);

            expect(Truck.findById).toHaveBeenCalledWith('truck_id');
            expect(mockTruck.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Truck removed' });
        });

        it('should throw error if truck to delete not found', async () => {
            req.params.id = 'invalid_id';
            Truck.findById.mockResolvedValue(null);

            await expect(deleteTruck(req, res)).rejects.toThrow('Truck not found');
        });
    });
});
