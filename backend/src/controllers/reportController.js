import asyncHandler from 'express-async-handler';
import Truck from '../models/Truck.js';
import Trailer from '../models/Trailer.js';
import Trip from '../models/Trip.js';
import FuelRecord from '../models/FuelRecord.js';
import Maintenance from '../models/Maintenance.js';
import { getFleetStatistics } from '../services/analyticsService.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [trucks, trailers, upcomingMaintenance, recentTrips, fleetStats] = await Promise.all([
    Truck.countDocuments(),
    Trailer.countDocuments(),
    Maintenance.find({ 
      scheduledDate: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      completedDate: null 
    }).limit(5).populate('vehicleId', 'registrationNumber'),
    Trip.find().sort({ createdAt: -1 }).limit(5).populate('truckId chauffeurId', 'registrationNumber firstName lastName'),
    getFleetStatistics()
  ]);

  res.json({
    success: true,
    data: {
      totalTrucks: trucks,
      totalTrailers: trailers,
      ...fleetStats,
      upcomingMaintenance,
      recentTrips
    }
  });
});

export const getFuelConsumption = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {};

  if (startDate) filter.date = { $gte: new Date(startDate) };
  if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };

  const fuelRecords = await FuelRecord.find(filter)
    .populate('truck', 'registrationNumber brand model')
    .sort({ date: -1 });

  const byTruck = fuelRecords.reduce((acc, record) => {
    const truckId = record.truck._id.toString();
    if (!acc[truckId]) {
      acc[truckId] = {
        truck: record.truck,
        totalLiters: 0,
        totalCost: 0,
        records: 0
      };
    }
    acc[truckId].totalLiters += record.liters;
    acc[truckId].totalCost += record.liters * record.pricePerLiter;
    acc[truckId].records += 1;
    return acc;
  }, {});

  res.json({ success: true, data: Object.values(byTruck) });
});

export const getMaintenanceCosts = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = { completedDate: { $ne: null } };

  if (startDate) filter.scheduledDate = { $gte: new Date(startDate) };
  if (endDate) filter.scheduledDate = { ...filter.scheduledDate, $lte: new Date(endDate) };

  const maintenanceRecords = await Maintenance.find(filter)
    .populate('vehicleId', 'registrationNumber brand model type')
    .sort({ completedDate: -1 });

  const byVehicle = maintenanceRecords.reduce((acc, record) => {
    const vehicleId = record.vehicleId._id.toString();
    if (!acc[vehicleId]) {
      acc[vehicleId] = {
        vehicle: record.vehicleId,
        vehicleType: record.vehicleType,
        totalCost: 0,
        records: 0
      };
    }
    acc[vehicleId].totalCost += record.cost || 0;
    acc[vehicleId].records += 1;
    return acc;
  }, {});

  res.json({ success: true, data: Object.values(byVehicle) });
});

export const getTripStatistics = asyncHandler(async (req, res) => {
  const [total, completed, inProgress, planned, cancelled] = await Promise.all([
    Trip.countDocuments(),
    Trip.countDocuments({ status: 'Completed' }),
    Trip.countDocuments({ status: 'InProgress' }),
    Trip.countDocuments({ status: 'Planned' }),
    Trip.countDocuments({ status: 'Cancelled' })
  ]);

  const completedTrips = await Trip.find({ 
    status: 'Completed',
    actualDeparture: { $exists: true },
    actualArrival: { $exists: true }
  });

  let avgDuration = 0;
  if (completedTrips.length > 0) {
    const totalDuration = completedTrips.reduce((sum, trip) => {
      return sum + (new Date(trip.actualArrival) - new Date(trip.actualDeparture));
    }, 0);
    avgDuration = Math.round(totalDuration / completedTrips.length / (1000 * 60 * 60));
  }

  res.json({
    success: true,
    data: {
      total,
      completed,
      inProgress,
      planned,
      cancelled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      avgDurationHours: avgDuration
    }
  });
});
