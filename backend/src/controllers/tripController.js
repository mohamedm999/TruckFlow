import asyncHandler from 'express-async-handler';
import Trip from '../models/Trip.js';
import Truck from '../models/Truck.js';
import Trailer from '../models/Trailer.js';
import User from '../models/User.js';
import FuelRecord from '../models/FuelRecord.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { generateTripPDF } from '../services/pdfService.js';

export const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({})
    .populate('truckId', 'registrationNumber brand model')
    .populate('trailerId', 'registrationNumber type')
    .populate('chauffeurId', 'firstName lastName');
  res.json({ success: true, data: trips });
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate('truckId', 'registrationNumber brand model')
    .populate('trailerId', 'registrationNumber type')
    .populate('chauffeurId', 'firstName lastName');

  if (trip) {
    res.json({ success: true, data: trip });
  } else {
    throw new ApiError(404, 'Trip not found');
  }
});

export const createTrip = asyncHandler(async (req, res) => {
  const { tripId, truckId, trailerId, chauffeurId, origin, destination, plannedDeparture, mileageStart, notes } = req.body;

  const truckExists = await Truck.findById(truckId);
  if (!truckExists) {
    throw new ApiError(404, 'Truck not found');
  }

  // Check truck availability
  if (plannedDeparture) {
    const conflictingTrip = await Trip.findOne({
      truckId,
      status: { $in: ['Planned', 'InProgress'] },
      plannedDeparture: {
        $gte: new Date(plannedDeparture).setHours(0, 0, 0, 0),
        $lt: new Date(plannedDeparture).setHours(23, 59, 59, 999)
      }
    });
    if (conflictingTrip) {
      throw new ApiError(400, 'Truck is already assigned to another trip on this date');
    }
  }

  if (trailerId) {
    const trailerExists = await Trailer.findById(trailerId);
    if (!trailerExists) {
      throw new ApiError(404, 'Trailer not found');
    }
  }

  const chauffeurExists = await User.findById(chauffeurId);
  if (!chauffeurExists) {
    throw new ApiError(404, 'Chauffeur not found');
  }

  const tripExists = await Trip.findOne({ tripId });
  if (tripExists) {
    throw new ApiError(400, 'Trip ID already exists');
  }

  const trip = await Trip.create({
    tripId, truckId, trailerId, chauffeurId, origin, destination, plannedDeparture, mileageStart, notes, status: 'Planned'
  });

  if (trip) {
    res.status(201).json({ success: true, data: trip });
  } else {
    throw new ApiError(400, 'Invalid trip data');
  }
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (trip) {
    if (req.body.origin) trip.origin = req.body.origin;
    if (req.body.destination) trip.destination = req.body.destination;
    if (req.body.notes) trip.notes = req.body.notes;
    
    if (req.body.status) {
      trip.status = req.body.status;
      if (req.body.status === 'Completed' && req.body.mileageEnd) {
        trip.mileageEnd = req.body.mileageEnd;
      }
    }
    
    if (req.body.truckId) trip.truckId = req.body.truckId;
    if (req.body.trailerId !== undefined) trip.trailerId = req.body.trailerId;
    if (req.body.chauffeurId) trip.chauffeurId = req.body.chauffeurId;

    const updatedTrip = await trip.save();
    res.json({ success: true, data: updatedTrip });
  } else {
    throw new ApiError(404, 'Trip not found');
  }
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (trip) {
    await trip.deleteOne();
    res.json({ success: true, message: 'Trip removed' });
  } else {
    throw new ApiError(404, 'Trip not found');
  }
});

export const getMyTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ chauffeurId: req.user._id })
    .populate('truckId', 'registrationNumber brand model')
    .populate('trailerId', 'registrationNumber type')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: trips });
});

export const updateTripStatus = asyncHandler(async (req, res) => {
  const { status, mileageEnd } = req.body;
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    throw new ApiError(404, 'Trip not found');
  }

  if (trip.chauffeurId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this trip');
  }

  trip.status = status;
  
  // Auto-track dates based on status
  if (status === 'InProgress' && !trip.actualDeparture) {
    trip.actualDeparture = Date.now();
  }
  
  if (status === 'Completed') {
    if (!trip.actualArrival) {
      trip.actualArrival = Date.now();
    }
    if (mileageEnd) {
      trip.mileageEnd = mileageEnd;
    }
  }

  const updatedTrip = await trip.save();
  res.json({ success: true, data: updatedTrip });
});

export const generateTripPDFReport = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate('truckId', 'registrationNumber brand model')
    .populate('trailerId', 'registrationNumber type')
    .populate('chauffeurId', 'firstName lastName');

  if (!trip) {
    throw new ApiError(404, 'Trip not found');
  }

  const fuelRecords = await FuelRecord.find({ truck: trip.truckId._id }).sort({ date: 1 });
  const doc = generateTripPDF(trip, fuelRecords);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=trip-${trip.tripId}.pdf`);

  doc.pipe(res);
  doc.end();
});

export const updateTripMileage = asyncHandler(async (req, res) => {
  const { mileageStart, mileageEnd } = req.body;
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    throw new ApiError(404, 'Trip not found');
  }

  if (trip.chauffeurId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this trip');
  }

  if (mileageStart !== undefined) trip.mileageStart = mileageStart;
  if (mileageEnd !== undefined) trip.mileageEnd = mileageEnd;

  const updatedTrip = await trip.save();
  res.json({ success: true, data: updatedTrip });
});
