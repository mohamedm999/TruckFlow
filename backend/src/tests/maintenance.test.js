import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Maintenance.js', () => ({
  default: { findById: jest.fn(), create: jest.fn() },
}));

jest.unstable_mockModule('../models/Truck.js', () => ({
  default: { findById: jest.fn() },
}));

jest.unstable_mockModule('../services/notificationService.js', () => ({
  notifyMaintenanceDue: jest.fn()
}));

describe('Maintenance Controller', () => {
  let createMaintenanceRecord, Maintenance, Truck, notifyMaintenanceDue, req, res;

  beforeAll(async () => {
    const maintenanceController = await import('../controllers/maintenanceController.js');
    createMaintenanceRecord = maintenanceController.createMaintenanceRecord;
    Maintenance = (await import('../models/Maintenance.js')).default;
    Truck = (await import('../models/Truck.js')).default;
    const notificationService = await import('../services/notificationService.js');
    notifyMaintenanceDue = notificationService.notifyMaintenanceDue;
  });

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should create maintenance for truck', async () => {
    req.body = { vehicleType: 'Truck', vehicleId: 'truck_id', type: 'Oil Change' };
    const mockRecord = { _id: 'maint_id', populate: jest.fn().mockReturnThis() };
    
    Truck.findById.mockResolvedValue({ _id: 'truck_id', registrationNumber: 'T001' });
    Maintenance.create.mockResolvedValue(mockRecord);
    notifyMaintenanceDue.mockResolvedValue();

    await createMaintenanceRecord(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should throw error if vehicle not found', async () => {
    req.body = { vehicleType: 'Truck', vehicleId: 'invalid_id' };
    Truck.findById.mockResolvedValue(null);

    await expect(createMaintenanceRecord(req, res)).rejects.toThrow('Truck not found');
  });
});
