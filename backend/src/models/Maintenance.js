import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    enum: ['Truck', 'Trailer'],
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'vehicleType'
  },
  type: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date
  },
  cost: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

maintenanceSchema.index({ vehicleId: 1, scheduledDate: -1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
