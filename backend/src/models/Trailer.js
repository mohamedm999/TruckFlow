
import mongoose from 'mongoose';

const trailerSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'OutOfService'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Trailer = mongoose.model('Trailer', trailerSchema);

export default Trailer;
