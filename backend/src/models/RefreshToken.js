import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Delete all tokens for a user (logout all devices)
refreshTokenSchema.statics.revokeAllUserTokens = async function(userId) {
  return this.deleteMany({ user: userId });
};

// Check if token is valid and not expired
refreshTokenSchema.statics.findValidToken = async function(token) {
  return this.findOne({ 
    token,
    expiresAt: { $gt: new Date() }
  }).populate('user');
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
