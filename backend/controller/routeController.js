const Route = require('../models/Route');
const Driver = require('../models/Driver');

// Save a new route
const saveRoute = async (req, res) => {
  try {
    const {
      driverId,
      source,
      destination,
      sourceCoords,
      destinationCoords,
      selectedRoute
    } = req.body;

    // Validate required fields
    if (!driverId || !source || !destination || !sourceCoords || !destinationCoords || !selectedRoute) {
      return res.status(400).json({ 
        message: 'All fields are required: driverId, source, destination, sourceCoords, destinationCoords, selectedRoute' 
      });
    }

    // Verify driver exists
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Create new route
    const newRoute = new Route({
      driverId,
      source,
      destination,
      sourceCoordinates: {
        latitude: sourceCoords.lat,
        longitude: sourceCoords.lng
      },
      destinationCoordinates: {
        latitude: destinationCoords.lat,
        longitude: destinationCoords.lng
      },
      routeDetails: {
        summary: selectedRoute.summary,
        distance: selectedRoute.distance,
        duration: selectedRoute.duration,
        distanceValue: selectedRoute.distanceValue,
        durationValue: selectedRoute.durationValue,
        polyline: selectedRoute.polyline
      },
      status: 'active',
      createdAt: new Date()
    });

    const savedRoute = await newRoute.save();

    res.status(200).json({
      message: 'Route saved successfully',
      route: savedRoute
    });

  } catch (error) {
    console.error('Save route error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get all routes for a driver
const getDriverRoutes = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status, limit = 10, page = 1 } = req.query;

    // Build query
    const query = { driverId };
    if (status) {
      query.status = status;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get routes with pagination
    const routes = await Route.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('driverId', 'name email');

    // Get total count for pagination
    const totalRoutes = await Route.countDocuments(query);

    res.status(200).json({
      routes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRoutes / limit),
        totalRoutes,
        hasMore: skip + routes.length < totalRoutes
      }
    });

  } catch (error) {
    console.error('Get driver routes error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete a route
const deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { driverId } = req.body; // Get from authenticated user or request body

    // Find and verify route ownership
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Check if the route belongs to the driver (if driverId is provided)
    if (driverId && route.driverId.toString() !== driverId) {
      return res.status(403).json({ message: 'Unauthorized to delete this route' });
    }

    // Delete the route
    await Route.findByIdAndDelete(routeId);

    res.status(200).json({
      message: 'Route deleted successfully',
      deletedRouteId: routeId
    });

  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = {
  saveRoute,
  getDriverRoutes,
  deleteRoute
};
