const express = require("express");
const axios = require("axios");
const Trip = require("../models/Trip");
const Bus = require("../models/Bus");
const { decode } = require("@googlemaps/polyline-codec");

const router = express.Router();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Middleware to check if Google API key is configured
const checkGoogleApiKey = (req, res, next) => {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ 
      message: "Google API key not configured",
      error: "GOOGLE_API_KEY environment variable is not set"
    });
  }
  next();
};

// Apply middleware to all routes
router.use(checkGoogleApiKey);

// Utility function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Check if a point lies on or near a route polyline with improved algorithm
function isPointOnRoute(userLat, userLng, routePolyline, bufferKm = 1) {
  const decodedPath = decode(routePolyline);
  
  for (let i = 0; i < decodedPath.length; i++) {
    const [routeLat, routeLng] = decodedPath[i];
    const distance = calculateDistance(userLat, userLng, routeLat, routeLng);
    
    if (distance <= bufferKm) {
      return true;
    }
  }
  return false;
}

// Check if user's journey (source to destination) lies within the bus route
function isJourneyOnRoute(userSrcLat, userSrcLng, userDestLat, userDestLng, routePolyline, bufferKm = 1.5) {
  const decodedPath = decode(routePolyline);
  
  let sourceIndex = -1;
  let destIndex = -1;
  let minSourceDist = Infinity;
  let minDestDist = Infinity;
  
  // Find closest points on route for source and destination
  for (let i = 0; i < decodedPath.length; i++) {
    const [routeLat, routeLng] = decodedPath[i];
    
    const sourceDist = calculateDistance(userSrcLat, userSrcLng, routeLat, routeLng);
    const destDist = calculateDistance(userDestLat, userDestLng, routeLat, routeLng);
    
    if (sourceDist < minSourceDist && sourceDist <= bufferKm) {
      minSourceDist = sourceDist;
      sourceIndex = i;
    }
    
    if (destDist < minDestDist && destDist <= bufferKm) {
      minDestDist = destDist;
      destIndex = i;
    }
  }
  
  // Both points should be on route and destination should come after source
  return sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex;
}

// Calculate precise ETA considering traffic and route optimization
async function calculatePreciseETA(busLat, busLng, userLat, userLng) {
  try {
    const etaResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: `${busLat},${busLng}`,
          destination: `${userLat},${userLng}`,
          key: GOOGLE_API_KEY,
          mode: "driving",
          departure_time: "now",
          traffic_model: "best_guess",
          avoid: "tolls", // Buses typically avoid tolls
        },
      }
    );

    if (etaResponse.data.status === 'OK' && etaResponse.data.routes.length > 0) {
      const leg = etaResponse.data.routes[0].legs[0];
      return {
        duration: leg.duration,
        distance: leg.distance,
        duration_in_traffic: leg.duration_in_traffic || leg.duration,
        steps: leg.steps.length,
        polyline: etaResponse.data.routes[0].overview_polyline.points
      };
    }
    return null;
  } catch (error) {
    console.error('ETA calculation error:', error.message);
    return null;
  }
}

// Calculate how well user's journey matches the bus route (0-100 score)
function calculateRouteMatchScore(userSrcLat, userSrcLng, userDestLat, userDestLng, routePolyline) {
  const decodedPath = decode(routePolyline);
  
  let sourceDistance = Infinity;
  let destDistance = Infinity;
  let sourceIndex = -1;
  let destIndex = -1;
  
  // Find closest points and their distances
  for (let i = 0; i < decodedPath.length; i++) {
    const [routeLat, routeLng] = decodedPath[i];
    
    const srcDist = calculateDistance(userSrcLat, userSrcLng, routeLat, routeLng);
    const destDist = calculateDistance(userDestLat, userDestLng, routeLat, routeLng);
    
    if (srcDist < sourceDistance) {
      sourceDistance = srcDist;
      sourceIndex = i;
    }
    
    if (destDist < destDistance) {
      destDistance = destDist;
      destIndex = i;
    }
  }
  
  // Calculate score based on proximity and route order
  const maxDistance = 2; // 2km max acceptable distance
  const proximityScore = Math.max(0, (maxDistance - Math.max(sourceDistance, destDistance)) / maxDistance) * 60;
  const orderScore = (sourceIndex < destIndex && sourceIndex !== -1 && destIndex !== -1) ? 40 : 0;
  
  return Math.round(proximityScore + orderScore);
}

