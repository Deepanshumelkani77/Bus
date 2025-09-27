const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  createTrip, 
  getDriverTrips, 
  startTrip, 
  completeTrip, 
  updateTripLocation, 
  getTripLocation,
  getActiveTrips,
  searchTrips,
  getTripDetails 
} = require('../controller/tripController');

// POST /trips/create
router.post('/create', authenticateToken, createTrip);

// GET /trips/driver/:driverId
router.get('/driver/:driverId', authenticateToken, getDriverTrips);

// PATCH /trips/:tripId/start
router.patch('/:tripId/start', authenticateToken, startTrip);

// PATCH /trips/:tripId/complete
router.patch('/:tripId/complete', authenticateToken, completeTrip);

// POST /trips/location
router.post('/location', authenticateToken, updateTripLocation);

// GET /trips/:tripId/location
router.get('/:tripId/location', getTripLocation);

// GET /trips/search?src=SRC&des=DES - Search trips by source and destination
router.get('/search', searchTrips);

// GET /trips/:id - Get trip details by ID
router.get('/:id', getTripDetails);

// GET /trips/active - Public endpoint for users to track buses
router.get('/active', getActiveTrips);

module.exports = router;
