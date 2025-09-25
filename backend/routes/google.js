const express = require("express");
const axios = require("axios");

const router = express.Router();

// Google API Key - using your provided key
const GOOGLE_API_KEY = "AIzaSyBpr4hS8JlH5-ZJK_cJRGndeeezpdLtbkk";

// Places Autocomplete API
router.get("/autocomplete", async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) return res.status(400).json({ message: "Missing input parameter" });

    console.log("Autocomplete request for:", input);
    console.log("Using API key:", GOOGLE_API_KEY.substring(0, 10) + "...");

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input,
          key: GOOGLE_API_KEY,
          types: "geocode",
          components: "country:in",
        },
      }
    );

    console.log("Google API response status:", response.data.status);
    console.log("Full Google API response:", JSON.stringify(response.data, null, 2));
    
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
    console.error("Autocomplete error:", error.message);
    res.status(500).json({ message: "Google Places API error", error: error.message });
  }
});

// Place Details API
router.get("/place-details", async (req, res) => {
  try {
    const { place_id } = req.query;
    if (!place_id) return res.status(400).json({ message: "Missing place_id parameter" });

    console.log("Place details request for:", place_id);

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id,
          key: GOOGLE_API_KEY,
          fields: "geometry,name,formatted_address",
        },
      }
    );

    console.log("Place details response status:", response.data.status);
    
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
    console.error("Place details error:", error.message);
    res.status(500).json({ message: "Google Place Details API error", error: error.message });
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
