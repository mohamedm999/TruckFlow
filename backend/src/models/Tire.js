
import mongoose from 'mongoose';

const tireSchema = new mongoose.Schema({
  serialNumber: {
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
  size: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'InStorage', 'Scrapped'],
    default: 'Active'
  },
  vehicleType: {
    type: String,
    enum: ['Truck', 'Trailer'],
    required: false
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'vehicleType',
    required: false
  },
  mileageAtInstall: {
    type: Number,
    default: 0
  },
  wearLevel: {
    type: Number, // Percentage 0-100 or thread depth
    default: 100
  }
}, {
  timestamps: true
});

const Tire = mongoose.model('Tire', tireSchema);

export default Tire;
