import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import { useAuth } from '../../../lib/AuthContext';
import axios from 'axios';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Trip {
  _id: string;
  bus: {
    _id: string;
    busNumber: string;
    totalSeats: number;
  };
  driver: {
    _id: string;
    name: string;
  };
  source: string;
  destination: string;
  startTime: string;
  endTime?: string;
  status: 'Pending' | 'Ongoing' | 'Completed';
  totalSeats: number;
  occupiedSeats: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

export default function TripsScreen() {
  const { driver, token, isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [trackingLocation, setTrackingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const locationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for trip tracking');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  };

  const stopLocationTracking = useCallback(() => {
    setTrackingLocation(false);
    
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
    
    setCurrentLocation(null);
  }, []);

  const sendLocationToBackend = useCallback(async (location: LocationData, tripId: string) => {
    try {
      await axios.post(
        'https://bustrac-backend.onrender.com/trips/location',
        {
          tripId,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp,
          speed: location.speed,
          heading: location.heading,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Location sent successfully:', { lat: location.latitude, lng: location.longitude });
    } catch (error) {
      console.error('Send location error:', error);
      // Don't show alert for location errors to avoid spam
    }
  }, [token]);

  const startLocationTracking = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    try {
      setTrackingLocation(true);
      
      // Start location subscription for real-time updates
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
            speed: location.coords.speed || 0,
            heading: location.coords.heading || 0,
          };
          setCurrentLocation(locationData);
        }
      );

      // Send location to backend every second
      locationInterval.current = setInterval(async () => {
        if (currentLocation && activeTrip) {
          await sendLocationToBackend(currentLocation, activeTrip._id);
        }
      }, 1000);

    } catch (error) {
      console.error('Location tracking error:', error);
      Alert.alert('Error', 'Failed to start location tracking');
    }
  }, [currentLocation, activeTrip, sendLocationToBackend]);

  const loadTrips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://bustrac-backend.onrender.com/trips/driver/${driver?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrips(response.data.trips || []);
    } catch (error) {
      console.error('Load trips error:', error);
      Alert.alert('Error', 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, [driver?._id, token]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadTrips();
    }
  }, [isAuthenticated, loadTrips]);

  useEffect(() => {
    // Check if there's an ongoing trip and start tracking
    const ongoingTrip = trips.find(trip => trip.status === 'Ongoing');
    if (ongoingTrip && !trackingLocation) {
      setActiveTrip(ongoingTrip);
      startLocationTracking();
    } else if (!ongoingTrip && trackingLocation) {
      stopLocationTracking();
    }
  }, [trips, trackingLocation, startLocationTracking, stopLocationTracking]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, [stopLocationTracking]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const startTrip = async (trip: Trip) => {
    try {
      const response = await axios.patch(
        `https://bustrac-backend.onrender.com/trips/${trip._id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Trip Started', 'Location tracking has begun');
        setActiveTrip(trip);
        await loadTrips(); // Refresh trips list
        startLocationTracking();
      }
    } catch (error) {
      console.error('Start trip error:', error);
      Alert.alert('Error', 'Failed to start trip');
    }
  };

  const completeTrip = async (trip: Trip) => {
    Alert.alert(
      'Complete Trip',
      'Are you sure you want to complete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const response = await axios.patch(
                `https://bustrac-backend.onrender.com/trips/${trip._id}/complete`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.status === 200) {
                Alert.alert('Trip Completed', 'Thank you for your service!');
                setActiveTrip(null);
                stopLocationTracking();
                await loadTrips(); // Refresh trips list
              }
            } catch (error) {
              console.error('Complete trip error:', error);
              Alert.alert('Error', 'Failed to complete trip');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#FF9800';
      case 'Ongoing': return '#4CAF50';
      case 'Completed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return 'clock-outline';
      case 'Ongoing': return 'play-circle';
      case 'Completed': return 'check-circle';
      default: return 'help-circle';
    }
  };

  const renderTripCard = ({ item: trip }: { item: Trip }) => (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripInfo}>
          <Text style={styles.tripRoute}>
            {trip.source} → {trip.destination}
          </Text>
          <Text style={styles.tripBus}>Bus: {trip.bus.busNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <MaterialCommunityIcons 
            name={getStatusIcon(trip.status)} 
            size={16} 
            color="#fff" 
          />
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <Text style={styles.tripDetailText}>
          Seats: {trip.occupiedSeats}/{trip.totalSeats}
        </Text>
        <Text style={styles.tripDetailText}>
          Started: {new Date(trip.startTime).toLocaleString()}
        </Text>
        {trip.endTime && (
          <Text style={styles.tripDetailText}>
            Completed: {new Date(trip.endTime).toLocaleString()}
          </Text>
        )}
      </View>

      <View style={styles.tripActions}>
        {trip.status === 'Pending' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={() => startTrip(trip)}
          >
            <MaterialCommunityIcons name="play" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Start Trip</Text>
          </TouchableOpacity>
        )}

        {trip.status === 'Ongoing' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => completeTrip(trip)}
          >
            <MaterialCommunityIcons name="check" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Complete Trip</Text>
          </TouchableOpacity>
        )}
      </View>

      {trip.status === 'Ongoing' && trackingLocation && (
        <View style={styles.trackingInfo}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#4CAF50" />
          <Text style={styles.trackingText}>
            Live tracking active • {currentLocation?.speed?.toFixed(1) || '0'} km/h
          </Text>
        </View>
      )}
    </View>
  );

  // Show authentication warning if not logged in
  if (!isAuthenticated()) {
    return (
      <View style={styles.authWarningContainer}>
        <Text style={styles.authWarningTitle}>Authentication Required</Text>
        <Text style={styles.authWarningText}>
          Please login as a driver to manage trips.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        {trackingLocation && (
          <View style={styles.trackingIndicator}>
            <MaterialCommunityIcons name="radar" size={20} color="#4CAF50" />
            <Text style={styles.trackingIndicatorText}>Live Tracking</Text>
          </View>
        )}
      </View>

      {/* Trips List */}
      <FlatList
        data={trips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="bus" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No trips found</Text>
            <Text style={styles.emptyText}>
              Create a route and trip to get started
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trackingIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tripBus: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tripDetails: {
    marginBottom: 12,
  },
  tripDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tripActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  completeButton: {
    backgroundColor: '#FF5722',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  trackingText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  authWarningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authWarningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  authWarningText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
