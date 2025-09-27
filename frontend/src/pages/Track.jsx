import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Track = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2000';

  const searchTrips = async () => {
    if (!source.trim() || !destination.trim()) {
      setError('Please enter both source and destination');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/trips/search`, {
        params: {
          src: source.trim(),
          des: destination.trim()
        }
      });
      
      setTrips(response.data.trips || []);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Search trips error:', err);
      setError(err.response?.data?.message || 'Failed to search trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackTrip = (tripId) => {
    navigate(`/live-tracking/${tripId}`);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Track Your Bus</h1>
          <p className="text-slate-300">Find and track buses in real-time</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Source
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter pickup location"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchTrips()}
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchTrips()}
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={searchTrips}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-400 to-sky-400 text-slate-900 font-semibold py-3 px-6 rounded-lg hover:from-teal-500 hover:to-sky-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  'Search Buses'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchPerformed && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              Available Buses {trips.length > 0 && `(${trips.length} found)`}
            </h2>

            {trips.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚌</div>
                <h3 className="text-xl font-semibold text-white mb-2">No buses found</h3>
                <p className="text-slate-300">
                  No ongoing trips match your search criteria. Try different locations or check back later.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    className="bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Bus Info */}
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-teal-400 to-sky-400 p-3 rounded-lg">
                          <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            Bus {trip.busNumber}
                          </h3>
                          <p className="text-slate-300">Driver: {trip.driverName}</p>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="flex-1 lg:mx-8">
                        <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                          <span>{trip.source}</span>
                          <span>→</span>
                          <span>{trip.destination}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-gradient-to-r from-teal-400 to-sky-400 h-2 rounded-full w-1/3"></div>
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-xs text-slate-400">Started</p>
                          <p className="text-white font-medium">
                            {formatTime(trip.startTime)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(trip.startTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">ETA</p>
                          <p className="text-white font-medium">
                            {formatTime(trip.estimatedArrival)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Available Seats</p>
                          <p className="text-white font-medium">
                            {trip.availableSeats}/{trip.totalSeats}
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => handleTrackTrip(trip._id)}
                            className="bg-gradient-to-r from-teal-400 to-sky-400 text-slate-900 font-semibold py-2 px-4 rounded-lg hover:from-teal-500 hover:to-sky-500 transition-all duration-200 w-full"
                          >
                            Track Live
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Current Location Status */}
                    {trip.currentLocation && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center text-sm text-slate-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          Live location available • Last updated: {formatTime(trip.currentLocation.timestamp)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;
