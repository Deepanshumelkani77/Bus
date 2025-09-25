const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  sourceCoordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  destinationCoordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  routeDetails: {
    summary: {
      type: String,
      required: true
    },
    distance: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    distanceValue: {
      type: Number,
      required: true
    },
    durationValue: {
      type: Number,
      required: true
    },
    polyline: [{
      latitude: Number,
      longitude: Number
    }]
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better query performance
routeSchema.index({ driverId: 1, createdAt: -1 });
routeSchema.index({ status: 1 });

module.exports = mongoose.model('Route', routeSchema);
