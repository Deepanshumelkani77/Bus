const Trip = require('../models/Trip');
const Bus = require('../models/Bus');
const Driver = require('../models/Driver');

// POST /trips/create
// body: { busId, driverId, source, destination, sourceCoords?: {lat,lng}, destinationCoords?: {lat,lng} }
async function createTrip(req, res) {
  try {
    const { busId, driverId, source, destination, sourceCoords, destinationCoords } = req.body;
    if (!busId || !driverId || !source || !destination) {
      return res.status(400).json({ message: 'busId, driverId, source and destination are required' });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    const city = bus.city || driver.city;

    const route = [];
    if (sourceCoords && typeof sourceCoords.lat === 'number' && typeof sourceCoords.lng === 'number') route.push(sourceCoords);
    if (destinationCoords && typeof destinationCoords.lat === 'number' && typeof destinationCoords.lng === 'number') route.push(destinationCoords);

    const trip = await Trip.create({
      bus: bus._id,
      driver: driver._id,
      city,
      source,
      destination,
      route,
      totalSeats: bus.totalSeats,
      status: 'Pending',
    });

    return res.json({ message: 'Trip created', trip });
  } catch (e) {
    console.error('Create trip error', e);
    res.status(500).json({ message: 'Failed to create trip' });
  }
}

module.exports = { createTrip };
