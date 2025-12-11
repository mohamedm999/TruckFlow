import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Trip.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../models/User.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

let createTrip, getTrips, getTrip, updateTrip, deleteTrip, getMyTrips, updateTripStatus, updateTripMileage, Trip, Truck, User;

describe('Trip Controller', () => {
    let req, res;

    beforeAll(async () => {
        const tripModule = await import('../models/Trip.js');
        Trip = tripModule.default;
        
        const truckModule = await import('../models/Truck.js');
        Truck = truckModule.default;

        const userModule = await import('../models/User.js');
        User = userModule.default;

        const tripController = await import('../controllers/tripController.js');
        createTrip = tripController.createTrip;
        getTrips = tripController.getTrips;
        getTrip = tripController.getTrip;
        updateTrip = tripController.updateTrip;
        deleteTrip = tripController.deleteTrip;
        getMyTrips = tripController.getMyTrips;
        updateTripStatus = tripController.updateTripStatus;
        updateTripMileage = tripController.updateTripMileage;
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

    describe('createTrip', () => {
        it('should create a trip successfully', async () => {
            req.body = {
                tripId: 'TRIP-001',
                truckId: 'truck_id',
                chauffeurId: 'driver_id',
                origin: 'Paris',
                destination: 'Lyon',
                plannedDeparture: new Date('2024-12-15'),
                mileageStart: 1000
            };

            Truck.findById.mockResolvedValue({ _id: 'truck_id' });
            User.findById.mockResolvedValue({ _id: 'driver_id', role: 'chauffeur' });
            Trip.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            Trip.create.mockResolvedValue({ ...req.body, _id: 'trip_id' });

            await createTrip(req, res);

            expect(Truck.findById).toHaveBeenCalledWith('truck_id');
            expect(User.findById).toHaveBeenCalledWith('driver_id');
            expect(Trip.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should throw error if truck not found', async () => {
             req.body = { truckId: 'invalid_id' };
             Truck.findById.mockResolvedValue(null);

             await expect(createTrip(req, res)).rejects.toThrow('Truck not found');
        });

        it('should throw error if chauffeur not found', async () => {
             req.body = { truckId: 'truck_id', chauffeurId: 'invalid_id' };
             Truck.findById.mockResolvedValue({ _id: 'truck_id' });
             User.findById.mockResolvedValue(null);

             await expect(createTrip(req, res)).rejects.toThrow('Chauffeur not found');
        });

        it('should throw error if trip ID already exists', async () => {
             req.body = { tripId: 'TRIP-001', truckId: 'truck_id', chauffeurId: 'driver_id', plannedDeparture: new Date() };
             Truck.findById.mockResolvedValue({ _id: 'truck_id' });
             User.findById.mockResolvedValue({ _id: 'driver_id', role: 'chauffeur' });
             Trip.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: 'existing' });

             await expect(createTrip(req, res)).rejects.toThrow('Trip ID already exists');
        });

        it('should throw error if trip creation fails', async () => {
             req.body = {
                tripId: 'TRIP-001',
                truckId: 'truck_id',
                chauffeurId: 'driver_id',
                origin: 'Paris',
                destination: 'Lyon',
                plannedDeparture: new Date()
            };

            Truck.findById.mockResolvedValue({ _id: 'truck_id' });
            User.findById.mockResolvedValue({ _id: 'driver_id', role: 'chauffeur' });
            Trip.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            Trip.create.mockResolvedValue(null);

            await expect(createTrip(req, res)).rejects.toThrow('Invalid trip data');
        });
    });

    describe('getTrips', () => {
        it('should get all trips', async () => {
             const mockResult = [{ _id: 't1' }];
             const mockPopulateChain = {
                 populate: jest.fn(function() {
                     const callCount = this.populate.mock.calls.length;
                     if (callCount < 3) {
                         return this;
                     }
                     return Promise.resolve(mockResult);
                 }),
             };
             Trip.find.mockReturnValue(mockPopulateChain);

             await getTrips(req, res);

             expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult });
        });
    });

    describe('getTrip', () => {
        it('should get a single trip', async () => {
            req.params.id = 'trip_id';
            const mockTrip = { _id: 'trip_id' };
            const mockPopulateChain = {
                populate: jest.fn(function() {
                    const callCount = this.populate.mock.calls.length;
                    if (callCount < 3) {
                        return this;
                    }
                    return Promise.resolve(mockTrip);
                }),
            };
            Trip.findById.mockReturnValue(mockPopulateChain);

            await getTrip(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTrip });
        });

        it('should throw error if trip not found', async () => {
            req.params.id = 'invalid_id';
            const mockPopulateChain = {
                populate: jest.fn(function() {
                    const callCount = this.populate.mock.calls.length;
                    if (callCount < 3) {
                        return this;
                    }
                    return Promise.resolve(null);
                }),
            };
            Trip.findById.mockReturnValue(mockPopulateChain);

            await expect(getTrip(req, res)).rejects.toThrow('Trip not found');
        });
    });

    describe('updateTrip', () => {
        it('should update trip status', async () => {
            req.params.id = 'trip_id';
            req.body = { status: 'Completed', mileageEnd: 1500 };
            
            const mockTrip = { 
                _id: 'trip_id', 
                status: 'InProgress',
                save: jest.fn().mockResolvedValue({ _id: 'trip_id', status: 'Completed' }) 
            };
            
            Trip.findById.mockResolvedValue(mockTrip);

            await updateTrip(req, res);

            expect(mockTrip.status).toBe('Completed');
            expect(mockTrip.mileageEnd).toBe(1500);
            expect(mockTrip.save).toHaveBeenCalled();
        });

        it('should update origin and notes', async () => {
            req.params.id = 'trip_id';
            req.body = { origin: 'New Origin', notes: 'New Notes' };
            
            const mockTrip = { 
                _id: 'trip_id',
                origin: 'Old',
                notes: 'Old',
                save: jest.fn().mockResolvedValue({ _id: 'trip_id' }) 
            };
            
            Trip.findById.mockResolvedValue(mockTrip);

            await updateTrip(req, res);

            expect(mockTrip.origin).toBe('New Origin');
            expect(mockTrip.notes).toBe('New Notes');
        });

        it('should throw error if trip not found', async () => {
            req.params.id = 'invalid_id';
            Trip.findById.mockResolvedValue(null);

            await expect(updateTrip(req, res)).rejects.toThrow('Trip not found');
        });
    });

    describe('deleteTrip', () => {
        it('should delete a trip', async () => {
            req.params.id = 'trip_id';
            const mockTrip = { 
                _id: 'trip_id', 
                deleteOne: jest.fn().mockResolvedValue({}) 
            };
            Trip.findById.mockResolvedValue(mockTrip);

            await deleteTrip(req, res);

            expect(mockTrip.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Trip removed' });
        });

        it('should throw error if trip not found', async () => {
            req.params.id = 'invalid_id';
            Trip.findById.mockResolvedValue(null);

            await expect(deleteTrip(req, res)).rejects.toThrow('Trip not found');
        });
    });

    describe('getMyTrips', () => {
        it('should get trips for logged-in driver', async () => {
            req.user = { _id: 'driver_id' };
            const mockTrips = [{ _id: 't1', chauffeurId: 'driver_id' }];
            const mockPopulateChain = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockTrips)
            };
            Trip.find.mockReturnValue(mockPopulateChain);

            await getMyTrips(req, res);

            expect(Trip.find).toHaveBeenCalledWith({ chauffeurId: 'driver_id' });
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTrips });
        });
    });

    describe('updateTripStatus', () => {
        it('should update trip status for authorized driver', async () => {
            req.params.id = 'trip_id';
            req.body = { status: 'InProgress' };
            req.user = { _id: 'driver_id' };
            
            const mockTrip = { 
                _id: 'trip_id',
                chauffeurId: { toString: () => 'driver_id' },
                status: 'Planned',
                save: jest.fn().mockResolvedValue({ _id: 'trip_id', status: 'InProgress' })
            };
            Trip.findById.mockResolvedValue(mockTrip);

            await updateTripStatus(req, res);

            expect(mockTrip.status).toBe('InProgress');
            expect(mockTrip.save).toHaveBeenCalled();
        });

        it('should throw error if driver not authorized', async () => {
            req.params.id = 'trip_id';
            req.body = { status: 'InProgress' };
            req.user = { _id: 'other_driver' };
            
            const mockTrip = { 
                chauffeurId: { toString: () => 'driver_id' }
            };
            Trip.findById.mockResolvedValue(mockTrip);

            await expect(updateTripStatus(req, res)).rejects.toThrow('Not authorized to update this trip');
        });
    });

    describe('updateTripMileage', () => {
        it('should update trip mileage', async () => {
            req.params.id = 'trip_id';
            req.body = { mileageStart: 1000, mileageEnd: 1500 };
            req.user = { _id: 'driver_id' };
            
            const mockTrip = { 
                _id: 'trip_id',
                chauffeurId: { toString: () => 'driver_id' },
                save: jest.fn().mockResolvedValue({ _id: 'trip_id', mileageStart: 1000, mileageEnd: 1500 })
            };
            Trip.findById.mockResolvedValue(mockTrip);

            await updateTripMileage(req, res);

            expect(mockTrip.mileageStart).toBe(1000);
            expect(mockTrip.mileageEnd).toBe(1500);
            expect(mockTrip.save).toHaveBeenCalled();
        });
    });
});
