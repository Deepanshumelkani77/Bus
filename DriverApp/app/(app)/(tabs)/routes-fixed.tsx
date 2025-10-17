import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Modal,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { useAuth } from '../../../lib/AuthContext';
import crashlyticsService from '@/lib/crashlytics';
import PerformanceMonitor from '@/lib/performance';
import CrashTestButton from '@/components/CrashTestButton';

// Type definitions
interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteData {
  id: string;
  summary: string;
  distance: string;
  duration: string;
  coords: { latitude: number; longitude: number }[];
  distanceValue: number;
  durationValue: number;
}

interface PlaceResult {
  place_id: string;
  description: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function RoutesScreen() {
  const { driver, token, isAuthenticated, loading } = useAuth();

  // Add error boundary for deployed environment
  const [hasError, setHasError] = React.useState(false);
  
  // Location states
  const [sourceText, setSourceText] = useState<string>('');
  const [destText, setDestText] = useState<string>('');
  const [sourceCoords, setSourceCoords] = useState<Coordinates | null>(null);
  const [destCoords, setDestCoords] = useState<Coordinates | null>(null);
  
  // Route states
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);
  const [savingRoute, setSavingRoute] = useState<boolean>(false);
  
  // Trip states
  const [showTripModal, setShowTripModal] = useState<boolean>(false);
  const [creatingTrip, setCreatingTrip] = useState<boolean>(false);
  const [savedRouteData, setSavedRouteData] = useState<{
    routeId: string;
    source: string;
    destination: string;
    sourceCoords: Coordinates;
    destinationCoords: Coordinates;
    selectedRoute: RouteData;
  } | null>(null);
  
