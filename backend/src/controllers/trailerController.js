
import asyncHandler from 'express-async-handler';
import Trailer from '../models/Trailer.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all trailers
 * @route   GET /api/trailers
 * @access  Private
 */
export const getTrailers = asyncHandler(async (req, res) => {
  const trailers = await Trailer.find({});
  res.json({ success: true, data: trailers });
});

/**
 * @desc    Get single trailer
 * @route   GET /api/trailers/:id
 * @access  Private
 */
export const getTrailer = asyncHandler(async (req, res) => {
  const trailer = await Trailer.findById(req.params.id);

  if (trailer) {
    res.json({ success: true, data: trailer });
  } else {
    throw new ApiError(404, 'Trailer not found');
  }
});

/**
 * @desc    Create a trailer
 * @route   POST /api/trailers
 * @access  Private/Admin
 */
export const createTrailer = asyncHandler(async (req, res) => {
  const { registrationNumber, type, capacity, status } = req.body;

  const trailerExists = await Trailer.findOne({ registrationNumber });

  if (trailerExists) {
    throw new ApiError(400, 'Trailer already exists');
  }

  const trailer = await Trailer.create({
    registrationNumber,
    type,
    capacity,
    status
  });

  if (trailer) {
    res.status(201).json({
      success: true,
      data: trailer
    });
  } else {
    throw new ApiError(400, 'Invalid trailer data');
  }
});

/**
 * @desc    Update a trailer
 * @route   PUT /api/trailers/:id
 * @access  Private/Admin
 */
export const updateTrailer = asyncHandler(async (req, res) => {
  const trailer = await Trailer.findById(req.params.id);

  if (trailer) {
    trailer.registrationNumber = req.body.registrationNumber || trailer.registrationNumber;
    trailer.type = req.body.type || trailer.type;
    trailer.capacity = req.body.capacity || trailer.capacity;
    trailer.status = req.body.status || trailer.status;

    const updatedTrailer = await trailer.save();

    res.json({
      success: true,
      data: updatedTrailer
    });
  } else {
    throw new ApiError(404, 'Trailer not found');
  }
});

/**
 * @desc    Delete a trailer
 * @route   DELETE /api/trailers/:id
 * @access  Private/Admin
 */
export const deleteTrailer = asyncHandler(async (req, res) => {
  const trailer = await Trailer.findById(req.params.id);

  if (trailer) {
    await trailer.deleteOne();
    res.json({ success: true, message: 'Trailer removed' });
  } else {
    throw new ApiError(404, 'Trailer not found');
  }
});
