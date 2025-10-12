import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../lib/theme';
import { getCities, getBuses, Bus, assignBusToDriver } from '../../../lib/api';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useAuth } from '../../../lib/AuthContext';
import { useRouter } from 'expo-router';
import BusCard from '../../../components/BusCard';

function HomeScreen() {
  const router = useRouter();
  const { driver, isAuthenticated } = useAuth();
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  async function loadCities() {
    try {
      console.log('Loading cities...');
      const res = await getCities();
      console.log('Cities loaded successfully:', res.cities?.length || 0);
      setCities(res.cities || []);
    } catch (e) {
      console.error('Error loading cities:', e);
      setCities([]);
    }
  }

  async function loadBuses(city?: string) {
    try {
      console.log('Loading buses for city:', city || 'all');
      const res = await getBuses(city);
      console.log('Buses loaded successfully:', res.buses?.length || 0);
      setBuses(res.buses || []);
    } catch (e) {
      console.error('Error loading buses:', e);
      setBuses([]);
    }
  }

  async function initialize() {
    try {
      setLoading(true);
      await Promise.all([loadCities(), loadBuses(selectedCity)]);
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // reload when city changes
    loadBuses(selectedCity);
  }, [selectedCity]);

  const onRefresh = async () => {
    setRefreshing(true);
    await initialize();
    setRefreshing(false);
  };

  const header = useMemo(() => (
    <View style={styles.headerArea}>
      <Text style={styles.subtitle}>Select a city to filter buses</Text>
      <View style={styles.selectorRow}>
        <TouchableOpacity style={styles.selector} onPress={() => setCityModalVisible(true)}>
          <Text style={styles.selectorText}>{selectedCity || 'All Cities'}</Text>
          <Text style={styles.selectorCaret}>▾</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [selectedCity]);

  async function onSelectBus(bus: Bus) {
    if (!isAuthenticated() || !driver) {
      alert('Please sign in again. Authentication required.');
      router.replace('/(auth)/login');
      return;
    }
    try {
      setLoading(true);
      const res = await assignBusToDriver({ busId: bus._id, driverId: driver._id });
      // Note: You might want to update the driver context with activeBus if needed
      router.replace('/(app)/(tabs)/routes');
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Failed to assign bus';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}> 
        <ActivityIndicator size="large" color={theme.colors.navy} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={buses}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <BusCard bus={item} onPress={() => onSelectBus(item)} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No buses found {selectedCity ? `in ${selectedCity}` : ''}</Text>}
      />

      {/* City Select Modal */}
      <Modal visible={cityModalVisible} transparent animationType="fade" onRequestClose={() => setCityModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select City</Text>
            <TextInput
              placeholder="Search city..."
              value={citySearch}
              onChangeText={setCitySearch}
              style={styles.searchInput}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <ScrollView style={{ maxHeight: 320 }}>
              <TouchableOpacity
                style={styles.cityItem}
                onPress={() => {
                  setSelectedCity(undefined);
                  setCityModalVisible(false);
                  setCitySearch('');
                }}
              >
                <Text style={[styles.cityText, !selectedCity && { fontWeight: '800' }]}>All Cities</Text>
              </TouchableOpacity>
              {cities
                .filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
                .map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.cityItem}
                    onPress={() => {
                      setSelectedCity(c);
                      setCityModalVisible(false);
                      setCitySearch('');
                    }}
                  >
                    <Text style={[styles.cityText, selectedCity === c && { fontWeight: '800', color: theme.colors.navy }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setCityModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeScreen />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  headerArea: {
    marginBottom: theme.spacing.lg,
  },
  selectorRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.pill,
    minWidth: 140,
  },
  selectorText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  selectorCaret: {
    marginLeft: 8,
    color: theme.colors.textSecondary,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    width: '100%',
    padding: theme.spacing.lg,
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: 10,
  },
  cityItem: {
    paddingVertical: 12,
  },
  cityText: {
    color: theme.colors.textPrimary,
  },
  modalClose: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.navy,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  modalCloseText: {
    color: theme.colors.navyTextOn,
    fontWeight: '700',
  },
  empty: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
