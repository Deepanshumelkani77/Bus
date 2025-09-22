const Bus = require('../models/Bus');

// GET /buses?city=Jaipur
async function listBuses(req, res) {
  try {
    const { city } = req.query;
    const query = city ? { city } : {};
    const buses = await Bus.find(query).sort({ createdAt: -1 });
    res.json({ buses });
  } catch (e) {
    console.error('List buses error', e);
    res.status(500).json({ message: 'Failed to fetch buses' });
  }
}

// GET /buses/cities -> distinct list
async function listCities(req, res) {
  try {
    const cities = await Bus.distinct('city');
    res.json({ cities });
  } catch (e) {
    console.error('List cities error', e);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
}

module.exports = { listBuses, listCities };

// POST /buses/seed (dev helper)
async function seedBuses(req, res) {
  try {
    const count = await Bus.countDocuments();
    if (count > 0) return res.json({ message: 'Buses already exist', inserted: 0 });
    const now = Date.now();
    const docs = [
      {
        busNumber: '101',
        city: 'Jaipur',
        totalSeats: 40,
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?q=80&w=1600&auto=format&fit=crop',
        createdAt: now,
      },
      {
        busNumber: '102',
        city: 'Delhi',
        totalSeats: 36,
        status: 'Inactive',
        image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
        createdAt: now - 1000,
      },
      {
        busNumber: '103',
        city: 'Mumbai',
        totalSeats: 48,
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=1600&auto=format&fit=crop',
        createdAt: now - 2000,
      },
    ];
    const inserted = await Bus.insertMany(docs);
    res.json({ message: 'Seeded', inserted: inserted.length });
  } catch (e) {
    console.error('Seed buses error', e);
    res.status(500).json({ message: 'Failed to seed buses' });
  }
}

module.exports.seedBuses = seedBuses;
