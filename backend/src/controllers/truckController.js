
import asyncHandler from 'express-async-handler';
import Truck from '../models/Truck.js';
import { ApiError } from '../middleware/errorMiddleware.js';


export const getTrucks = asyncHandler(async (req, res) => {
  const trucks = await Truck.find({});
  res.json({ success: true, data: trucks });
});

export const getTruck = asyncHandler(async (req, res) => {
  const truck = await Truck.findById(req.params.id);

  if (truck) {
    res.json({ success: true, data: truck });
  } else {
    throw new ApiError(404, 'Truck not found');
  }
});

export const createTruck = asyncHandler(async (req, res) => {
  const { registrationNumber, brand, model, year, status, currentOdometer } = req.body;

  const truckExists = await Truck.findOne({ registrationNumber });

  if (truckExists) {
    throw new ApiError(400, 'Truck already exists');
  }

  const truck = await Truck.create({
    registrationNumber,
    brand,
    model,
    year,
    status,
    currentOdometer
  });

  if (truck) {
    res.status(201).json({
      success: true,
      data: truck
    });
  } else {
    throw new ApiError(400, 'Invalid truck data');
  }
});


export const updateTruck = asyncHandler(async (req, res) => {
  const truck = await Truck.findById(req.params.id);

  if (truck) {
    truck.registrationNumber = req.body.registrationNumber || truck.registrationNumber;
    truck.brand = req.body.brand || truck.brand;
    truck.model = req.body.model || truck.model;
    truck.year = req.body.year || truck.year;
    truck.status = req.body.status || truck.status;
    
    if (req.body.currentOdometer !== undefined) {
        truck.currentOdometer = req.body.currentOdometer;
    }

    const updatedTruck = await truck.save();

    res.json({
      success: true,
      data: updatedTruck
    });
  } else {
    throw new ApiError(404, 'Truck not found');
  }
});

export const deleteTruck = asyncHandler(async (req, res) => {
  const truck = await Truck.findById(req.params.id);

  if (truck) {
    await truck.deleteOne();
    res.json({ success: true, message: 'Truck removed' });
  } else {
    throw new ApiError(404, 'Truck not found');
  }
});
