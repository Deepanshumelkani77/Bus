import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Search, MapPin, Clock, Users, Bus, Navigation, Loader2, AlertCircle } from 'lucide-react';
import SmartPlacesAutocomplete from '../components/SmartPlacesAutocomplete';

const SmartTripSearch = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [matchingTrips, setMatchingTrips] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection for real-time updates
  useEffect(() => {
    const newSocket = io('http://localhost:2000');
    setSocket(newSocket);

    // Listen for real-time ETA updates
    newSocket.on('user-eta-update', (data) => {
      if (source && data.lat === source.lat && data.lng === source.lng) {
        setMatchingTrips(prevTrips => 
          prevTrips.map(trip => 
            trip.tripId === data.tripId 
              ? { ...trip, eta: data.eta, lastETAUpdate: new Date() }
              : trip
          )
        );
      }
    });

    // Listen for bus location updates to refresh ETAs
    newSocket.on('bus-location-update', (data) => {
      // Update bus location in matching trips
      setMatchingTrips(prevTrips => 
        prevTrips.map(trip => 
          trip.tripId === data.tripId 
            ? { ...trip, currentLocation: data.location, lastLocationUpdate: new Date() }
            : trip
        )
      );
    });

    return () => newSocket.close();
  }, [source]);

  const handleSearch = async () => {
    if (!source || !destination) {
      setError('Please select both source and destination');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await axios.post('http://localhost:2000/smart-trips/find-matching-trips', {
        sourceLat: source.lat,
        sourceLng: source.lng,
        destLat: destination.lat,
        destLng: destination.lng,
        sourceAddress: source.address,
        destAddress: destination.address
      });

      setMatchingTrips(response.data.matchingTrips || []);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search for trips. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-navy-600 to-navy-700 p-3 rounded-2xl shadow-lg">
                <Bus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Smart Bus Finder</h1>
                <p className="text-gray-600 text-lg">Discover buses on your route with live tracking & precise ETAs</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium text-sm">Live Tracking Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-navy-lg border border-gray-100 p-8 mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you going?</h2>
            <p className="text-gray-600">Enter your pickup and drop-off locations to find the best buses</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Pickup Location</span>
              </div>
              <SmartPlacesAutocomplete
                placeholder="Enter pickup location"
                icon={MapPin}
                onPlaceSelect={setSource}
                value={source?.address || ''}
                className="pickup-input"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Drop-off Location</span>
              </div>
              <SmartPlacesAutocomplete
                placeholder="Enter destination"
                icon={Navigation}
                onPlaceSelect={setDestination}
                value={destination?.address || ''}
                className="destination-input"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!source || !destination || isSearching}
            className="w-full bg-orange-600 hover:from-navy-700 hover:to-navy-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-navy hover:shadow-navy-lg disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">Searching for buses...</span>
              </>
            ) : (
              <>
                <Search className="h-6 w-6" />
                <span className="text-lg">Find My Bus</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl flex items-center space-x-3 text-red-700">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchPerformed && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-navy-100 p-2 rounded-lg">
                    <Bus className="h-6 w-6 text-navy-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Available Buses</h2>
                    <p className="text-gray-600">Real-time results sorted by relevance and ETA</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-navy-600">{matchingTrips.length}</div>
                  <div className="text-sm text-gray-500">bus{matchingTrips.length !== 1 ? 'es' : ''} found</div>
                </div>
              </div>
            </div>

            {matchingTrips.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-navy-lg border border-gray-100 p-16 text-center">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                  <Bus className="h-12 w-12 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No active buses found on your route</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                  No drivers have created trips that match your journey at the moment.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-md mx-auto mb-4">
                  <p className="text-blue-800 text-sm">
                    🚌 <strong>How it works:</strong> Drivers create trips using the DriverApp. When a driver creates a trip from A→B and you search for C→D, we'll show it if C and D lie on the A→B route.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 max-w-md mx-auto">
                  <p className="text-green-800 text-sm">
                    💡 <strong>Tip:</strong> Try different locations or check back later when more drivers are active.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {matchingTrips.map((trip) => (
                  <BusCard key={trip.tripId} trip={trip} source={source} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const BusCard = ({ trip, source }) => {
  const [currentETA, setCurrentETA] = useState(trip.eta);
  const [isLoadingETA, setIsLoadingETA] = useState(false);

  const formatETA = (eta) => {
    if (!eta) return 'Calculating...';
    return eta.duration?.text || 'N/A';
  };

  const formatDistance = (eta) => {
    if (!eta) return '';
    return eta.distance?.text || '';
  };

  const refreshETA = async () => {
    if (!source) return;
    
    setIsLoadingETA(true);
    try {
      const response = await axios.get(`http://localhost:2000/smart-trips/eta/${trip.tripId}`, {
        params: {
          userLat: source.lat,
          userLng: source.lng
        }
      });
      setCurrentETA(response.data.eta);
    } catch (error) {
      console.error('ETA refresh error:', error);
    } finally {
      setIsLoadingETA(false);
    }
  };

  const handleTrackBus = () => {
    // Navigate to live tracking page
    window.location.href = `/live-tracking/${trip.tripId}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-navy-lg border border-gray-100 overflow-hidden hover:shadow-navy transition-all duration-300 transform hover:scale-[1.02]">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-600 to-navy-700 p-6">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Bus {trip.bus?.busNumber}</h3>
              <div className="flex items-center space-x-2">
                <p className="text-navy-100 text-sm font-medium">{trip.bus?.plateNumber}</p>
                {trip.createdByDriver && (
                  <div className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full">
                    LIVE DRIVER
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-navy-200 font-medium">Available Seats</div>
            <div className="text-3xl font-bold">{trip.availableSeats}</div>
            <div className="text-xs text-navy-200">of {trip.totalSeats} total</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Route Info */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">Route Information</div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-gray-900 text-sm">{trip.source}</span>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-gray-900 text-sm">{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* ETA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-bold text-gray-900">ETA to Pickup</span>
            </div>
            <button
              onClick={refreshETA}
              disabled={isLoadingETA}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold disabled:opacity-50 bg-white px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {isLoadingETA ? 'Updating...' : 'Refresh'}
            </button>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-blue-600">
              {formatETA(currentETA)}
            </div>
            {currentETA && (
              <div className="text-sm text-blue-500 font-medium">
                ({formatDistance(currentETA)} away)
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            {trip.routeMatchScore && (
              <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                {trip.routeMatchScore}% Route Match
              </div>
            )}
            {trip.lastETAUpdate && (
              <div className="flex items-center space-x-1 text-xs text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live ETA</span>
              </div>
            )}
          </div>
        </div>

        {/* Driver & Status Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600">DRIVER</span>
            </div>
            <div className="font-bold text-gray-900 text-sm">
              {trip.driver?.name || 'N/A'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${
                trip.status === 'Ongoing' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-xs font-semibold text-gray-600">STATUS</span>
            </div>
            <div className="font-bold text-gray-900 text-sm capitalize">{trip.status}</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTrackBus}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <MapPin className="h-6 w-6" />
          <span className="text-lg">Track Live Location</span>
        </button>
      </div>
    </div>
  );
};

export default SmartTripSearch;
