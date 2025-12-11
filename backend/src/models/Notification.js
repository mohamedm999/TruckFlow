import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['TripAssigned', 'TripCompleted', 'MaintenanceDue', 'FuelAlert', 'System'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['Trip', 'Truck', 'Trailer', 'Maintenance']
    },
    entityId: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
