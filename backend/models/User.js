const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  city: { type: String, required: true },
  profilePicture: { type: String },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  favoriteRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
  bookingHistory: [{
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
