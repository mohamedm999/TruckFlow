import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: { findOne: jest.fn(), create: jest.fn() },
}));

describe('Truck Controller', () => {
    let createTruck, Truck, req, res;

    beforeAll(async () => {
        const truckController = await import('../controllers/truckController.js');
        createTruck = truckController.createTruck;
        Truck = (await import('../models/Truck.js')).default;
    });

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    it('should create a truck successfully', async () => {
        req.body = { registrationNumber: 'TRUCK-001', brand: 'Volvo' };

        Truck.findOne.mockResolvedValue(null);
        Truck.create.mockResolvedValue({ _id: 'truck_id' });

        await createTruck(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should throw error if truck already exists', async () => {
         req.body = { registrationNumber: 'TRUCK-EXIST' };
         Truck.findOne.mockResolvedValue({ _id: 'existing_id' });

         await expect(createTruck(req, res)).rejects.toThrow('Truck already exists');
    });
});
