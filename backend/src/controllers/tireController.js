
import asyncHandler from 'express-async-handler';
import Tire from '../models/Tire.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export const getTires = asyncHandler(async (req, res) => {
  const tires = await Tire.find({}).populate('vehicleId', 'registrationNumber brand model type');
  res.json({ success: true, data: tires });
});

export const getTire = asyncHandler(async (req, res) => {
  const tire = await Tire.findById(req.params.id).populate('vehicleId', 'registrationNumber brand model type');

  if (tire) {
    res.json({ success: true, data: tire });
  } else {
    throw new ApiError(404, 'Tire not found');
  }
});


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
    await tire.populate('vehicleId', 'registrationNumber brand model type');
    res.status(201).json({
      success: true,
      data: tire
    });
  } else {
    throw new ApiError(400, 'Invalid tire data');
  }
});

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
    await updatedTire.populate('vehicleId', 'registrationNumber brand model type');

    res.json({
      success: true,
      data: updatedTire
    });
  } else {
    throw new ApiError(404, 'Tire not found');
  }
});

export const deleteTire = asyncHandler(async (req, res) => {
  const tire = await Tire.findById(req.params.id);

  if (tire) {
    await tire.deleteOne();
    res.json({ success: true, message: 'Tire removed' });
  } else {
    throw new ApiError(404, 'Tire not found');
  }
});
