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
import { theme } from '../../../lib/theme';

// Google API Key is handled by backend - no need for client-side key

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

interface GoogleDirectionsLeg {
  distance?: { text: string; value: number };
  duration?: { text: string; value: number };
}

interface GoogleDirectionsRoute {
  summary?: string;
  legs?: GoogleDirectionsLeg[];
  overview_polyline: { points: string };
}

interface GoogleDirectionsResponse {
  status: string;
  routes: GoogleDirectionsRoute[];
}

export default function RoutesScreen() {
  const { driver, token, isAuthenticated } = useAuth();

  // Add error boundary and safety checks
  if (!isAuthenticated()) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please login to access routes</Text>
        </View>
      </SafeAreaView>
    );
  }
  
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
  const [savedRouteData, setSavedRouteData] = useState<any>(null);
  
  // Search states
  const [sourceSuggestions, setSourceSuggestions] = useState<PlaceResult[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<PlaceResult[]>([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState<boolean>(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);

  // Decode polyline from Google Directions API
  const decodePolyline = (encoded: string): { latitude: number; longitude: number }[] => {
    if (!encoded) return [];
    const points: { latitude: number; longitude: number }[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  // Search places using backend Google API
  const searchPlaces = async (query: string, isSource: boolean) => {
    if (query.length < 2) {
      if (isSource) {
        setSourceSuggestions([]);
        setShowSourceSuggestions(false);
      } else {
        setDestSuggestions([]);
        setShowDestSuggestions(false);
      }
      return;
    }

    try {
      console.log('Searching places for:', query);
      const response = await axios.get(
        `https://bustrac-backend.onrender.com/google/autocomplete`,
        {
          params: {
            input: query,
          },
        }
      );

      console.log('Places API response:', response.data);

      if (response.data.status === 'OK') {
        const suggestions = response.data.predictions.slice(0, 5);
        if (isSource) {
          setSourceSuggestions(suggestions);
          setShowSourceSuggestions(true);
        } else {
          setDestSuggestions(suggestions);
          setShowDestSuggestions(true);
        }
      } else {
        console.warn('Places API error:', response.data.status);
      }
    } catch (error) {
      console.error('Places API error:', error);
      Alert.alert('Search Error', 'Failed to search places. Please check your internet connection.');
    }
  };

  // Get place details using backend Google API
  const getPlaceDetails = async (placeId: string, isSource: boolean) => {
    try {
      console.log('Getting place details for:', placeId);
      const response = await axios.get(
        `https://bustrac-backend.onrender.com/google/place-details`,
        {
          params: {
            place_id: placeId,
          },
        }
      );

      console.log('Place details response:', response.data);

      if (response.data.status === 'OK') {
        const place = response.data.result;
        const coords = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        };

        if (isSource) {
          setSourceCoords(coords);
          setSourceText(place.formatted_address || place.name);
          setShowSourceSuggestions(false);
        } else {
          setDestCoords(coords);
          setDestText(place.formatted_address || place.name);
          setShowDestSuggestions(false);
        }
      } else {
        console.warn('Place details error:', response.data.status);
      }
    } catch (error) {
      console.error('Place details error:', error);
      Alert.alert('Location Error', 'Failed to get location details.');
    }
  };

  // Fetch routes using backend Google Directions API
  const fetchRoutes = async () => {
    if (!sourceCoords || !destCoords) {
      Alert.alert('Missing Locations', 'Please select both source and destination');
      return;
    }

    try {
      setLoadingRoutes(true);
      const origin = `${sourceCoords.lat},${sourceCoords.lng}`;
      const destination = `${destCoords.lat},${destCoords.lng}`;

      console.log('Fetching routes from:', origin, 'to:', destination);

      const response = await axios.get<GoogleDirectionsResponse>(
        `https://bustrac-backend.onrender.com/google/directions`,
        {
          params: {
            origin,
            destination,
          },
        }
      );

      console.log('Directions API response:', response.data);

      if (response.data.status !== 'OK') {
        Alert.alert('Route Error', response.data.status || 'Failed to fetch routes');
        return;
      }

      const parsedRoutes = response.data.routes.map((route: GoogleDirectionsRoute, index: number) => {
        const leg = route.legs?.[0] || {};
        return {
          id: `route_${index}_${Date.now()}`,
          summary: route.summary || `Route ${index + 1}`,
          distance: leg.distance?.text || 'N/A',
          duration: leg.duration?.text || 'N/A',
          distanceValue: leg.distance?.value || 0,
          durationValue: leg.duration?.value || 0,
          coords: decodePolyline(route.overview_polyline.points),
        };
      });

      setRoutes(parsedRoutes);
      setSelectedRouteIndex(0);

      // Fit map to show the first route
      if (parsedRoutes.length > 0 && mapRef.current) {
        const coords = parsedRoutes[0].coords;
        if (coords.length > 0) {
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('Directions API error:', error);
      Alert.alert('Route Error', 'Failed to fetch routes. Please check your internet connection and try again.');
    } finally {
      setLoadingRoutes(false);
    }
  };

  // Select a route
  const selectRoute = (index: number) => {
    setSelectedRouteIndex(index);
    const route = routes[index];
    if (route && route.coords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(route.coords, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  };

  // Save selected route to backend
  const saveRoute = async () => {
    if (selectedRouteIndex === null || !routes[selectedRouteIndex]) {
      Alert.alert('No Route Selected', 'Please select a route first');
      return;
    }

    if (!isAuthenticated() || !driver || !token) {
      Alert.alert('Authentication Required', 'Please login to save routes');
      return;
    }

    try {
      setSavingRoute(true);
      const selectedRoute = routes[selectedRouteIndex];
      
      // Save route to backend with proper authentication
      const response = await axios.post(
        'https://bustrac-backend.onrender.com/routes/save',
        {
          driverId: driver._id,
          source: sourceText,
          destination: destText,
          sourceCoords,
          destinationCoords: destCoords,
          selectedRoute: {
            summary: selectedRoute.summary,
            distance: selectedRoute.distance,
            duration: selectedRoute.duration,
            distanceValue: selectedRoute.distanceValue,
            durationValue: selectedRoute.durationValue,
            polyline: selectedRoute.coords,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Store the saved route data for trip creation
        setSavedRouteData({
          routeId: response.data.route._id,
          source: sourceText,
          destination: destText,
          sourceCoords,
          destinationCoords: destCoords,
          selectedRoute: selectedRoute
        });
        
        Alert.alert(
          'Route Saved Successfully!', 
          'Would you like to create a trip for this route?',
          [
            {
              text: 'Later',
              style: 'cancel',
              onPress: () => clearRoute(),
            },
            {
              text: 'Create Trip',
              onPress: () => setShowTripModal(true),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to save route. Please try again.');
      }
    } catch (error) {
      console.error('Save route error:', error);
      Alert.alert('Error', 'Failed to save route. Please try again.');
    } finally {
      setSavingRoute(false);
    }
  };

  // Clear route data
  const clearRoute = () => {
    setSourceText('');
    setDestText('');
    setSourceCoords(null);
    setDestCoords(null);
    setRoutes([]);
    setSelectedRouteIndex(null);
    setSourceSuggestions([]);
    setDestSuggestions([]);
    setShowSourceSuggestions(false);
    setShowDestSuggestions(false);
  };

  // Create trip function
  const createTrip = async () => {
    if (!savedRouteData || !driver) {
      Alert.alert('Error', 'Missing route or driver information');
      return;
    }

    try {
      setCreatingTrip(true);
      
      // For now, we'll use a placeholder busId. In a real app, this would come from bus selection
      const busId = driver.activeBus || '507f1f77bcf86cd799439011'; // placeholder bus ID
      
      const tripData = {
        busId: busId,
        driverId: driver._id,
        source: savedRouteData.source,
        destination: savedRouteData.destination,
        sourceCoords: savedRouteData.sourceCoords,
        destinationCoords: savedRouteData.destinationCoords,
      };

      const response = await axios.post(
        'https://bustrac-backend.onrender.com/trips/create',
        tripData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert(
          'Trip Created Successfully!',
          `Trip from ${savedRouteData.source} to ${savedRouteData.destination} has been created.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setShowTripModal(false);
                clearRoute();
                setSavedRouteData(null);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Create trip error:', error);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setCreatingTrip(false);
    }
  };

  // Show authentication warning if not logged in
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
              showsUserLocation={true}
              showsMyLocationButton={true}
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
          <Text style={styles.title}>Plan Your Route</Text>

          {/* Source Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Source Location</Text>
            <TextInput
              style={styles.textInput}
              value={sourceText}
              onChangeText={(text) => {
                setSourceText(text);
                searchPlaces(text, true);
              }}
              placeholder="Enter pickup location (e.g., Delhi, India)"
              placeholderTextColor="#999"
            />
            {/* Manual coordinate entry for testing */}
            {!sourceCoords && sourceText.length > 0 && (
              <TouchableOpacity
                style={styles.manualButton}
                onPress={() => {
                  // Demo coordinates for Delhi
                  setSourceCoords({ lat: 28.6139, lng: 77.2090 });
                  setSourceText(sourceText || 'Delhi, India');
                  setShowSourceSuggestions(false);
                }}
              >
                <Text style={styles.manualButtonText}>Use "{sourceText}" as source</Text>
              </TouchableOpacity>
            )}
            {showSourceSuggestions && sourceSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {sourceSuggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.place_id}
                    style={styles.suggestionItem}
                    onPress={() => getPlaceDetails(suggestion.place_id, true)}
                  >
                    <Text style={styles.suggestionText}>{suggestion.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Destination Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Destination Location</Text>
            <TextInput
              style={styles.textInput}
              value={destText}
              onChangeText={(text) => {
                setDestText(text);
                searchPlaces(text, false);
              }}
              placeholder="Enter destination location (e.g., Mumbai, India)"
              placeholderTextColor="#999"
            />
            {/* Manual coordinate entry for testing */}
            {!destCoords && destText.length > 0 && (
              <TouchableOpacity
                style={styles.manualButton}
                onPress={() => {
                  // Demo coordinates for Mumbai
                  setDestCoords({ lat: 19.0760, lng: 72.8777 });
                  setDestText(destText || 'Mumbai, India');
                  setShowDestSuggestions(false);
                }}
              >
                <Text style={styles.manualButtonText}>Use "{destText}" as destination</Text>
              </TouchableOpacity>
            )}
            {showDestSuggestions && destSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {destSuggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.place_id}
                    style={styles.suggestionItem}
                    onPress={() => getPlaceDetails(suggestion.place_id, false)}
                  >
                    <Text style={styles.suggestionText}>{suggestion.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!sourceCoords || !destCoords || loadingRoutes) && styles.disabledButton,
              ]}
              onPress={fetchRoutes}
              disabled={!sourceCoords || !destCoords || loadingRoutes}
            >
              {loadingRoutes ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Find Routes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={clearRoute}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Routes List */}
        {routes.length > 0 && (
          <View style={styles.routesContainer}>
            <Text style={styles.routesTitle}>Available Routes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {routes.map((route, index) => (
                <TouchableOpacity
                  key={route.id}
                  style={[
                    styles.routeCard,
                    index === selectedRouteIndex && styles.selectedRouteCard,
                  ]}
                  onPress={() => selectRoute(index)}
                >
                  <Text style={styles.routeSummary}>{route.summary}</Text>
                  <Text style={styles.routeDistance}>{route.distance}</Text>
                  <Text style={styles.routeDuration}>{route.duration}</Text>
                  <Text style={[
                    styles.routeStatus,
                    index === selectedRouteIndex && styles.selectedRouteStatus,
                  ]}>
                    {index === selectedRouteIndex ? 'Selected' : 'Select'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Save Route Button */}
            {selectedRouteIndex !== null && (
              <TouchableOpacity
                style={[styles.saveButton, savingRoute && styles.disabledButton]}
                onPress={saveRoute}
                disabled={savingRoute}
              >
                {savingRoute ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Selected Route</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Trip Creation Modal */}
        <Modal
          visible={showTripModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTripModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create Trip</Text>
              
              {savedRouteData && (
                <View style={styles.tripDetails}>
                  <Text style={styles.tripDetailLabel}>Route Details:</Text>
                  <Text style={styles.tripDetailText}>From: {savedRouteData.source}</Text>
                  <Text style={styles.tripDetailText}>To: {savedRouteData.destination}</Text>
                  <Text style={styles.tripDetailText}>Distance: {savedRouteData.selectedRoute?.distance}</Text>
                  <Text style={styles.tripDetailText}>Duration: {savedRouteData.selectedRoute?.duration}</Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowTripModal(false);
                    setSavedRouteData(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton, creatingTrip && styles.disabledButton]}
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
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
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  routesContainer: {
    backgroundColor: '#fff',
    padding: 16,
    maxHeight: 200,
  },
  routesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  routeCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 180,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRouteCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  routeSummary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  routeDistance: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  routeDuration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  routeStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
    textAlign: 'center',
  },
  selectedRouteStatus: {
    color: '#1976D2',
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
  manualButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  manualButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
  // Modal styles
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
});