// Find trips that match user's source and destination
router.post("/find-matching-trips", async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng, sourceAddress, destAddress } = req.body;

    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      return res.status(400).json({ message: "Missing coordinates" });
    }

    // Get all ongoing trips created by drivers (no dummy data)
    const trips = await Trip.find({ 
      status: 'Ongoing',
      driver: { $exists: true, $ne: null }, // Ensure trip has a real driver
      bus: { $exists: true, $ne: null }     // Ensure trip has a real bus
    }).populate('bus', 'busNumber plateNumber').populate('driver', 'name phone');

    const matchingTrips = [];

    for (const trip of trips) {
      try {
        // Get the bus route using Google Directions API
        const directionsResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/directions/json",
          {
            params: {
              origin: trip.source,
              destination: trip.destination,
              key: GOOGLE_API_KEY,
              mode: "driving",
            },
          }
        );

        if (directionsResponse.data.status === 'OK' && directionsResponse.data.routes.length > 0) {
          const route = directionsResponse.data.routes[0];
          const polyline = route.overview_polyline.points;

          // Check if user's journey lies within the bus route (improved algorithm)
          const journeyOnRoute = isJourneyOnRoute(sourceLat, sourceLng, destLat, destLng, polyline, 1.5);

          if (journeyOnRoute) {
            // Calculate precise ETA to user's source ONLY if bus has current location
            let eta = null;
            let etaToDestination = null;
            
            if (trip.currentLocation && trip.currentLocation.latitude && trip.currentLocation.longitude) {
              // ETA to user's pickup point from current bus location
              eta = await calculatePreciseETA(
                trip.currentLocation.latitude,
                trip.currentLocation.longitude,
                sourceLat,
                sourceLng
              );

              // ETA to user's destination (for journey planning)
              etaToDestination = await calculatePreciseETA(
                trip.currentLocation.latitude,
                trip.currentLocation.longitude,
                destLat,
                destLng
              );
            } else {
              // If no current location, calculate ETA from trip source
              eta = await calculatePreciseETA(
                trip.sourceCoords?.latitude || sourceLat,
                trip.sourceCoords?.longitude || sourceLng,
                sourceLat,
                sourceLng
              );
            }

            // Calculate route match score (how well the user's journey fits the bus route)
            const routeMatchScore = calculateRouteMatchScore(sourceLat, sourceLng, destLat, destLng, polyline);

            matchingTrips.push({
              tripId: trip._id,
              bus: trip.bus,
              driver: trip.driver,
              source: trip.source,
              destination: trip.destination,
              currentLocation: trip.currentLocation,
              totalSeats: trip.totalSeats || trip.bus?.totalSeats || 40,
              occupiedSeats: trip.occupiedSeats || 0,
              availableSeats: (trip.totalSeats || trip.bus?.totalSeats || 40) - (trip.occupiedSeats || 0),
              eta: eta,
              etaToDestination: etaToDestination,
              routePolyline: polyline,
              routeMatchScore: routeMatchScore,
              status: trip.status,
              userPickupPoint: { lat: sourceLat, lng: sourceLng, address: sourceAddress },
              userDropPoint: { lat: destLat, lng: destLng, address: destAddress },
              hasLiveLocation: !!(trip.currentLocation && trip.currentLocation.latitude),
              createdByDriver: true // Flag to indicate this is a real driver-created trip
            });
          }
        }
      } catch (error) {
        console.error(`Error processing trip ${trip._id}:`, error.message);
        continue;
      }
    }

    // Sort trips by relevance (route match score) and ETA
    matchingTrips.sort((a, b) => {
      // First priority: route match score (higher is better)
      if (b.routeMatchScore !== a.routeMatchScore) {
        return b.routeMatchScore - a.routeMatchScore;
      }
      
      // Second priority: ETA (lower is better)
      const aETA = a.eta?.duration?.value || Infinity;
      const bETA = b.eta?.duration?.value || Infinity;
      return aETA - bETA;
    });

    res.json({
      matchingTrips,
      userSource: { lat: sourceLat, lng: sourceLng, address: sourceAddress },
      userDestination: { lat: destLat, lng: destLng, address: destAddress },
      totalFound: matchingTrips.length,
      searchTimestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Find matching trips error:", error.message);
    res.status(500).json({ message: "Error finding matching trips", error: error.message });
  }
});

