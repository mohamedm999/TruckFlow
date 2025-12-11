import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: { countDocuments: jest.fn() }
}));

jest.unstable_mockModule('../models/Trailer.js', () => ({
  default: { countDocuments: jest.fn() }
}));

jest.unstable_mockModule('../models/Trip.js', () => ({
  default: {
    countDocuments: jest.fn(),
    find: jest.fn()
  }
}));

jest.unstable_mockModule('../models/Maintenance.js', () => ({
  default: { find: jest.fn() }
}));

jest.unstable_mockModule('../models/FuelRecord.js', () => ({
  default: { find: jest.fn() }
}));

jest.unstable_mockModule('../services/analyticsService.js', () => ({
  getFleetStatistics: jest.fn()
}));

let getDashboardStats, getFuelConsumption, getMaintenanceCosts, getTripStatistics;
let Truck, Trailer, Trip, Maintenance, FuelRecord, getFleetStatistics;

describe('Report Controller', () => {
  let req, res;

  beforeAll(async () => {
    const reportController = await import('../controllers/reportController.js');
    getDashboardStats = reportController.getDashboardStats;
    getFuelConsumption = reportController.getFuelConsumption;
    getMaintenanceCosts = reportController.getMaintenanceCosts;
    getTripStatistics = reportController.getTripStatistics;

    const truckModule = await import('../models/Truck.js');
    Truck = truckModule.default;
    const trailerModule = await import('../models/Trailer.js');
    Trailer = trailerModule.default;
    const tripModule = await import('../models/Trip.js');
    Trip = tripModule.default;
    const maintenanceModule = await import('../models/Maintenance.js');
    Maintenance = maintenanceModule.default;
    const fuelModule = await import('../models/FuelRecord.js');
    FuelRecord = fuelModule.default;
    const analyticsModule = await import('../services/analyticsService.js');
    getFleetStatistics = analyticsModule.getFleetStatistics;
  });

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      Truck.countDocuments.mockResolvedValue(10);
      Trailer.countDocuments.mockResolvedValue(5);
      Maintenance.find.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([])
        })
      });
      Trip.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([])
          })
        })
      });
      getFleetStatistics.mockResolvedValue({
        totalTrips: 50,
        activeTrips: 10,
        completedTrips: 40
      });

      await getDashboardStats(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            totalTrucks: 10,
            totalTrailers: 5
          })
        })
      );
    });
  });

  describe('getFuelConsumption', () => {
    it('should return fuel consumption by truck', async () => {
      const mockRecords = [
        { truck: { _id: 't1', registrationNumber: 'T1' }, liters: 100, pricePerLiter: 1.5 }
      ];
      FuelRecord.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockRecords)
        })
      });

      await getFuelConsumption(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
  });

  describe('getTripStatistics', () => {
    it('should return trip statistics', async () => {
      Trip.countDocuments.mockResolvedValueOnce(100)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(5);
      Trip.find.mockResolvedValue([]);

      await getTripStatistics(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            total: 100,
            completed: 80,
            completionRate: 80
          })
        })
      );
    });
  });
});
