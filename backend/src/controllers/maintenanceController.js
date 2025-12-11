import asyncHandler from 'express-async-handler';
import Maintenance from '../models/Maintenance.js';
import Truck from '../models/Truck.js';
import Trailer from '../models/Trailer.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const { vehicleType, vehicleId } = req.query;
  const filter = {};
  
  if (vehicleType) filter.vehicleType = vehicleType;
  if (vehicleId) filter.vehicleId = vehicleId;

  const records = await Maintenance.find(filter)
    .populate('vehicleId', 'registrationNumber brand model type')
    .sort({ scheduledDate: -1 });
  
  res.json({ success: true, data: records });
});

export const getMaintenanceRecord = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id)
    .populate('vehicleId', 'registrationNumber brand model type');

  if (!record) {
    throw new ApiError(404, 'Maintenance record not found');
  }

  res.json({ success: true, data: record });
});

export const createMaintenanceRecord = asyncHandler(async (req, res) => {
  const { vehicleType, vehicleId, type, scheduledDate, cost, notes } = req.body;

  const Model = vehicleType === 'Truck' ? Truck : Trailer;
  const vehicle = await Model.findById(vehicleId);
  
  if (!vehicle) {
    throw new ApiError(404, `${vehicleType} not found`);
  }

  const record = await Maintenance.create({
    vehicleType,
    vehicleId,
    type,
    scheduledDate,
    cost,
    notes
  });

  res.status(201).json({ success: true, data: record });
});

export const updateMaintenanceRecord = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);

  if (!record) {
    throw new ApiError(404, 'Maintenance record not found');
  }

  const allowedUpdates = ['type', 'scheduledDate', 'completedDate', 'cost', 'notes'];
  
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      record[field] = req.body[field];
    }
  });

  const updatedRecord = await record.save();
  res.json({ success: true, data: updatedRecord });
});

export const deleteMaintenanceRecord = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);

  if (!record) {
    throw new ApiError(404, 'Maintenance record not found');
  }

  await record.deleteOne();
  res.json({ success: true, message: 'Maintenance record removed' });
});

export const getVehicleMaintenanceHistory = asyncHandler(async (req, res) => {
  const { vehicleType, vehicleId } = req.params;

  const Model = vehicleType === 'Truck' ? Truck : Trailer;
  const vehicle = await Model.findById(vehicleId);
  
  if (!vehicle) {
    throw new ApiError(404, `${vehicleType} not found`);
  }

  const history = await Maintenance.find({ vehicleType, vehicleId })
    .sort({ scheduledDate: -1 });

  res.json({ success: true, data: history });
});
