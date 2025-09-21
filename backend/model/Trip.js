const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  city: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  route: [{ lat: Number, lng: Number }], // array of coordinates for selected route
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  totalSeats: { type: Number, required: true },
  occupiedSeats: { type: Number, default: 0 }, // update as users book seats
  status: { type: String, enum: ['Pending', 'Ongoing', 'Completed'], default: 'Pending' },
});

module.exports = mongoose.model('Trip', tripSchema);
