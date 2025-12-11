import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  truckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  trailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trailer'
  },
  chauffeurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Planned', 'InProgress', 'Completed', 'Cancelled'],
    default: 'Planned'
  },
  plannedDeparture: Date,
  actualDeparture: Date,
  actualArrival: Date,
  mileageStart: Number,
  mileageEnd: Number,
  notes: String
}, {
  timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
