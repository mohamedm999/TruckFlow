
import mongoose from 'mongoose';

const fuelRecordSchema = new mongoose.Schema({
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    // Not required strictly as a fuel fill might happen outside a specific trip context or before trip management is implemented
    required: false
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  odometer: {
    type: Number,
    required: true
  },
  liters: {
    type: Number,
    required: true
  },
  pricePerLiter: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  fullTank: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const FuelRecord = mongoose.model('FuelRecord', fuelRecordSchema);

export default FuelRecord;
