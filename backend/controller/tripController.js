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

// GET /trips/driver/:driverId
async function getDriverTrips(req, res) {
  try {
    const { driverId } = req.params;
    
    const trips = await Trip.find({ driver: driverId })
      .populate('bus', 'busNumber totalSeats')
      .populate('driver', 'name')
      .sort({ startTime: -1 });

    return res.json({ trips });
  } catch (e) {
    console.error('Get driver trips error', e);
    res.status(500).json({ message: 'Failed to get trips' });
  }
}

// PATCH /trips/:tripId/start
async function startTrip(req, res) {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    if (trip.status !== 'Pending') {
      return res.status(400).json({ message: 'Trip cannot be started' });
    }

    trip.status = 'Ongoing';
    trip.startTime = new Date();
    await trip.save();

    return res.json({ message: 'Trip started', trip });
  } catch (e) {
    console.error('Start trip error', e);
    res.status(500).json({ message: 'Failed to start trip' });
  }
}

// PATCH /trips/:tripId/complete
async function completeTrip(req, res) {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    if (trip.status !== 'Ongoing') {
      return res.status(400).json({ message: 'Trip cannot be completed' });
    }

    trip.status = 'Completed';
    trip.endTime = new Date();
    await trip.save();

    return res.json({ message: 'Trip completed', trip });
  } catch (e) {
    console.error('Complete trip error', e);
    res.status(500).json({ message: 'Failed to complete trip' });
  }
}

// POST /trips/location
// body: { tripId, location: { latitude, longitude, timestamp, speed?, heading? } }
async function updateTripLocation(req, res) {
  try {
    const { tripId, location } = req.body;
    
    if (!tripId || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: 'tripId and location coordinates are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    if (trip.status !== 'Ongoing') {
      return res.status(400).json({ message: 'Trip is not ongoing' });
    }

    // Update trip with current location
    trip.currentLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp || Date.now(),
      speed: location.speed || 0,
      heading: location.heading || 0,
    };
    
    // Add to location history (keep last 100 locations)
    if (!trip.locationHistory) trip.locationHistory = [];
    trip.locationHistory.push(trip.currentLocation);
    
    // Keep only last 100 locations to prevent document size issues
    if (trip.locationHistory.length > 100) {
      trip.locationHistory = trip.locationHistory.slice(-100);
    }
    
    await trip.save();

    return res.json({ message: 'Location updated', currentLocation: trip.currentLocation });
  } catch (e) {
    console.error('Update location error', e);
    res.status(500).json({ message: 'Failed to update location' });
  }
}

// GET /trips/:tripId/location
async function getTripLocation(req, res) {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findById(tripId).select('currentLocation status');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    return res.json({ 
      currentLocation: trip.currentLocation,
      status: trip.status 
    });
  } catch (e) {
    console.error('Get trip location error', e);
    res.status(500).json({ message: 'Failed to get trip location' });
  }
}

// GET /trips/active - Get all active trips for users to track
async function getActiveTrips(req, res) {
  try {
    const trips = await Trip.find({ status: 'Ongoing' })
      .populate('bus', 'busNumber')
      .populate('driver', 'name')
      .select('source destination currentLocation bus driver startTime');

    return res.json({ trips });
  } catch (e) {
    console.error('Get active trips error', e);
    res.status(500).json({ message: 'Failed to get active trips' });
  }
}

module.exports = { 
  createTrip, 
  getDriverTrips, 
  startTrip, 
  completeTrip, 
  updateTripLocation, 
  getTripLocation,
  getActiveTrips 
};
