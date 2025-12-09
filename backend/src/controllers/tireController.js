
import asyncHandler from 'express-async-handler';
import Tire from '../models/Tire.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all tires
 * @route   GET /api/tires
 * @access  Private
 */
export const getTires = asyncHandler(async (req, res) => {
  const tires = await Tire.find({});
  res.json({ success: true, data: tires });
});

/**
 * @desc    Get single tire
 * @route   GET /api/tires/:id
 * @access  Private
 */
export const getTire = asyncHandler(async (req, res) => {
  const tire = await Tire.findById(req.params.id);

  if (tire) {
    res.json({ success: true, data: tire });
  } else {
    throw new ApiError(404, 'Tire not found');
  }
});

/**
 * @desc    Create a tire
 * @route   POST /api/tires
 * @access  Private/Admin
 */
export const createTire = asyncHandler(async (req, res) => {
  const { serialNumber, brand, size, status, vehicleType, vehicleId, mileageAtInstall, wearLevel } = req.body;

  const tireExists = await Tire.findOne({ serialNumber });

  if (tireExists) {
    throw new ApiError(400, 'Tire already exists');
  }

  const tire = await Tire.create({
    serialNumber,
    brand,
    size,
    status,
    vehicleType,
    vehicleId,
    mileageAtInstall,
    wearLevel
  });

  if (tire) {
    res.status(201).json({
      success: true,
      data: tire
    });
  } else {
    throw new ApiError(400, 'Invalid tire data');
  }
});

/**
 * @desc    Update a tire
 * @route   PUT /api/tires/:id
 * @access  Private/Admin
 */
export const updateTire = asyncHandler(async (req, res) => {
  const tire = await Tire.findById(req.params.id);

  if (tire) {
    tire.serialNumber = req.body.serialNumber || tire.serialNumber;
    tire.brand = req.body.brand || tire.brand;
    tire.size = req.body.size || tire.size;
    tire.status = req.body.status || tire.status;
    tire.vehicleType = req.body.vehicleType || tire.vehicleType;
    tire.vehicleId = req.body.vehicleId || tire.vehicleId;
    tire.mileageAtInstall = req.body.mileageAtInstall !== undefined ? req.body.mileageAtInstall : tire.mileageAtInstall;
    tire.wearLevel = req.body.wearLevel !== undefined ? req.body.wearLevel : tire.wearLevel;

    const updatedTire = await tire.save();

    res.json({
      success: true,
      data: updatedTire
    });
  } else {
    throw new ApiError(404, 'Tire not found');
  }
});

/**
 * @desc    Delete a tire
 * @route   DELETE /api/tires/:id
 * @access  Private/Admin
 */
export const deleteTire = asyncHandler(async (req, res) => {
  const tire = await Tire.findById(req.params.id);

  if (tire) {
    await tire.deleteOne();
    res.json({ success: true, message: 'Tire removed' });
  } else {
    throw new ApiError(404, 'Tire not found');
  }
});
