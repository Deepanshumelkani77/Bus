import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, TextInput } from 'react-native';
import { theme } from '../../../lib/theme';
import { createTrip } from '../../../lib/api';
import { getCurrentDriver } from '../../../lib/session';

// NOTE: We will lazy-require GooglePlacesAutocomplete only when a key exists to avoid web bundler issues
export default function RoutesScreen() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastTripId, setLastTripId] = useState<string | null>(null);
  const [sourceCoords, setSourceCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);

  // Use safe access to env to avoid TS complaints in RN
  const placesKey = "AIzaSyBpr4hS8JlH5-ZJK_cJRGndeeezpdLtbkk"; // your API key

  const PlacesAutocomplete = useMemo(() => {
    if (!placesKey || Platform.OS === 'web') return null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('react-native-google-places-autocomplete');
      return mod.GooglePlacesAutocomplete || mod.default; // ✅ safe fallback
    } catch (e) {
      console.warn('GooglePlacesAutocomplete not available:', e);
      return null;
    }
  }, [placesKey]);

  const handleCreate = async () => {
    if (!source || !destination) {
      Alert.alert('Missing', 'Please enter both source and destination');
      return;
    }
    const driver = getCurrentDriver();
    if (!driver || !driver.activeBus) {
      Alert.alert('No Bus Selected', 'Please select a bus first on Home screen.');
      return;
    }
    try {
      setLoading(true);
      const res = await createTrip({
        busId: driver.activeBus,
        driverId: driver._id,
        source,
        destination,
        sourceCoords,
        destinationCoords,
      });
      setLastTripId(res.trip?._id || null);
      Alert.alert('Success', 'Trip created successfully');
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Failed to create trip';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Plan Your Route</Text>
        <Text style={styles.subtitle}>Set source and destination for your trip</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Source</Text>
          {PlacesAutocomplete ? (
            <PlacesAutocomplete
              placeholder="Enter pickup / source"
              fetchDetails
              debounce={250}
              onPress={(data: any, details: any = null) => {
                const desc = data?.description ?? '';
                setSource(desc);
                const loc = details && details.geometry && details.geometry.location ? details.geometry.location : undefined;
                if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
                  setSourceCoords({ lat: loc.lat, lng: loc.lng });
                } else {
                  setSourceCoords(undefined);
                }
              }}
              query={{ key: placesKey, language: 'en' }}
              styles={gpStyles}
            />
          ) : (
            <TextInput
              placeholder="Enter pickup / source"
              value={source}
              onChangeText={setSource}
              style={styles.input}
              placeholderTextColor={theme.colors.textSecondary}
            />
          )}

          <Text style={styles.label}>Destination</Text>
          {PlacesAutocomplete ? (
            <PlacesAutocomplete
              placeholder="Enter drop / destination"
              fetchDetails
              debounce={250}
              onPress={(data: any, details: any = null) => {
                const desc = data?.description ?? '';
                setDestination(desc);
                const loc = details && details.geometry && details.geometry.location ? details.geometry.location : undefined;
                if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
                  setDestinationCoords({ lat: loc.lat, lng: loc.lng });
                } else {
                  setDestinationCoords(undefined);
                }
              }}
              query={{ key: placesKey, language: 'en' }}
              styles={gpStyles}
            />
          ) : (
            <TextInput
              placeholder="Enter drop / destination"
              value={destination}
              onChangeText={setDestination}
              style={styles.input}
              placeholderTextColor={theme.colors.textSecondary}
            />
          )}

          <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleCreate} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={theme.colors.navyTextOn} />
            ) : (
              <Text style={styles.buttonText}>Find Routes</Text>
            )}
          </TouchableOpacity>

          {lastTripId && (
            <Text style={styles.note}>Trip created: {lastTripId}</Text>
          )}
        </View>

        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>Tip</Text>
          <Text style={styles.hintText}>
            For precise places, we can enable Google Places Autocomplete. You’ll need a Google API key. I can wire this when you’re ready.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadow.card,
  },
  label: {
    color: theme.colors.textSecondary,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  button: {
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: theme.colors.navyTextOn,
    fontWeight: '800',
    fontSize: 16,
  },
  note: {
    marginTop: 12,
    color: theme.colors.textSecondary,
  },
  hintBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  hintTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    marginBottom: 4,
  },
  hintText: {
    color: theme.colors.textSecondary,
  },
});

// Styles for GooglePlacesAutocomplete inputs
const gpStyles = {
  textInputContainer: {
    padding: 0,
    margin: 0,
  },
  textInput: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    height: 44,
    fontSize: 16,
  },
  listView: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginTop: 6,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  description: {
    color: theme.colors.textSecondary,
  },
};
