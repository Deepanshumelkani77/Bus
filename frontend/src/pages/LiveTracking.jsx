import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const LiveTracking = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const busMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  
  const [trip, setTrip] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const socketRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2000';

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Fetch trip details
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/trips/${tripId}`);
        setTrip(response.data.trip);
        setLoading(false);
      } catch (err) {
        console.error('Fetch trip details error:', err);
        setError(err.response?.data?.message || 'Failed to fetch trip details');
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  // Initialize map when both Google Maps and trip data are loaded
  useEffect(() => {
    if (mapLoaded && trip && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [mapLoaded, trip]);

  // Set up real-time location updates with WebSocket
  useEffect(() => {
    if (!trip) return;

    // Initialize Socket.IO connection
    socketRef.current = io(API_BASE_URL);

    // Join the trip room for real-time updates
    socketRef.current.emit('join-trip', tripId);

    // Listen for location updates
    socketRef.current.on('location-update', (data) => {
      if (data.tripId === tripId && data.currentLocation) {
        setCurrentLocation(data.currentLocation);
        updateBusMarker(data.currentLocation);
      }
    });

    // Initial location fetch
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/location`);
        const location = response.data.currentLocation;
        
        if (location) {
          setCurrentLocation(location);
          updateBusMarker(location);
        }
      } catch (err) {
        console.error('Fetch location error:', err);
      }
    };

    fetchLocation();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-trip', tripId);
        socketRef.current.disconnect();
      }
    };
  }, [trip, tripId]);

  const initializeMap = () => {
    if (!window.google || !trip) return;

    // Default center (use trip route if available, otherwise default location)
    const defaultCenter = trip.route && trip.route.length > 0 
      ? { lat: trip.route[0].lat, lng: trip.route[0].lng }
      : { lat: 28.6139, lng: 77.2090 }; // Delhi default

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: defaultCenter,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ color: '#1e293b' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#0f172a' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#334155' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#cbd5e1' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Draw route if available
    if (trip.route && trip.route.length > 1) {
      drawRoute(trip.route);
    }

    // Add bus marker if current location is available
    if (trip.currentLocation) {
      updateBusMarker(trip.currentLocation);
    }
  };

  const drawRoute = (routeCoords) => {
    if (!mapInstanceRef.current || !window.google) return;

    const routePath = routeCoords.map(coord => ({
      lat: coord.lat,
      lng: coord.lng
    }));

    // Remove existing polyline
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }

    // Create new polyline
    const polyline = new window.google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#14b8a6',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });

    polyline.setMap(mapInstanceRef.current);
    routePolylineRef.current = polyline;

    // Fit map to show entire route
    const bounds = new window.google.maps.LatLngBounds();
    routePath.forEach(point => bounds.extend(point));
    mapInstanceRef.current.fitBounds(bounds);
  };

  const updateBusMarker = (location) => {
    if (!mapInstanceRef.current || !window.google || !location) return;

    const position = {
      lat: location.latitude,
      lng: location.longitude
    };

    // Remove existing marker
    if (busMarkerRef.current) {
      busMarkerRef.current.setMap(null);
    }

    // Create custom bus icon
    const busIcon = {
      path: 'M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z',
      fillColor: '#14b8a6',
      fillOpacity: 1,
      strokeColor: '#0f766e',
      strokeWeight: 2,
      scale: 2,
      anchor: new window.google.maps.Point(10, 10)
    };

    // Create new marker
    const marker = new window.google.maps.Marker({
      position: position,
      map: mapInstanceRef.current,
      icon: busIcon,
      title: `Bus ${trip?.busNumber || 'Unknown'}`
    });

    busMarkerRef.current = marker;

    // Center map on bus location
    mapInstanceRef.current.setCenter(position);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateSpeed = (location) => {
    if (!location || !location.speed) return 'N/A';
    return `${Math.round(location.speed)} km/h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/track')}
            className="bg-gradient-to-r from-teal-400 to-sky-400 text-slate-900 font-semibold py-2 px-6 rounded-lg hover:from-teal-500 hover:to-sky-500 transition-all duration-200"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/track')}
              className="text-white hover:text-teal-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Live Tracking - Bus {trip?.busNumber}
              </h1>
              <p className="text-slate-300">
                {trip?.source} → {trip?.destination}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Live</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full min-h-[400px]"></div>
          
          {!mapLoaded && (
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                <p className="text-white">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Trip Info Sidebar */}
        <div className="lg:w-80 bg-white/10 backdrop-blur-lg border-l border-white/20 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Trip Status */}
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3">Trip Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Status:</span>
                  <span className="text-green-400 font-medium">{trip?.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Driver:</span>
                  <span className="text-white">{trip?.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Started:</span>
                  <span className="text-white">{formatTime(trip?.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">ETA:</span>
                  <span className="text-white">{formatTime(trip?.estimatedArrival)}</span>
                </div>
              </div>
            </div>

            {/* Current Location */}
            {currentLocation && (
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Current Location</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Speed:</span>
                    <span className="text-white">{calculateSpeed(currentLocation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Last Update:</span>
                    <span className="text-white">
                      {formatTime(currentLocation.timestamp)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Lat: {currentLocation.latitude.toFixed(6)}<br/>
                    Lng: {currentLocation.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            )}

            {/* Seat Information */}
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3">Seat Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Available:</span>
                  <span className="text-green-400 font-medium">{trip?.availableSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Occupied:</span>
                  <span className="text-orange-400">{trip?.occupiedSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Total:</span>
                  <span className="text-white">{trip?.totalSeats}</span>
                </div>
              </div>
              
              {/* Seat availability bar */}
              <div className="mt-3">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(trip?.occupiedSeats / trip?.totalSeats) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {Math.round((trip?.occupiedSeats / trip?.totalSeats) * 100)}% occupied
                </p>
              </div>
            </div>

            {/* Contact Information */}
            {trip?.driverPhone && (
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Contact Driver</h3>
                <a
                  href={`tel:${trip.driverPhone}`}
                  className="flex items-center justify-center bg-gradient-to-r from-teal-400 to-sky-400 text-slate-900 font-semibold py-2 px-4 rounded-lg hover:from-teal-500 hover:to-sky-500 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Call Driver
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
