
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

let createTire, getTires, getTire, updateTire, deleteTire, Tire;

describe('Tire Controller', () => {
    let req, res;

    beforeAll(async () => {
        const tireController = await import('../controllers/tireController.js');
        createTire = tireController.createTire;
        getTires = tireController.getTires;
        getTire = tireController.getTire;
        updateTire = tireController.updateTire;
        deleteTire = tireController.deleteTire;
        
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

        it('should throw error if tire creation fails', async () => {
             req.body = {
                serialNumber: 'SN-TIRE-001',
                brand: 'Michelin',
                size: '295/80R22.5',
                status: 'Active'
            };

            Tire.findOne.mockResolvedValue(null);
            Tire.create.mockResolvedValue(null);

            await expect(createTire(req, res)).rejects.toThrow('Invalid tire data');
        });
    });

    describe('getTires', () => {
        it('should get all tires', async () => {
            const mockTires = [{ _id: 't1' }, { _id: 't2' }];
            Tire.find.mockResolvedValue(mockTires);

            await getTires(req, res);

            expect(Tire.find).toHaveBeenCalledWith({});
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTires });
        });
    });

    describe('getTire', () => {
        it('should get a single tire', async () => {
            req.params = { id: 'tire_id' };
            const mockTire = { _id: 'tire_id' };
            Tire.findById.mockResolvedValue(mockTire);

            await getTire(req, res);

            expect(Tire.findById).toHaveBeenCalledWith('tire_id');
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTire });
        });

        it('should throw error if tire not found', async () => {
            req.params = { id: 'invalid_id' };
            Tire.findById.mockResolvedValue(null);

            await expect(getTire(req, res)).rejects.toThrow('Tire not found');
        });
    });

    describe('updateTire', () => {
        it('should update a tire', async () => {
            req.params = { id: 'tire_id' };
            req.body = { wearLevel: 50 };
            const mockTire = { _id: 'tire_id', wearLevel: 0, save: jest.fn().mockResolvedValue({ _id: 'tire_id', wearLevel: 50 }) };
            Tire.findById.mockResolvedValue(mockTire);

            await updateTire(req, res);

            expect(mockTire.wearLevel).toBe(50);
            expect(mockTire.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should throw error if tire not found', async () => {
            req.params = { id: 'invalid_id' };
            Tire.findById.mockResolvedValue(null);

            await expect(updateTire(req, res)).rejects.toThrow('Tire not found');
        });
    });

    describe('deleteTire', () => {
        it('should delete a tire', async () => {
            req.params = { id: 'tire_id' };
            const mockTire = { _id: 'tire_id', deleteOne: jest.fn().mockResolvedValue({}) };
            Tire.findById.mockResolvedValue(mockTire);

            await deleteTire(req, res);

            expect(mockTire.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Tire removed' });
        });

        it('should throw error if tire not found', async () => {
            req.params = { id: 'invalid_id' };
            Tire.findById.mockResolvedValue(null);

            await expect(deleteTire(req, res)).rejects.toThrow('Tire not found');
        });
    });
});

