import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Search, MapPin, Clock, Users, Bus, Navigation, Loader2, AlertCircle, ArrowRight, Zap, Star } from 'lucide-react';
import SmartPlacesAutocomplete from '../components/SmartPlacesAutocomplete';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-teal-500 to-sky-500 p-4 rounded-3xl shadow-2xl">
                <Bus className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Smart Bus{' '}
              <span className="bg-gradient-to-r from-teal-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
                Finder
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-3xl mx-auto mb-8">
              Discover buses on your route with live tracking & precise ETAs
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-teal-300 font-semibold text-sm">Live Tracking Active</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Zap className="h-4 w-4 text-sky-400" />
                <span className="text-sky-300 font-semibold text-sm">Real-time ETAs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Search Form */}
        <div className="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 mb-12 hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              Where are you{' '}
              <span className="bg-gradient-to-r from-slate-700 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                going?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Enter your pickup and drop-off locations to find the best buses
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mb-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-base sm:text-lg font-bold text-slate-700">Pickup Location</span>
              </div>
              <div className="relative group">
                <SmartPlacesAutocomplete
                  placeholder="Enter pickup location"
                  icon={MapPin}
                  onPlaceSelect={setSource}
                  value={source?.address || ''}
                  className="w-full p-4 sm:p-5 pl-12 sm:pl-14 border-2 border-teal-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-300 text-base sm:text-lg font-medium bg-teal-50/80 backdrop-blur-sm group-hover:border-teal-300"
                />
                <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-teal-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-base sm:text-lg font-bold text-slate-700">Drop-off Location</span>
              </div>
              <div className="relative group">
                <SmartPlacesAutocomplete
                  placeholder="Enter destination"
                  icon={Navigation}
                  onPlaceSelect={setDestination}
                  value={destination?.address || ''}
                  className="w-full p-4 sm:p-5 pl-12 sm:pl-14 border-2 border-sky-200 rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all duration-300 text-base sm:text-lg font-medium bg-sky-50/80 backdrop-blur-sm group-hover:border-sky-300"
                />
                <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-sky-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSearch}
              disabled={!source || !destination || isSearching}
              className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-black text-white bg-slate-900 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-slate-900  group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                {isSearching ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Searching for buses...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Find My Bus</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>
          </div>

          {error && (
            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl flex items-center space-x-4 text-red-700 shadow-lg">
              <div className="bg-red-100 p-2 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="font-bold text-red-800 mb-1">Search Error</div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchPerformed && (
          <div className="space-y-10">
            <div className="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded-2xl shadow-lg">
                    <Bus className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Available Buses</h2>
                    <p className="text-slate-600 font-medium">Real-time results sorted by relevance and ETA</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-slate-700 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                    {matchingTrips.length}
                  </div>
                  <div className="text-sm text-slate-500 font-semibold">bus{matchingTrips.length !== 1 ? 'es' : ''} found</div>
                  {matchingTrips.length > 0 && (
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-xs text-slate-600 font-medium">Live tracking</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {matchingTrips.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-12 sm:p-16 text-center hover:shadow-3xl transition-all duration-500">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full p-8 w-32 h-32 mx-auto mb-8 shadow-inner">
                  <Bus className="h-16 w-16 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 mb-6">
                  No active buses found on your{' '}
                  <span className="bg-gradient-to-r from-slate-700 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                    route
                  </span>
                </h3>
                <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-8">
                  No drivers have created trips that match your journey at the moment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-200 rounded-2xl p-6">
                    <div className="bg-teal-100 p-3 rounded-xl w-fit mx-auto mb-4">
                      <Bus className="h-6 w-6 text-teal-600" />
                    </div>
                    <p className="text-teal-800 font-semibold mb-2">How it works</p>
                    <p className="text-teal-700 text-sm">
                      Drivers create trips using the DriverApp. When a driver creates a trip from A→B and you search for C→D, we'll show it if C and D lie on the A→B route.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-200 rounded-2xl p-6">
                    <div className="bg-sky-100 p-3 rounded-xl w-fit mx-auto mb-4">
                      <Zap className="h-6 w-6 text-sky-600" />
                    </div>
                    <p className="text-sky-800 font-semibold mb-2">Pro Tip</p>
                    <p className="text-sky-700 text-sm">
                      Try different locations or check back later when more drivers are active. Peak hours usually have more available buses.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
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
    <div className="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-lg">
              <Bus className="h-7 w-7" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black">Bus {trip.bus?.busNumber}</h3>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
                <p className="text-slate-200 text-sm font-semibold">{trip.bus?.plateNumber}</p>
                {trip.createdByDriver && (
                  <div className="bg-gradient-to-r from-teal-400 to-sky-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    LIVE DRIVER
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-300 font-semibold">Available Seats</div>
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
              {trip.availableSeats}
            </div>
            <div className="text-xs text-slate-300">of {trip.totalSeats} total</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Route Info */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
          <div className="text-sm font-black text-slate-700 mb-4 flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span>Route Information</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-teal-500 rounded-full shadow-lg"></div>
              <span className="font-bold text-slate-900 text-sm sm:text-base">{trip.source}</span>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
              <ArrowRight className="h-4 w-4 text-slate-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-1" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-sky-500 rounded-full shadow-lg"></div>
              <span className="font-bold text-slate-900 text-sm sm:text-base">{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* ETA Section */}
        <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-teal-50 rounded-2xl p-6 border border-teal-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-500 to-sky-500 p-3 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-slate-800 text-lg">ETA to Pickup</span>
            </div>
            <button
              onClick={refreshETA}
              disabled={isLoadingETA}
              className="bg-white text-teal-600 hover:text-teal-700 text-sm font-bold disabled:opacity-50 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-teal-200 hover:border-teal-300"
            >
              {isLoadingETA ? 'Updating...' : 'Refresh'}
            </button>
          </div>
          <div className="flex items-baseline space-x-3 mb-4">
            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
              {formatETA(currentETA)}
            </div>
            {currentETA && (
              <div className="text-sm text-slate-600 font-semibold">
                ({formatDistance(currentETA)} away)
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {trip.routeMatchScore && (
              <div className="bg-gradient-to-r from-teal-100 to-sky-100 text-teal-800 text-xs font-black px-3 py-2 rounded-full border border-teal-200">
                {trip.routeMatchScore}% Route Match
              </div>
            )}
            {trip.lastETAUpdate && (
              <div className="flex items-center space-x-2 text-xs text-teal-700">
                <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Live ETA Updates</span>
              </div>
            )}
          </div>
        </div>

        {/* Driver & Status Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-slate-200 p-2 rounded-lg">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
              <span className="text-sm font-black text-slate-700">DRIVER</span>
            </div>
            <div className="font-black text-slate-900 text-base">
              {trip.driver?.name || 'N/A'}
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-4 h-4 rounded-full shadow-lg ${
                trip.status === 'Ongoing' ? 'bg-teal-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-black text-slate-700">STATUS</span>
            </div>
            <div className="font-black text-slate-900 text-base capitalize">{trip.status}</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTrackBus}
          className="group w-full bg-gradient-to-r from-slate-700 via-teal-600 to-sky-600 hover:from-slate-800 hover:via-teal-700 hover:to-sky-700 text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-4 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <MapPin className="h-7 w-7 group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <span className="text-lg sm:text-xl relative z-10">Track Live Location</span>
          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
        </button>
      </div>
    </div>
  );
};

export default SmartTripSearch;
