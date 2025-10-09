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
  getAllTrips 
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

// GET /trips/active - Public endpoint for users to track buses
router.get('/active', getActiveTrips);

// GET /trips - Admin endpoint to get all trips
router.get('/', getAllTrips);

module.exports = router;
