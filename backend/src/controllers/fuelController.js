
import asyncHandler from 'express-async-handler';
import FuelRecord from '../models/FuelRecord.js';
import Truck from '../models/Truck.js';
import { ApiError } from '../middleware/errorMiddleware.js';


export const getFuelRecords = asyncHandler(async (req, res) => {
  const records = await FuelRecord.find({})
    .populate('truck', 'registrationNumber brand model')
    .populate('driver', 'firstName lastName')
    .sort({ date: -1 });
  res.json({ success: true, data: records });
});

export const getFuelRecord = asyncHandler(async (req, res) => {
  const record = await FuelRecord.findById(req.params.id)
    .populate('truck', 'registrationNumber brand model')
    .populate('driver', 'firstName lastName');

  if (record) {
    res.json({ success: true, data: record });
  } else {
    throw new ApiError(404, 'Fuel record not found');
  }
});

export const createFuelRecord = asyncHandler(async (req, res) => {
  const { truck, date, odometer, liters, pricePerLiter, fullTank } = req.body;
 
  const truckDoc = await Truck.findById(truck);
  if (!truckDoc) {
    throw new ApiError(404, 'Truck not found');
  }
  const totalCost = liters * pricePerLiter;

  const record = await FuelRecord.create({
    truck,
    driver: req.user._id, 
    date,
    odometer,
    liters,
    pricePerLiter,
    totalCost,
    fullTank
  });

  if (record) {
    if (odometer > truckDoc.currentOdometer) {
        truckDoc.currentOdometer = odometer;
        await truckDoc.save();
    }

    await record.populate('truck', 'registrationNumber brand model');
    await record.populate('driver', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: record
    });
  } else {
    throw new ApiError(400, 'Invalid fuel record data');
  }
});

export const updateFuelRecord = asyncHandler(async (req, res) => {
    const record = await FuelRecord.findById(req.params.id);

    if (record) {
        record.odometer = req.body.odometer || record.odometer;
        record.liters = req.body.liters || record.liters;
        record.pricePerLiter = req.body.pricePerLiter || record.pricePerLiter;
        record.fullTank = req.body.fullTank !== undefined ? req.body.fullTank : record.fullTank;
        record.date = req.body.date || record.date;
      
        if (req.body.liters || req.body.pricePerLiter) {
            record.totalCost = record.liters * record.pricePerLiter;
        }

        const updatedRecord = await record.save();
        await updatedRecord.populate('truck', 'registrationNumber brand model');
        await updatedRecord.populate('driver', 'firstName lastName');
        res.json({ success: true, data: updatedRecord });
    } else {
        throw new ApiError(404, 'Fuel record not found');
    }
});


export const deleteFuelRecord = asyncHandler(async (req, res) => {
    const record = await FuelRecord.findById(req.params.id);

    if (record) {
        await record.deleteOne();
        res.json({ success: true, message: 'Fuel record removed' });
    } else {
        throw new ApiError(404, 'Fuel record not found');
    }
});
