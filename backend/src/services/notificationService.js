import Notification from '../models/Notification.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import logger from '../config/logger.js';

export const createNotification = async (userId, type, message, relatedEntity = null) => {
  try {
    await Notification.create({ userId, type, message, relatedEntity });
  } catch (error) {
    logger.error('Failed to create notification:', error);
  }
};

export const notifyTripAssigned = async (tripId, chauffeurId) => {
  try {
    const trip = await Trip.findById(tripId).populate('truckId', 'registrationNumber');
    if (trip) {
      await createNotification(
        chauffeurId,
        'TripAssigned',
        `You have been assigned to trip from ${trip.origin} to ${trip.destination}`,
        { entityType: 'Trip', entityId: tripId }
      );
    }
  } catch (error) {
    logger.error('Failed to notify trip assigned:', error);
  }
};

export const notifyTripCompleted = async (tripId) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const trip = await Trip.findById(tripId);
    if (trip) {
      for (const admin of admins) {
        await createNotification(
          admin._id,
          'TripCompleted',
          `Trip from ${trip.origin} to ${trip.destination} has been completed`,
          { entityType: 'Trip', entityId: tripId }
        );
      }
    }
  } catch (error) {
    logger.error('Failed to notify trip completed:', error);
  }
};

export const notifyMaintenanceDue = async (maintenanceId, vehicleType, vehicleReg) => {
  try {
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        'MaintenanceDue',
        `Maintenance scheduled for ${vehicleType} ${vehicleReg}`,
        { entityType: 'Maintenance', entityId: maintenanceId }
      );
    }
  } catch (error) {
    logger.error('Failed to notify maintenance due:', error);
  }
};
