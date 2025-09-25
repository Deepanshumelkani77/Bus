const express = require('express');
const router = express.Router();
const { saveRoute, getDriverRoutes, deleteRoute } = require('../controller/routeController');
const { authenticateToken } = require('../middleware/auth');

// POST /routes/save - Save a new route
router.post('/save', authenticateToken, saveRoute);

// GET /routes/driver/:driverId - Get all routes for a driver
router.get('/driver/:driverId', authenticateToken, getDriverRoutes);

// DELETE /routes/:routeId - Delete a route
router.delete('/:routeId', authenticateToken, deleteRoute);

module.exports = router;
