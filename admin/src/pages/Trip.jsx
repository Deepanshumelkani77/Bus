import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { API_BASE } = useContext(AppContext);

  // Fetch trips from backend
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE || 'https://bustrac-backend.onrender.com'}/trips`);
      
      if (response.data && response.data.trips) {
        // Transform backend data to match our UI expectations
        const transformedTrips = response.data.trips.map(trip => ({
          _id: trip._id,
          tripId: `TRP${trip._id.slice(-3).toUpperCase()}`,
          busNumber: trip.bus?.busNumber || 'N/A',
          driverName: trip.driver?.name || 'Unknown Driver',
          source: trip.source || 'Unknown',
          destination: trip.destination || 'Unknown',
          departureTime: trip.startTime || trip.createdAt,
          arrivalTime: trip.endTime || null,
          status: trip.status?.toLowerCase() || 'pending',
          passengers: trip.occupiedSeats || 0,
          totalSeats: trip.bus?.totalSeats || trip.totalSeats || 40,
          fare: trip.fare || 0,
          distance: 'N/A', // Can be calculated from route if needed
          createdAt: trip.createdAt,
          city: trip.city
        }));
        
        setTrips(transformedTrips);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError(error.response?.data?.message || 'Failed to fetch trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ongoing':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-teal-400/5 -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 rounded-full bg-sky-400/5 top-1/3 -right-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-64 h-64 rounded-full bg-purple-400/5 bottom-20 left-1/4 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Trip Management</h1>
              <p className="text-slate-600">Monitor and manage all bus trips</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchTrips}
                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                Create Trip
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Trips</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={fetchTrips}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600">Ongoing Trips</p>
                <p className="text-2xl font-bold text-slate-900">{trips.filter(t => t.status === 'ongoing').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{trips.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{trips.filter(t => t.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Trips</p>
                <p className="text-2xl font-bold text-slate-900">{trips.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search trips by ID, route, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors bg-white/50"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors bg-white/50"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 bg-slate-200 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}

          {!loading && filteredTrips.map((trip) => (
            <div key={trip._id} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                {/* Left Section - Trip Info */}
                <div className="flex items-center gap-6 flex-1">
                  {/* Trip ID & Status */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {trip.tripId.slice(-3)}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(trip.status)}`}>
                      {getStatusIcon(trip.status)}
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </div>
                  </div>

                  {/* Route Information */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-slate-900 text-sm">{trip.source}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-0.5 bg-slate-300"></div>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      <div className="w-4 h-0.5 bg-slate-300"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-semibold text-slate-900 text-sm">{trip.destination}</span>
                    </div>
                  </div>

                  {/* Bus & Driver Info */}
                  <div className="hidden lg:flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
                      </svg>
                      <span className="text-sm font-medium text-slate-700">{trip.busNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v1a1 1 0 001 1h12a1 1 0 001-1v-1c0-2.761-3.134-5-7-5z"/>
                      </svg>
                      <span className="text-sm text-slate-600">{trip.driverName}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Details & Actions */}
                <div className="flex items-center gap-8">
                  {/* Passengers & Time */}
                  <div className="hidden md:flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0018.5 7h-3c-.83 0-1.5.67-1.5 1.5 0 .17.03.33.09.5L16.5 16H18v6h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9l-2.54-7.63A1.5 1.5 0 005 6H2c-.83 0-1.5.67-1.5 1.5 0 .17.03.33.09.5L3 14h1.5v8H7.5z"/>
                      </svg>
                      <span className="text-sm font-medium text-slate-700">{trip.passengers}/{trip.totalSeats}</span>
                    </div>
                    <div className="text-xs text-slate-500">{formatTime(trip.departureTime)}</div>
                  </div>

                  {/* Occupancy Progress */}
                  <div className="hidden lg:flex flex-col items-center gap-2 w-24">
                    <div className="text-xs text-slate-600 font-medium">
                      {Math.round((trip.passengers / trip.totalSeats) * 100)}% Full
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-sky-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(trip.passengers / trip.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    <button className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.5 2.5 0 00-3.536-3.536L4 16v4z"/>
                      </svg>
                    </button>
                    <div className="relative">
                      <button className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Details - Show on smaller screens */}
              <div className="lg:hidden mt-4 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
                    </svg>
                    <span className="font-medium text-slate-700">{trip.busNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v1a1 1 0 001 1h12a1 1 0 001-1v-1c0-2.761-3.134-5-7-5z"/>
                    </svg>
                    <span className="text-slate-600">{trip.driverName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0018.5 7h-3c-.83 0-1.5.67-1.5 1.5 0 .17.03.33.09.5L16.5 16H18v6h2z"/>
                    </svg>
                    <span className="text-slate-600">{trip.passengers}/{trip.totalSeats} passengers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-slate-600">{formatTime(trip.departureTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!loading && !error && filteredTrips.length === 0 && trips.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V3a1 1 0 00-1-1H10a1 1 0 00-1 1v3.306"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No trips available</h3>
              <p className="text-slate-600 mb-4">No trips have been created yet. Trips are created by drivers using the mobile app.</p>
              <button
                onClick={fetchTrips}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh
              </button>
            </div>
          )}

          {!loading && !error && filteredTrips.length === 0 && trips.length > 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No trips match your search</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trip;