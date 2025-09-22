const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  image:{type:String},
  city: { type: String, required: true }, // city of operation
  totalSeats: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // optional: assigned driver
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' }, // bus status
});

module.exports = mongoose.model('Bus', busSchema);
