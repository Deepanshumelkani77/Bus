const express = require("express");
const axios = require("axios");

const router = express.Router();

// Using free APIs - no API key required!
console.log("🌍 Using free OpenStreetMap APIs (Nominatim + OSRM)");

// Places Autocomplete using Nominatim API
router.get("/autocomplete", async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) return res.status(400).json({ message: "Missing input parameter" });

    console.log("🔍 Nominatim autocomplete request for:", input);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: input + ", India", // Add India to focus on Indian locations
          format: "json",
          addressdetails: 1,
          limit: 5,
          countrycodes: "in", // Restrict to India
        },
        headers: {
          'User-Agent': 'BusDriverApp/1.0' // Required by Nominatim
        }
      }
    );

    console.log("✅ Nominatim found", response.data.length, "results");

    // Convert Nominatim format to Google-like format for compatibility
    const predictions = response.data.map((place, index) => ({
      place_id: place.place_id || `nominatim_${index}`,
      description: place.display_name,
      structured_formatting: {
        main_text: place.name || place.display_name.split(',')[0],
        secondary_text: place.display_name
      },
      geometry: {
        location: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon)
        }
      }
    }));

    res.json({
      status: "OK",
      predictions: predictions
    });
  } catch (error) {
    console.error("❌ Nominatim autocomplete error:", error.message);
    res.status(500).json({ message: "Nominatim API error", error: error.message });
  }
});

// Place Details using Nominatim API
router.get("/place-details", async (req, res) => {
  try {
    const { place_id } = req.query;
    if (!place_id) return res.status(400).json({ message: "Missing place_id parameter" });

    console.log("🔍 Nominatim place details request for:", place_id);

    // If it's a Nominatim place_id, get details by place_id
    // If it's a custom ID, we'll search by the description
    let response;
    
    if (place_id.startsWith('nominatim_')) {
      // This is a fallback - we already have the coordinates from autocomplete
      return res.json({
        status: "OK",
        result: {
          geometry: {
            location: {
              lat: 0, // This will be handled differently
              lng: 0
            }
          },
          name: "Location",
          formatted_address: "Address"
        }
      });
    } else {
      // Real Nominatim place_id
      response = await axios.get(
        `https://nominatim.openstreetmap.org/details.php`,
        {
          params: {
            place_id: place_id,
            format: "json",
            addressdetails: 1,
          },
          headers: {
            'User-Agent': 'BusDriverApp/1.0'
          }
        }
      );
    }

    console.log("✅ Nominatim place details found");

    // Convert to Google-like format
    const place = response.data;
    res.json({
      status: "OK",
      result: {
        geometry: {
          location: {
            lat: parseFloat(place.centroid?.coordinates?.[1] || place.lat || 0),
            lng: parseFloat(place.centroid?.coordinates?.[0] || place.lon || 0)
          }
        },
        name: place.localname || place.name || "Location",
        formatted_address: place.display_name || "Address"
      }
    });
  } catch (error) {
    console.error("❌ Nominatim place details error:", error.message);
    res.status(500).json({ message: "Nominatim Place Details API error", error: error.message });
  }
});

// Directions API
router.get("/directions", async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ message: "Missing origin or destination parameters" });
    }

    console.log("Directions request from:", origin, "to:", destination);

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin,
          destination,
          alternatives: true,
          key: GOOGLE_API_KEY,
          mode: "driving",
          traffic_model: "best_guess",
          departure_time: "now",
        },
      }
    );

    console.log("Directions response status:", response.data.status);
    
    if (response.data.status === 'REQUEST_DENIED') {
      console.error("API Key Error:", response.data.error_message || 'Request denied - check API key and billing');
      return res.status(403).json({ 
        message: "Google API access denied", 
        error: response.data.error_message || 'Check API key configuration',
        status: response.data.status
      });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error("Directions error:", error.message);
    res.status(500).json({ message: "Google Directions API error", error: error.message });
  }
});

module.exports = router;
