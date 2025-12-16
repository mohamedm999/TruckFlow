import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Trip.js', () => ({
  default: { findOne: jest.fn(), create: jest.fn() },
}));

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: { findById: jest.fn() },
}));

jest.unstable_mockModule('../models/User.js', () => ({
  default: { findById: jest.fn() },
}));

describe('Trip Controller', () => {
    let createTrip, Trip, Truck, User, req, res;

    beforeAll(async () => {
        const tripController = await import('../controllers/tripController.js');
        createTrip = tripController.createTrip;
        Trip = (await import('../models/Trip.js')).default;
        Truck = (await import('../models/Truck.js')).default;
        User = (await import('../models/User.js')).default;
    });

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    it('should create a trip successfully', async () => {
        req.body = { tripId: 'TRIP-001', truckId: 'truck_id', chauffeurId: 'driver_id' };
        const mockTrip = { _id: 'trip_id', populate: jest.fn().mockReturnThis() };

        Truck.findById.mockResolvedValue({ _id: 'truck_id' });
        User.findById.mockResolvedValue({ _id: 'driver_id', role: 'chauffeur' });
        Trip.findOne.mockResolvedValue(null);
        Trip.create.mockResolvedValue(mockTrip);

        await createTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should throw error if truck not found', async () => {
         req.body = { truckId: 'invalid_id' };
         Truck.findById.mockResolvedValue(null);

         await expect(createTrip(req, res)).rejects.toThrow('Truck not found');
    });
});
