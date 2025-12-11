import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Maintenance.js', () => ({
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

jest.unstable_mockModule('../models/Trailer.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

let createMaintenanceRecord, getMaintenanceRecords, getMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord, getVehicleMaintenanceHistory;
let Maintenance, Truck, Trailer;

describe('Maintenance Controller', () => {
  let req, res;

  beforeAll(async () => {
    const maintenanceController = await import('../controllers/maintenanceController.js');
    createMaintenanceRecord = maintenanceController.createMaintenanceRecord;
    getMaintenanceRecords = maintenanceController.getMaintenanceRecords;
    getMaintenanceRecord = maintenanceController.getMaintenanceRecord;
    updateMaintenanceRecord = maintenanceController.updateMaintenanceRecord;
    deleteMaintenanceRecord = maintenanceController.deleteMaintenanceRecord;
    getVehicleMaintenanceHistory = maintenanceController.getVehicleMaintenanceHistory;

    const maintenanceModule = await import('../models/Maintenance.js');
    Maintenance = maintenanceModule.default;
    const truckModule = await import('../models/Truck.js');
    Truck = truckModule.default;
    const trailerModule = await import('../models/Trailer.js');
    Trailer = trailerModule.default;
  });

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createMaintenanceRecord', () => {
    it('should create maintenance for truck', async () => {
      req.body = {
        vehicleType: 'Truck',
        vehicleId: 'truck_id',
        type: 'Oil Change',
        scheduledDate: '2024-02-15',
        cost: 450
      };

      Truck.findById.mockResolvedValue({ _id: 'truck_id' });
      Maintenance.create.mockResolvedValue({ ...req.body, _id: 'maint_id' });

      await createMaintenanceRecord(req, res);

      expect(Truck.findById).toHaveBeenCalledWith('truck_id');
      expect(Maintenance.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should throw error if vehicle not found', async () => {
      req.body = { vehicleType: 'Truck', vehicleId: 'invalid_id' };
      Truck.findById.mockResolvedValue(null);

      await expect(createMaintenanceRecord(req, res)).rejects.toThrow('Truck not found');
    });
  });

  describe('getMaintenanceRecords', () => {
    it('should get all maintenance records', async () => {
      const mockRecords = [{ _id: 'm1' }, { _id: 'm2' }];
      Maintenance.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockRecords)
        })
      });

      await getMaintenanceRecords(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRecords });
    });
  });

  describe('getMaintenanceRecord', () => {
    it('should get single maintenance record', async () => {
      req.params.id = 'maint_id';
      const mockRecord = { _id: 'maint_id', type: 'Oil Change' };
      Maintenance.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRecord)
      });

      await getMaintenanceRecord(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRecord });
    });

    it('should throw error if not found', async () => {
      req.params.id = 'invalid_id';
      Maintenance.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(getMaintenanceRecord(req, res)).rejects.toThrow('Maintenance record not found');
    });
  });

  describe('updateMaintenanceRecord', () => {
    it('should update maintenance record', async () => {
      req.params.id = 'maint_id';
      req.body = { cost: 500, completedDate: '2024-02-16' };

      const mockRecord = {
        _id: 'maint_id',
        cost: 450,
        save: jest.fn().mockResolvedValue({ _id: 'maint_id', cost: 500 })
      };
      Maintenance.findById.mockResolvedValue(mockRecord);

      await updateMaintenanceRecord(req, res);

      expect(mockRecord.cost).toBe(500);
      expect(mockRecord.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('deleteMaintenanceRecord', () => {
    it('should delete maintenance record', async () => {
      req.params.id = 'maint_id';
      const mockRecord = {
        _id: 'maint_id',
        deleteOne: jest.fn().mockResolvedValue({})
      };
      Maintenance.findById.mockResolvedValue(mockRecord);

      await deleteMaintenanceRecord(req, res);

      expect(mockRecord.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Maintenance record removed' });
    });
  });

  describe('getVehicleMaintenanceHistory', () => {
    it('should get vehicle maintenance history', async () => {
      req.params = { vehicleType: 'Truck', vehicleId: 'truck_id' };
      const mockHistory = [{ _id: 'm1' }, { _id: 'm2' }];

      Truck.findById.mockResolvedValue({ _id: 'truck_id' });
      Maintenance.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockHistory)
      });

      await getVehicleMaintenanceHistory(req, res);

      expect(Truck.findById).toHaveBeenCalledWith('truck_id');
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockHistory });
    });
  });
});
