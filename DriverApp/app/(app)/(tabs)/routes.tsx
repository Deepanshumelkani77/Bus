import React, { useMemo, useState, useRef } from 'react';
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
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { theme } from '../../../lib/theme';

// Type definitions
interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteData {
  summary: string;
  distance: string;
  duration: string;
  coords: { latitude: number; longitude: number }[];
}

// Google Directions API response types
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


// -----------------
// HARD-CODED API KEY (as you requested)
const GOOGLE_API_KEY = "AIzaSyBpr4hS8JlH5-ZJK_cJRGndeeezpdLtbkk";
// -----------------

export default function RoutesMapScreen() {
  // text labels
  const [sourceText, setSourceText] = useState<string>('');
  const [destText, setDestText] = useState<string>('');
  // coords
  const [sourceCoords, setSourceCoords] = useState<Coordinates | null>(null);
  const [destCoords, setDestCoords] = useState<Coordinates | null>(null);
  // routes: [{ summary, distance, duration, coords: [{lat,longitude}, ...] }]
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);

  // lazy-load GooglePlacesAutocomplete to avoid web bundler issues
  const PlacesAutocomplete = useMemo(() => {
    if (Platform.OS === 'web') return null;
    try {
      const mod = require('react-native-google-places-autocomplete');
      return mod.GooglePlacesAutocomplete || mod.default;
    } catch (e) {
      console.warn('react-native-google-places-autocomplete not available:', e);
      return null;
    }
  }, []);

  // decode polyline from Google into [{latitude, longitude}, ...]
  const decodePolyline = (t: string): { latitude: number; longitude: number }[] => {
    if (!t) return [];
    let points = [];
    let index = 0, lat = 0, lng = 0;
    while (index < t.length) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  // Build origin/destination strings and call Directions API
  const fetchRoutes = async () => {
    if (!sourceCoords || !destCoords) {
      Alert.alert('Coordinates missing', 'Pick both source and destination from suggestions.');
      return;
    }
    try {
      setLoadingRoutes(true);
      const origin = `${sourceCoords.lat},${sourceCoords.lng}`;
      const destination = `${destCoords.lat},${destCoords.lng}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json`;
      const res = await axios.get<GoogleDirectionsResponse>(url, {
        params: {
          origin,
          destination,
          alternatives: true,
          key: GOOGLE_API_KEY,
        },
      });

      if (!res.data || res.data.status !== 'OK') {
        console.warn('Directions API response', res.data);
        Alert.alert('Directions error', res.data?.status || 'Failed to fetch routes');
        setRoutes([]);
        return;
      }

      const parsed = res.data.routes.map((r: GoogleDirectionsRoute) => {
        const leg = (r.legs && r.legs[0]) || {};
        return {
          summary: r.summary || 'Route',
          distance: leg.distance ? leg.distance.text : '',
          duration: leg.duration ? leg.duration.text : '',
          coords: decodePolyline(r.overview_polyline.points),
        };
      });

      setRoutes(parsed);
      setSelectedRouteIndex(parsed.length ? 0 : null);

      // fit map to first route if exists
      if (parsed.length && mapRef.current) {
        const coords = parsed[0].coords;
        if (coords && coords.length) {
          mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 80, right: 50, bottom: 200, left: 50 }, animated: true });
        }
      }
    } catch (err) {
      console.error('fetchRoutes error:', err);
      Alert.alert('Error', 'Failed to fetch routes. Check your API key and network.');
    } finally {
      setLoadingRoutes(false);
    }
  };

  // when user selects a route card
  const handleSelectRoute = (index: number) => {
    setSelectedRouteIndex(index);
    const coords = routes[index]?.coords;
    if (coords && coords.length && mapRef.current) {
      mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 80, right: 50, bottom: 200, left: 50 }, animated: true });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        {/* Map (hide on web to avoid compatibility issues) */}
        {Platform.OS !== 'web' ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 29.2183,
              longitude: 79.5125,
              latitudeDelta: 0.2,
              longitudeDelta: 0.2,
            }}
            showsUserLocation={false}
            showsMyLocationButton={true}
          >
            {sourceCoords && <Marker coordinate={{ latitude: sourceCoords.lat, longitude: sourceCoords.lng }} title="Source" />}
            {destCoords && <Marker coordinate={{ latitude: destCoords.lat, longitude: destCoords.lng }} title="Destination" />}

            {/* Draw all routes; highlight selected */}
            {routes.map((r: RouteData, idx: number) => (
              <Polyline
                key={`route-${idx}`}
                coordinates={r.coords}
                strokeColor={idx === selectedRouteIndex ? '#1976D2' : 'rgba(0,0,0,0.3)'}
                strokeWidth={idx === selectedRouteIndex ? 5 : 3}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: '#666' }}>Map preview disabled on web</Text>
          </View>
        )}

        {/* Controls on top */}
        <View style={styles.controls}>
          <Text style={styles.heading}>Plan your route</Text>

          {/* Source Autocomplete or fallback input */}
          <Text style={styles.label}>Source</Text>
          {PlacesAutocomplete ? (
            <PlacesAutocomplete
              placeholder="Enter pickup / source"
              fetchDetails={true}
              debounce={200}
              minLength={2}
              onPress={(data: any, details: any = null) => {
                const desc = data?.description || data?.structured_formatting?.main_text || data?.name || '';
                setSourceText(desc);
                const loc = details && details.geometry && details.geometry.location ? details.geometry.location : null;
                if (loc) setSourceCoords({ lat: loc.lat, lng: loc.lng });
              }}
              query={{ key: GOOGLE_API_KEY, language: 'en' }}
              styles={gpStyles}
              nearbyPlacesAPI="GooglePlacesSearch"
              enablePoweredByContainer={false}
            />
          ) : (
            <TextInput value={sourceText} onChangeText={setSourceText} placeholder="Enter source" style={styles.input} />
          )}

          <Text style={[styles.label, { marginTop: 8 }]}>Destination</Text>
          {PlacesAutocomplete ? (
            <PlacesAutocomplete
              placeholder="Enter drop / destination"
              fetchDetails={true}
              debounce={200}
              minLength={2}
              onPress={(data: any, details: any = null) => {
                const desc = data?.description || data?.structured_formatting?.main_text || data?.name || '';
                setDestText(desc);
                const loc = details && details.geometry && details.geometry.location ? details.geometry.location : null;
                if (loc) setDestCoords({ lat: loc.lat, lng: loc.lng });
              }}
              query={{ key: GOOGLE_API_KEY, language: 'en' }}
              styles={gpStyles}
              nearbyPlacesAPI="GooglePlacesSearch"
              enablePoweredByContainer={false}
            />
          ) : (
            <TextInput value={destText} onChangeText={setDestText} placeholder="Enter destination" style={styles.input} />
          )}

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.button, (!sourceCoords || !destCoords) && styles.buttonDisabled]}
              onPress={fetchRoutes}
              disabled={!sourceCoords || !destCoords || loadingRoutes}
            >
              {loadingRoutes ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Routes</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton]}
              onPress={() => {
                // quick clear
                setRoutes([]);
                setSelectedRouteIndex(null);
                setSourceCoords(null);
                setDestCoords(null);
                setSourceText('');
                setDestText('');
              }}
            >
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Routes list (bottom sheet like) */}
        <View style={styles.routesList}>
          <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 12 }}>
            {routes.length === 0 ? (
              <View style={styles.emptyCard}><Text style={{ color: '#666' }}>No routes yet</Text></View>
            ) : (
              routes.map((r: RouteData, idx: number) => (
                <View key={`card-${idx}`} style={[styles.routeCard, idx === selectedRouteIndex && styles.routeCardSelected]}>
                  <Text style={styles.routeSummary}>{r.summary || `Route ${idx + 1}`}</Text>
                  <Text style={styles.routeMeta}>{r.distance} • {r.duration}</Text>
                  <TouchableOpacity style={styles.selectBtn} onPress={() => handleSelectRoute(idx)}>
                    <Text style={styles.selectBtnText}>{idx === selectedRouteIndex ? 'Selected' : 'Select'}</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  controls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 5 } }),
  },
  heading: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  label: { color: '#444', fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    marginLeft: 10,
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#333', fontWeight: '700' },

  routesList: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    paddingVertical: 8,
  },
  routeCard: {
    width: 200,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'flex-start',
  },
  routeCardSelected: {
    borderColor: '#1976D2',
    backgroundColor: '#E8F0FF',
  },
  routeSummary: { fontWeight: '700', marginBottom: 6 },
  routeMeta: { color: '#666', marginBottom: 8 },
  selectBtn: { backgroundColor: '#1976D2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  selectBtnText: { color: '#fff', fontWeight: '700' },

  emptyCard: {
    width: 200,
    height: 80,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// small styles for GooglePlacesAutocomplete internals
const gpStyles = {
  textInputContainer: { padding: 0, margin: 0 },
  textInput: { height: 44, backgroundColor: '#f7f7f7', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#eee' },
  listView: { backgroundColor: '#fff', borderRadius: 8, marginTop: 6, borderWidth: 1, borderColor: '#eee' },
  row: { paddingVertical: 10, paddingHorizontal: 12 },
  description: { color: '#444' },
};
