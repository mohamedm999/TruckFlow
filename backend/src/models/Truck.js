
import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'OutOfService'],
    default: 'Active'
  },
  currentOdometer: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Truck = mongoose.model('Truck', truckSchema);

export default Truck;
