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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white">
      
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="hidden sm:block absolute top-20 left-10 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-2 sm:px-2 lg:px-8 ">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              {/* BusTrac Logo (matches Login.jsx styling) */}
             
            </div>
            <h1 className=" hidden md:block lg:block text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Smart Bus{' '}
              <span className="text-white bg-clip-text text-transparent">
                Finder
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white font-medium max-w-3xl mx-auto mb-8">
              Discover buses on your route with live tracking & precise ETAs
            </p>
            
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Search Form */}
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 mb-10 sm:mb-12 hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
              Where are you{' '}
              <span className="bg-gradient-to-r from-slate-700 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                going?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Enter your pickup and drop-off locations to find the best buses
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
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
                  className="w-full p-4 sm:p-5 pl-12 sm:pl-14 border-2  border-teal-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-300 text-base sm:text-lg font-medium bg-white/80 backdrop-blur-sm group-hover:border-teal-300"
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
                  className="w-full p-4 sm:p-5 pl-12 sm:pl-14 border-2 border-sky-200 rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all duration-300 text-base sm:text-lg font-medium bg-white/80 backdrop-blur-sm group-hover:border-sky-300"
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
              className="group relative inline-flex items-center justify-center px-6 sm:px-12 py-3.5 sm:py-5 text-lg sm:text-xl font-black text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden disabled:cursor-not-allowed disabled:hover:scale-100 bg-orange-500"
            >
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
          <div className="space-y-8 sm:space-y-10">
            <div className="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-3xl transition-all duration-500">
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
              <div className="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-16 text-center hover:shadow-3xl transition-all duration-500">
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
              <div className="grid grid-cols-1 gap-6 sm:gap-10">
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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Left badge */}
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 text-white flex flex-col items-center justify-center shadow">
            <Bus className="w-6 h-6" />
            <span className="text-xs sm:text-sm font-bold mt-0.5">{trip.bus?.busNumber || '—'}</span>
          </div>

          {/* Middle content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="text-xl sm:text-xl lg:text-2xl font-extrabold text-slate-900 truncate mt-1 sm:mt-0">
                {trip.title || `Bus ${trip.bus?.busNumber || ''}`}
              </h3>
              {/* Seats small on desktop, move to right sidebar on mobile? keep here small */}
              <div className="hidden sm:flex items-center gap-2 text-sm lg:text-base text-slate-500">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{trip.availableSeats}</span>
                <span className="text-slate-400">/ {trip.totalSeats} seats</span>
              </div>
            </div>

            {/* Route: stacked on mobile, inline on desktop */}
            <div className="mt-3 sm:hidden space-y-2 text-slate-700">
              <div className="flex items-center gap-2 text-base">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <span className="font-medium truncate">{trip.source}</span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span className="font-medium truncate">{trip.destination}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-sm sm:text-base text-slate-700 mt-2">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                <span className="font-medium truncate max-w-[9rem] sm:max-w-[16rem]">{trip.source}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="font-medium truncate max-w-[9rem] sm:max-w-[16rem]">{trip.destination}</span>
              </span>
            </div>

            {/* Meta row */}
            <div className="mt-3 sm:mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-700" />
                <span className="font-semibold">{formatETA(currentETA)}</span>
              </span>
              {currentETA?.distance?.text && (
                <span className="inline-flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>{currentETA.distance.text}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2 sm:hidden">
                <Users className="w-5 h-5 text-slate-700" />
                <span className="font-semibold">{trip.availableSeats}</span>
                <span className="text-slate-400">/ {trip.totalSeats} seats</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${trip.status === 'Ongoing' ? 'bg-teal-500' : 'bg-yellow-500'}`}></span>
                <span className="capitalize">{trip.status}</span>
              </span>
              {trip.routeMatchScore && (
                <span className="inline-flex items-center gap-2 text-teal-700 font-semibold">
                  <Star className="w-4 h-4 text-teal-600" />
                  <span>{trip.routeMatchScore}% match</span>
                </span>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          {/* Right sidebar (desktop) / Arrival row (mobile) */}
          <div className="w-full sm:w-auto">
            {/* Mobile: inline row under content */}
            <div className="flex sm:hidden items-center justify-between mt-5">
              <div>
                <span className="text-xs text-slate-500 block">Next arrival</span>
                <div className="text-4xl font-extrabold text-orange-500 leading-none mt-1">
                  {formatETA(currentETA)}
                </div>
              </div>
              <button
                onClick={handleTrackBus}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-base font-semibold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
              >
                Track
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop: stacked right column */}
            <div className="hidden sm:flex sm:flex-col sm:items-end sm:gap-3">
              <span className="text-xs text-slate-500">Next arrival</span>
              <div className="text-2xl font-extrabold text-orange-500 leading-none">
                {formatETA(currentETA)}
              </div>
              <button
                onClick={handleTrackBus}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-base font-semibold shadow hover:bg-orange-600 transition-colors"
              >
                Track
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Removed extra mobile full-width CTA; integrated into inline row above */}
    </div>
  );
};

export default SmartTripSearch;