// Get real-time ETA for a specific trip to user's location
router.get("/eta/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { userLat, userLng } = req.query;

    if (!userLat || !userLng) {
      return res.status(400).json({ message: "Missing user coordinates" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (!trip.currentLocation) {
      return res.status(400).json({ message: "Bus location not available" });
    }

    // Calculate precise ETA from current bus location to user location
    const eta = await calculatePreciseETA(
      trip.currentLocation.latitude,
      trip.currentLocation.longitude,
      parseFloat(userLat),
      parseFloat(userLng)
    );

    if (eta) {
      res.json({
        eta: {
          duration: eta.duration,
          distance: eta.distance,
          duration_in_traffic: eta.duration_in_traffic,
          steps: eta.steps,
          polyline: eta.polyline
        },
        busLocation: trip.currentLocation,
        tripId: trip._id,
        lastUpdated: new Date().toISOString()
      });
    } else {
      res.status(400).json({ message: "Could not calculate ETA" });
    }

  } catch (error) {
    console.error("ETA calculation error:", error.message);
    res.status(500).json({ message: "Error calculating ETA", error: error.message });
  }
});

// Update trip location (called by driver app)
router.put("/update-location/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { latitude, longitude, speed, heading } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const locationUpdate = {
      latitude,
      longitude,
      timestamp: Date.now(),
      speed: speed || 0,
      heading: heading || 0
    };

    // Update current location and add to history
    trip.currentLocation = locationUpdate;
    trip.locationHistory.push(locationUpdate);

    // Keep only last 100 location points to avoid excessive storage
    if (trip.locationHistory.length > 100) {
      trip.locationHistory = trip.locationHistory.slice(-100);
    }

    await trip.save();

    // Emit real-time update via socket.io
    const io = req.app.get('io');
    io.emit('bus-location-update', {
      tripId: trip._id,
      location: locationUpdate,
      busNumber: trip.bus?.busNumber,
      timestamp: new Date().toISOString()
    });

    // Also emit ETA updates for users tracking this trip
    io.emit('eta-update', {
      tripId: trip._id,
      busLocation: locationUpdate,
      timestamp: new Date().toISOString()
    });

    res.json({ message: "Location updated successfully", location: locationUpdate });

  } catch (error) {
    console.error("Location update error:", error.message);
    res.status(500).json({ message: "Error updating location", error: error.message });
  }
});

// Get trip details with route information
router.get("/trip-details/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId)
      .populate('bus', 'busNumber plateNumber type')
      .populate('driver', 'name phone');

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Get route polyline
    let routePolyline = null;
    try {
      const directionsResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          params: {
            origin: trip.source,
            destination: trip.destination,
            key: GOOGLE_API_KEY,
            mode: "driving",
          },
        }
      );

      if (directionsResponse.data.status === 'OK' && directionsResponse.data.routes.length > 0) {
        routePolyline = directionsResponse.data.routes[0].overview_polyline.points;
      }
    } catch (error) {
      console.error("Error getting route polyline:", error.message);
    }

    res.json({
      trip: {
        ...trip.toObject(),
        routePolyline
      }
    });

  } catch (error) {
    console.error("Trip details error:", error.message);
    res.status(500).json({ message: "Error getting trip details", error: error.message });
  }
});

// Real-time ETA calculation for multiple pickup points
router.post("/calculate-etas/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { pickupPoints } = req.body; // Array of {lat, lng, userId}

    if (!pickupPoints || !Array.isArray(pickupPoints)) {
      return res.status(400).json({ message: "Invalid pickup points data" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip || !trip.currentLocation) {
      return res.status(404).json({ message: "Trip or location not found" });
    }

    const etaUpdates = [];

    // Calculate ETA for each pickup point
    for (const point of pickupPoints) {
      const eta = await calculatePreciseETA(
        trip.currentLocation.latitude,
        trip.currentLocation.longitude,
        point.lat,
        point.lng
      );

      if (eta) {
        etaUpdates.push({
          userId: point.userId,
          lat: point.lat,
          lng: point.lng,
          eta: eta,
          tripId: trip._id
        });
      }
    }

    // Emit real-time ETA updates
    const io = req.app.get('io');
    etaUpdates.forEach(update => {
      io.emit('user-eta-update', update);
    });

    res.json({
      message: "ETAs calculated successfully",
      updates: etaUpdates,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("ETA calculation error:", error.message);
    res.status(500).json({ message: "Error calculating ETAs", error: error.message });
  }
});

module.exports = router;