  // Search states
  const [sourceSuggestions, setSourceSuggestions] = useState<PlaceResult[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<PlaceResult[]>([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState<boolean>(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState<boolean>(false);
  
  // Abort controllers for API calls
  const sourceAbortController = useRef<AbortController | null>(null);
  const destAbortController = useRef<AbortController | null>(null);
  const debouncedSearch = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // API Base URL
  const API_BASE_URL = 'https://bustrac-backend.onrender.com';
  
  const mapRef = useRef<MapView>(null);

  // Search function with debouncing
  const searchPlaces = (input: string, isSource: boolean) => {
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }
    
    debouncedSearch.current = setTimeout(() => {
      fetchPlaces(input, isSource);
    }, 500); // Increased debounce delay for deployed environment
  };

  // Fetch places from Google Places API
  const fetchPlaces = async (input: string, isSource: boolean = true) => {
    if (!input.trim()) {
      if (isSource) {
        setSourceSuggestions([]);
      } else {
        setDestSuggestions([]);
      }
      return;
    }

    const controller = new AbortController();
    if (isSource) {
      sourceAbortController.current = controller;
    } else {
      destAbortController.current = controller;
    }

    try {
      const response = await PerformanceMonitor.monitorAPICall(
        'google_places_search',
        async () => {
          return await axios.get(`${API_BASE_URL}/google/places`, {
            params: { input },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 8000,
            signal: controller.signal
          });
        },
        { input_length: input.length }
      );

      if (response.data && response.data.predictions) {
        if (isSource) {
          setSourceSuggestions(response.data.predictions);
        } else {
          setDestSuggestions(response.data.predictions);
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
        console.error('Places API error:', error);
        crashlyticsService.recordError(error as Error, 'Places API search error');
      }
    }
  };

  // Handle place selection
  const handlePlaceSelect = async (place: PlaceResult, isSource: boolean) => {
    try {
      const response = await PerformanceMonitor.monitorAPICall(
        'google_place_details',
        async () => {
          return await axios.get(`${API_BASE_URL}/google/place-details`, {
            params: { placeId: place.place_id },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          });
        }
      );

      if (response.data && response.data.result && response.data.result.geometry) {
        const { lat, lng } = response.data.result.geometry.location;
        const coords = { lat, lng };

        if (isSource) {
          setSourceCoords(coords);
          setSourceText(place.description);
          setSourceSuggestions([]);
          setShowSourceSuggestions(false);
        } else {
          setDestCoords(coords);
          setDestText(place.description);
          setDestSuggestions([]);
          setShowDestSuggestions(false);
        }
      }
    } catch (error: any) {
      console.error('Place details error:', error);
      crashlyticsService.recordError(error as Error, 'Place details API error');
    }
  };

  // Fetch directions from Google Directions API
  const fetchDirections = async () => {
    if (!sourceCoords || !destCoords) return;

    setLoadingRoutes(true);

    try {
      const response = await PerformanceMonitor.monitorRouteCalculation(
        sourceText,
        destText,
        async () => {
          return await axios.get(`${API_BASE_URL}/google/directions`, {
            params: {
              origin: `${sourceCoords.lat},${sourceCoords.lng}`,
              destination: `${destCoords.lat},${destCoords.lng}`,
            },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 12000,
          });
        }
      );

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const parsedRoutes = response.data.routes.map((route: any, index: number) => ({
          id: `route_${index}`,
          summary: route.summary || 'Route',
          distance: route.legs[0]?.distance?.text || 'Unknown',
          duration: route.legs[0]?.duration?.text || 'Unknown',
          distanceValue: route.legs[0]?.distance?.value || 0,
          durationValue: route.legs[0]?.duration?.value || 0,
          coords: decodePolyline(route.overview_polyline.points),
        }));
        
        setRoutes(parsedRoutes);
        setSelectedRouteIndex(0);
      }
    } catch (error: any) {
      console.error('Directions API error:', error);
      crashlyticsService.recordError(error as Error, 'Directions API error');
      Alert.alert('Error', 'Failed to fetch routes. Please try again.');
    } finally {
      setLoadingRoutes(false);
    }
  };

  // Decode polyline points
  const decodePolyline = (encoded: string) => {
    const points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  // Create trip
  const createTrip = async () => {
    if (!savedRouteData) {
      Alert.alert('Error', 'No route data available');
      return;
    }

    setCreatingTrip(true);

    try {
      const tripData = {
        driverId: driver?._id,
        source: savedRouteData.source,
        destination: savedRouteData.destination,
        sourceCoords: savedRouteData.sourceCoords,
        destinationCoords: savedRouteData.destinationCoords,
        routeData: savedRouteData.selectedRoute,
      };

      const response = await PerformanceMonitor.monitorAPICall(
        'create_trip',
        async () => {
          return await axios.post(`${API_BASE_URL}/trips/create`, tripData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          });
        }
      );

      if (response.data && response.data.success) {
        Alert.alert('Success', 'Trip created successfully!');
        setShowTripModal(false);
        setSavedRouteData(null);
        // Reset form
        setSourceText('');
        setDestText('');
        setSourceCoords(null);
        setDestCoords(null);
        setRoutes([]);
        setSelectedRouteIndex(null);
      }
    } catch (error: any) {
      console.error('Create trip error:', error);
      crashlyticsService.recordError(error as Error, 'Trip creation error');
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setCreatingTrip(false);
    }
  };

  // Save route
  const saveRoute = () => {
    if (selectedRouteIndex === null || !routes[selectedRouteIndex]) {
      Alert.alert('Error', 'Please select a route first');
      return;
    }

    const selectedRoute = routes[selectedRouteIndex];
    setSavedRouteData({
      routeId: selectedRoute.id,
      source: sourceText,
      destination: destText,
      sourceCoords: sourceCoords!,
      destinationCoords: destCoords!,
      selectedRoute,
    });

    Alert.alert(
      'Route Saved',
      'Route has been saved successfully. Would you like to create a trip?',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Create Trip', onPress: () => setShowTripModal(true) },
      ]
    );
  };

  // Error boundary retry
  const retryAfterError = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryAfterError}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <CrashTestButton visible={__DEV__} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.errorText}>Loading...</Text>
        </View>
        <CrashTestButton visible={__DEV__} />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated()) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authWarningContainer}>
          <Text style={styles.authWarningTitle}>Authentication Required</Text>
          <Text style={styles.authWarningText}>
            Please login as a driver to access route planning features.
          </Text>
          <Text style={styles.authWarningSubtext}>
            You can still view the map and search for places, but saving routes requires authentication.
          </Text>
        </View>
        <CrashTestButton visible={__DEV__} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Driver Info Header */}
        {driver && (
          <View style={styles.driverHeader}>
            <Text style={styles.driverHeaderText}>
              Welcome, {driver.name} • {driver.city}
            </Text>
          </View>
        )}

        {/* Map View */}
        <View style={styles.mapContainer}>
          {Platform.OS !== 'web' ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: 28.6139,
                longitude: 77.2090,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              {/* Source Marker */}
              {sourceCoords && (
                <Marker
                  coordinate={{
                    latitude: sourceCoords.lat,
                    longitude: sourceCoords.lng,
                  }}
                  title="Source"
                  pinColor="green"
                />
              )}

              {/* Destination Marker */}
              {destCoords && (
                <Marker
                  coordinate={{
                    latitude: destCoords.lat,
                    longitude: destCoords.lng,
                  }}
                  title="Destination"
                  pinColor="red"
                />
              )}

              {/* Route Polylines */}
              {routes.map((route, index) => (
                <Polyline
                  key={route.id}
                  coordinates={route.coords}
                  strokeColor={index === selectedRouteIndex ? '#2196F3' : 'rgba(0,0,0,0.3)'}
                  strokeWidth={index === selectedRouteIndex ? 6 : 4}
                />
              ))}
            </MapView>
          ) : (
            <View style={styles.webMapPlaceholder}>
              <Text style={styles.webMapText}>Map View (Mobile Only)</Text>
            </View>
          )}
        </View>

        {/* Controls Panel */}
        <View style={styles.controlsPanel}>
          {/* Source Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter source location"
              value={sourceText}
              onChangeText={(text) => {
                setSourceText(text);
                setShowSourceSuggestions(true);
                searchPlaces(text, true);
              }}
              onFocus={() => setShowSourceSuggestions(true)}
            />
            {showSourceSuggestions && sourceSuggestions.length > 0 && (
              <ScrollView style={styles.suggestionsContainer}>
                {sourceSuggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.place_id}
                    style={styles.suggestionItem}
                    onPress={() => handlePlaceSelect(suggestion, true)}
                  >
                    <Text style={styles.suggestionText}>{suggestion.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Destination Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter destination"
              value={destText}
              onChangeText={(text) => {
                setDestText(text);
                setShowDestSuggestions(true);
                searchPlaces(text, false);
              }}
              onFocus={() => setShowDestSuggestions(true)}
            />
            {showDestSuggestions && destSuggestions.length > 0 && (
              <ScrollView style={styles.suggestionsContainer}>
                {destSuggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.place_id}
                    style={styles.suggestionItem}
                    onPress={() => handlePlaceSelect(suggestion, false)}
                  >
                    <Text style={styles.suggestionText}>{suggestion.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Get Routes Button */}
          <TouchableOpacity
            style={[styles.button, (!sourceCoords || !destCoords) && styles.buttonDisabled]}
            onPress={fetchDirections}
            disabled={!sourceCoords || !destCoords || loadingRoutes}
          >
            {loadingRoutes ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Get Routes</Text>
            )}
          </TouchableOpacity>

          {/* Routes List */}
          {routes.length > 0 && (
            <ScrollView style={styles.routesContainer}>
              {routes.map((route, index) => (
                <TouchableOpacity
                  key={route.id}
                  style={[
                    styles.routeItem,
                    index === selectedRouteIndex && styles.selectedRoute
                  ]}
                  onPress={() => setSelectedRouteIndex(index)}
                >
                  <Text style={styles.routeSummary}>{route.summary}</Text>
                  <Text style={styles.routeDetails}>
                    {route.distance} • {route.duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Save Route Button */}
          {selectedRouteIndex !== null && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveRoute}
              disabled={savingRoute}
            >
              {savingRoute ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Route & Create Trip</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Trip Creation Modal */}
        <Modal
          visible={showTripModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create Trip</Text>
              
              {savedRouteData && (
                <View style={styles.tripDetails}>
                  <Text style={styles.tripDetailLabel}>Route Details:</Text>
                  <Text style={styles.tripDetailText}>From: {savedRouteData.source}</Text>
                  <Text style={styles.tripDetailText}>To: {savedRouteData.destination}</Text>
                  <Text style={styles.tripDetailText}>
                    Distance: {savedRouteData.selectedRoute.distance}
                  </Text>
                  <Text style={styles.tripDetailText}>
                    Duration: {savedRouteData.selectedRoute.duration}
                  </Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowTripModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton]}
                  onPress={createTrip}
                  disabled={creatingTrip}
                >
                  {creatingTrip ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.createButtonText}>Create Trip</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Crash Test Button - Only visible in development */}
        <CrashTestButton visible={__DEV__} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  webMapText: {
    fontSize: 16,
    color: '#666',
  },
  controlsPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  suggestionsContainer: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  routesContainer: {
    maxHeight: 200,
    marginBottom: 12,
  },
  routeItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoute: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  routeSummary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authWarningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 12,
    lineHeight: 24,
  },
  authWarningSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  driverHeader: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  driverHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  tripDetails: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tripDetailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tripDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
