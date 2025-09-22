import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { theme } from '../lib/theme';
import { getBuses, getCities, Bus } from '../lib/api';
import BusCard from '../components/BusCard';

function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions?.({ title: "Today's Schedule" });
  }, [navigation]);

  async function loadCities() {
    try {
      const res = await getCities();
      setCities(res.cities);
    } catch (e) {
      // noop
    }
  }

  async function loadBuses(city?: string) {
    const res = await getBuses(city);
    setBuses(res.buses);
  }

  async function initialize() {
    setLoading(true);
    await Promise.all([loadCities(), loadBuses(selectedCity)]);
    setLoading(false);
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
      <Text style={styles.pageTitle}>Today's Schedule</Text>
      <Text style={styles.subtitle}>Choose city to filter buses</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        <Chip label="All" selected={!selectedCity} onPress={() => setSelectedCity(undefined)} />
        {cities.map((c) => (
          <Chip key={c} label={c} selected={selectedCity === c} onPress={() => setSelectedCity(c)} />
        ))}
      </ScrollView>
    </View>
  ), [cities, selectedCity]);

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
        renderItem={({ item }) => <BusCard bus={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No buses found {selectedCity ? `in ${selectedCity}` : ''}</Text>}
      />
    </View>
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
  pageTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  chipsRow: {
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.pill,
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: theme.colors.navy,
  },
  chipText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: theme.colors.navyTextOn,
  },
  empty: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
