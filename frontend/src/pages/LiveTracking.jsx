import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { MapPin, Clock, Users, Bus, Navigation, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const LiveTracking = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const busMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:2000');
    setSocket(newSocket);

    newSocket.on('bus-location-update', (data) => {
      if (data.tripId === tripId) {
        setBusLocation(data.location);
        setLastUpdate(new Date());
        updateBusMarkerOnMap(data.location);
      }
    });

    return () => newSocket.close();
  }, [tripId]);

  // Load trip details and initialize map
  useEffect(() => {
    loadTripDetails();
  }, [tripId]);

  // Wait for Google Maps API to load
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkGoogleMaps = () => {
      attempts++;
      
      if (window.google && window.google.maps && window.google.maps.geometry && trip) {
        console.log('Google Maps API loaded, initializing map...');
        initializeMap(trip);
        setMapLoading(false);
      } else if (trip && attempts < maxAttempts) {
        setTimeout(checkGoogleMaps, 100);
      } else if (attempts >= maxAttempts) {
        console.error('Google Maps API failed to load after 5 seconds');
        setError('Failed to load Google Maps. Please refresh the page.');
      }
    };
    
    if (trip) {
      checkGoogleMaps();
    }
  }, [trip]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:2000/smart-trips/trip-details/${tripId}`);
      const tripData = response.data.trip;
      
      setTrip(tripData);
      setBusLocation(tripData.currentLocation);
      
      // Map will be initialized by the Google Maps useEffect
      
    } catch (error) {
      console.error('Error loading trip details:', error);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = (tripData) => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      console.log('Google Maps API not ready or map ref not available');
      return;
    }

    console.log('Initializing map with trip data:', tripData);

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: tripData.currentLocation ? 
        { lat: tripData.currentLocation.latitude, lng: tripData.currentLocation.longitude } :
        { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ color: '#f8fafc' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#3b82f6' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#e2e8f0' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add bus marker if current location exists
    if (tripData.currentLocation) {
      addBusMarker(tripData.currentLocation);
    }

    // Draw route polyline if available
    if (tripData.routePolyline) {
      drawRoutePolyline(tripData.routePolyline);
    }
  };

  const addBusMarker = (location) => {
    if (!mapInstanceRef.current) return;

    // Enhanced bus icon with better visibility
    const busIcon = {
      path: 'M12 2C13.1 2 14 2.9 14 4V5H20C20.55 5 21 5.45 21 6V17C21 17.55 20.55 18 20 18H19C19 19.66 17.66 21 16 21S13 19.66 13 21H11C11 19.66 9.66 21 8 21S5 19.66 5 21H4C3.45 21 3 20.55 3 20V6C3 5.45 3.45 5 4 5H10V4C10 2.9 10.9 2 12 2M7.5 7.5C6.67 7.5 6 8.17 6 9S6.67 10.5 7.5 10.5 9 9.83 9 9 8.33 7.5 7.5 7.5M16.5 7.5C15.67 7.5 15 8.17 15 9S15.67 10.5 16.5 10.5 18 9.83 18 9 17.33 7.5 16.5 7.5Z',
      fillColor: '#059669', // Green color for active bus
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
      scale: 2,
      anchor: new window.google.maps.Point(12, 12)
    };

    busMarkerRef.current = new window.google.maps.Marker({
      position: { lat: location.latitude, lng: location.longitude },
      map: mapInstanceRef.current,
      icon: busIcon,
      title: `Bus ${trip?.bus?.busNumber || 'Unknown'} - Live Location`,
      animation: window.google.maps.Animation.DROP
    });

    // Add info window for bus marker
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-3 max-w-xs">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 class="font-bold text-gray-900">Bus ${trip?.bus?.busNumber}</h3>
          </div>
          <p class="text-sm text-gray-600 mb-1">${trip?.bus?.plateNumber}</p>
          <p class="text-sm text-gray-600 mb-2">Speed: ${location.speed || 0} km/h</p>
          <div class="text-xs text-green-600 font-medium">🔴 Live Location</div>
        </div>
      `
    });

    busMarkerRef.current.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, busMarkerRef.current);
    });
  };

  const updateBusMarkerOnMap = (location) => {
    if (busMarkerRef.current) {
      busMarkerRef.current.setPosition({ lat: location.latitude, lng: location.longitude });
      
      // Center map on bus location
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({ lat: location.latitude, lng: location.longitude });
      }
    } else {
      addBusMarker(location);
    }
  };

  const drawRoutePolyline = (encodedPolyline) => {
    if (!mapInstanceRef.current || !window.google) return;

    const decodedPath = window.google.maps.geometry.encoding.decodePath(encodedPolyline);
    
    // Enhanced route polyline with gradient effect
    routePolylineRef.current = new window.google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: '#1e40af', // Navy blue color
      strokeOpacity: 0.9,
      strokeWeight: 6,
      icons: [{
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          fillColor: '#1e40af',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1
        },
        offset: '0%',
        repeat: '10%'
      }]
    });

    routePolylineRef.current.setMap(mapInstanceRef.current);

    // Add route start and end markers
    if (decodedPath.length > 0) {
      // Start marker (green)
      new window.google.maps.Marker({
        position: decodedPath[0],
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        title: 'Route Start'
      });

      // End marker (red)
      new window.google.maps.Marker({
        position: decodedPath[decodedPath.length - 1],
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        title: 'Route End'
      });
    }

    // Fit map to show entire route with padding
    const bounds = new window.google.maps.LatLngBounds();
    decodedPath.forEach(point => bounds.extend(point));
    mapInstanceRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  };

  const refreshData = async () => {
    await loadTripDetails();
  };

  const formatLastUpdate = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return `${Math.floor(diffSecs / 3600)}h ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => window.history.back()}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-navy-600 to-navy-700 p-4 rounded-2xl shadow-lg">
                  <Bus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Bus {trip?.bus?.busNumber} - Live Tracking
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className="text-gray-600 font-medium">{trip?.bus?.plateNumber}</p>
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 font-medium text-sm">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right mr-4">
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="font-semibold text-gray-900">
                  {formatLastUpdate(lastUpdate)}
                </div>
              </div>
              <button
                onClick={refreshData}
                className="flex items-center space-x-3 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <RefreshCw className="h-5 w-5" />
                <span className="font-semibold">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-navy-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-navy-100 p-2 rounded-xl">
                      <MapPin className="h-6 w-6 text-navy-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Live Location Tracking</h2>
                      <p className="text-gray-600">Real-time bus position with route visualization</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-semibold text-sm">
                      Updated {formatLastUpdate(lastUpdate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div 
                  ref={mapRef}
                  className="w-full h-96 lg:h-[600px] bg-gray-50"
                  style={{ minHeight: '500px' }}
                />
                {mapLoading && (
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-slate-600 font-medium">Loading map...</p>
                      <p className="text-slate-500 text-sm mt-1">Initializing Google Maps</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trip Info */}
          <div className="space-y-6">
            {/* Route Info */}
            <div className="bg-white rounded-3xl shadow-navy-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Navigation className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Route Information</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="text-sm font-semibold text-gray-600">DEPARTURE</div>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{trip?.source}</div>
                </div>
                <div className="flex justify-center">
                  <div className="border-l-2 border-dashed border-gray-300 h-8"></div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="text-sm font-semibold text-gray-600">DESTINATION</div>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{trip?.destination}</div>
                </div>
              </div>
            </div>

            {/* Bus Status */}
            <div className="bg-white rounded-3xl shadow-navy-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Bus className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bus Status</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Status</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        trip?.status === 'Ongoing' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-bold text-gray-900 capitalize">{trip?.status}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Available Seats</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        {trip?.totalSeats - trip?.occupiedSeats}
                      </div>
                      <div className="text-sm text-gray-500">of {trip?.totalSeats} total</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Driver</span>
                    <span className="font-bold text-gray-900">{trip?.driver?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location */}
            {busLocation && (
              <div className="bg-white rounded-3xl shadow-navy-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-xl">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Current Location</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Latitude</span>
                      <span className="font-mono text-sm font-bold text-gray-900">
                        {busLocation.latitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Longitude</span>
                      <span className="font-mono text-sm font-bold text-gray-900">
                        {busLocation.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 p-1 rounded-lg">
                          <Navigation className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-blue-800 font-semibold">Speed</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {busLocation.speed || 0}
                        </div>
                        <div className="text-sm text-blue-500 font-medium">km/h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default LiveTracking;
