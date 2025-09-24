const Bus = require('../models/Bus');
const Driver = require('../models/Driver');

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

// POST /buses/assign { busId, driverId }
async function assignBusToDriver(req, res) {
  try {
    const { busId, driverId } = req.body;
    if (!busId || !driverId) return res.status(400).json({ message: 'busId and driverId are required' });

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    // If the bus already has a driver, detach
    if (bus.driver && String(bus.driver) !== String(driverId)) {
      await Driver.updateOne({ _id: bus.driver }, { $unset: { activeBus: '' } });
    }

    // If the driver already has an activeBus, detach previous bus
    if (driver.activeBus && String(driver.activeBus) !== String(busId)) {
      await Bus.updateOne({ _id: driver.activeBus }, { $unset: { driver: '' } });
    }

    // Link both sides
    bus.driver = driver._id;
    await bus.save();

    driver.activeBus = bus._id;
    await driver.save();

    res.json({ message: 'Assigned', bus, driver });
  } catch (e) {
    console.error('Assign bus error', e);
    res.status(500).json({ message: 'Failed to assign bus' });
  }
}

module.exports.assignBusToDriver = assignBusToDriver;
