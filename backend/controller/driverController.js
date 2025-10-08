const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');

// GET /drivers?city=Jaipur&q=john
async function listDrivers(req, res) {
  try {
    const { city, q } = req.query;
    const query = {};
    if (city) query.city = city;
    if (q) {
      const term = String(q).trim();
      if (term) {
        query.$or = [
          { name: { $regex: term, $options: 'i' } },
          { email: { $regex: term, $options: 'i' } },
        ];
      }
    }
    const drivers = await Driver.find(query).sort({ createdAt: -1 }).populate('activeBus');
    res.json({ drivers });
  } catch (e) {
    console.error('List drivers error', e);
    res.status(500).json({ message: 'Failed to fetch drivers' });
  }
}

// GET /drivers/cities -> distinct list
async function listDriverCities(req, res) {
  try {
    const cities = await Driver.distinct('city');
    res.json({ cities });
  } catch (e) {
    console.error('List driver cities error', e);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
}

// POST /drivers
async function createDriver(req, res) {
  try {
    const { name, email, password, city, image } = req.body || {};
    if (!name || !email || !password || !city) {
      return res.status(400).json({ message: 'name, email, password and city are required' });
    }
    const exists = await Driver.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const driver = await Driver.create({ name, email, password: hashed, city, image });
    res.status(201).json({ driver });
  } catch (e) {
    console.error('Create driver error', e);
    res.status(500).json({ message: 'Failed to create driver' });
  }
}

// PUT /drivers/:id
async function updateDriver(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, city, image } = req.body || {};
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (city) update.city = city;
    if (typeof image !== 'undefined') update.image = image;
    if (password) update.password = await bcrypt.hash(password, 10);
    const driver = await Driver.findByIdAndUpdate(id, update, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ driver });
  } catch (e) {
    console.error('Update driver error', e);
    res.status(500).json({ message: 'Failed to update driver' });
  }
}

// DELETE /drivers/:id
async function deleteDriver(req, res) {
  try {
    const { id } = req.params;
    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Deleted', id });
  } catch (e) {
    console.error('Delete driver error', e);
    res.status(500).json({ message: 'Failed to delete driver' });
  }
}

module.exports = {
  listDrivers,
  listDriverCities,
  createDriver,
  updateDriver,
  deleteDriver,
};
