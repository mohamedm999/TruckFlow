
import asyncHandler from 'express-async-handler';
import FuelRecord from '../models/FuelRecord.js';
import Truck from '../models/Truck.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all fuel records
 * @route   GET /api/fuel
 * @access  Private
 */
export const getFuelRecords = asyncHandler(async (req, res) => {
  const records = await FuelRecord.find({})
    .populate('truck', 'registrationNumber brand model')
    .populate('driver', 'firstName lastName')
    .sort({ date: -1 });
  res.json({ success: true, data: records });
});

/**
 * @desc    Get single fuel record
 * @route   GET /api/fuel/:id
 * @access  Private
 */
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

/**
 * @desc    Create new fuel record
 * @route   POST /api/fuel
 * @access  Private
 */
export const createFuelRecord = asyncHandler(async (req, res) => {
  const { truck, date, odometer, liters, pricePerLiter, fullTank } = req.body;

  // Verify truck exists
  const truckDoc = await Truck.findById(truck);
  if (!truckDoc) {
    throw new ApiError(404, 'Truck not found');
  }

  // Calculate total cost
  const totalCost = liters * pricePerLiter;

  const record = await FuelRecord.create({
    truck,
    driver: req.user._id, // Assumes authMiddleware attaches user
    date,
    odometer,
    liters,
    pricePerLiter,
    totalCost,
    fullTank
  });

  if (record) {
    // Update truck odometer if this reading is higher
    if (odometer > truckDoc.currentOdometer) {
        truckDoc.currentOdometer = odometer;
        await truckDoc.save();
    }

    res.status(201).json({
      success: true,
      data: record
    });
  } else {
    throw new ApiError(400, 'Invalid fuel record data');
  }
});

/**
 * @desc    Update fuel record
 * @route   PUT /api/fuel/:id
 * @access  Private/Admin
 */
export const updateFuelRecord = asyncHandler(async (req, res) => {
    const record = await FuelRecord.findById(req.params.id);

    if (record) {
        // Allow updates
        record.odometer = req.body.odometer || record.odometer;
        record.liters = req.body.liters || record.liters;
        record.pricePerLiter = req.body.pricePerLiter || record.pricePerLiter;
        record.fullTank = req.body.fullTank !== undefined ? req.body.fullTank : record.fullTank;
        record.date = req.body.date || record.date;
        
        // Recalculate total cost if necessary
        if (req.body.liters || req.body.pricePerLiter) {
            record.totalCost = record.liters * record.pricePerLiter;
        }

        const updatedRecord = await record.save();
        res.json({ success: true, data: updatedRecord });
    } else {
        throw new ApiError(404, 'Fuel record not found');
    }
});

/**
 * @desc    Delete fuel record
 * @route   DELETE /api/fuel/:id
 * @access  Private/Admin
 */
export const deleteFuelRecord = asyncHandler(async (req, res) => {
    const record = await FuelRecord.findById(req.params.id);

    if (record) {
        await record.deleteOne();
        res.json({ success: true, message: 'Fuel record removed' });
    } else {
        throw new ApiError(404, 'Fuel record not found');
    }
});
