const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true }, // driver is assigned to one city
  activeBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }, // bus selected by driver
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Driver', driverSchema);
