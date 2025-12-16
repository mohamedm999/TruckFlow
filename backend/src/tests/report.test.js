import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: { countDocuments: jest.fn() }
}));

jest.unstable_mockModule('../models/Trailer.js', () => ({
  default: { countDocuments: jest.fn() }
}));

jest.unstable_mockModule('../models/Maintenance.js', () => ({
  default: { find: jest.fn() }
}));

jest.unstable_mockModule('../models/Trip.js', () => ({
  default: { find: jest.fn() }
}));

jest.unstable_mockModule('../services/analyticsService.js', () => ({
  getFleetStatistics: jest.fn()
}));

describe('Report Controller', () => {
  let getDashboardStats, Truck, Trailer, Maintenance, Trip, getFleetStatistics, req, res;

  beforeAll(async () => {
    const reportController = await import('../controllers/reportController.js');
    getDashboardStats = reportController.getDashboardStats;
    Truck = (await import('../models/Truck.js')).default;
    Trailer = (await import('../models/Trailer.js')).default;
    Maintenance = (await import('../models/Maintenance.js')).default;
    Trip = (await import('../models/Trip.js')).default;
    getFleetStatistics = (await import('../services/analyticsService.js')).getFleetStatistics;
  });

  beforeEach(() => {
    req = { query: {} };
    res = { json: jest.fn() };
    jest.clearAllMocks();
  });

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
    getFleetStatistics.mockResolvedValue({ totalTrips: 50 });

    await getDashboardStats(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
});
