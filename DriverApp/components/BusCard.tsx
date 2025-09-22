import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '../lib/theme';
import { Bus } from '../lib/api';
import { Ionicons } from '@expo/vector-icons';

function statusMeta(status?: string) {
  // Map backend status to UI display and colors
  if (status === 'Active') return { label: 'On Time', fg: theme.colors.green, bg: theme.colors.greenBg };
  if (status === 'Inactive') return { label: 'Not Started', fg: theme.colors.textSecondary, bg: theme.colors.muted };
  return { label: status || 'Unknown', fg: theme.colors.sky, bg: theme.colors.skyBg };
}

export default function BusCard({ bus }: { bus: Bus }) {
  const meta = statusMeta(bus.status);
  const image = bus.image || 'https://images.unsplash.com/photo-1517940310602-75fb8bdaf2f3?q=80&w=1600&auto=format&fit=crop';
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.iconWrap}>
            <Ionicons name="bus" color={theme.colors.navy} size={16} />
          </View>
          <View>
            <Text style={styles.busNumber}>Bus {bus.busNumber}</Text>
            <Text style={styles.routeText}>{bus.city}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.badgeText, { color: meta.fg }]}>{meta.label}</Text>
        </View>
      </View>

      <Image source={{ uri: image }} style={styles.image} contentFit="cover" transition={200} />

      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>{bus.totalSeats} seats</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>{bus.city}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busNumber: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  routeText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  badgeText: {
    fontWeight: '700',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: theme.radius.md,
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
