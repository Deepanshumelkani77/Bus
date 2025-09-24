import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '../lib/theme';
import { Bus } from '../lib/api';
import { Ionicons } from '@expo/vector-icons';

function statusMeta(status?: string) {
  // Keep explicit Active/Inactive labels
  if (status === 'Active') return { label: 'Active', fg: theme.colors.green, bg: theme.colors.greenBg };
  if (status === 'Inactive') return { label: 'Inactive', fg: theme.colors.textSecondary, bg: theme.colors.muted };
  return { label: status || 'Unknown', fg: theme.colors.sky, bg: theme.colors.skyBg };
}

export default function BusCard({ bus, onPress }: { bus: Bus; onPress?: () => void }) {
  const meta = statusMeta(bus.status);
  const image = bus.image || 'https://images.unsplash.com/photo-1517940310602-75fb8bdaf2f3?q=80&w=1600&auto=format&fit=crop';
  const Container: React.ComponentType<any> = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { activeOpacity: 0.9, onPress } : {};

  return (
    <Container style={styles.card} {...containerProps}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.overlayTop}>
          <View style={styles.titleRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="bus" color={theme.colors.navy} size={16} />
            </View>
            <Text style={styles.busNumber}>Bus {bus.busNumber}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: meta.bg }]}> 
            <Text style={[styles.badgeText, { color: meta.fg }]}>{meta.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.metaItem}>
          <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>{bus.totalSeats} seats</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>{bus.city}</Text>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <View style={styles.progressBarFill} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.card,
  },
  imageWrap: {
    position: 'relative',
    padding: theme.spacing.lg,
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
    fontSize: 18,
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
    height: 170,
    borderRadius: theme.radius.lg,
  },
  overlayTop: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    top: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
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
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.pill,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  progressBarFill: {
    height: 6,
    width: '65%',
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.pill,
  },
});
