import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { theme } from '../lib/theme';
import BusLogo from './BusLogo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../lib/AuthContext';

export default function SidebarContent() {
  const { driver, logout } = useAuth();
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fade, slide]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Decorative blobs */}
        <View style={styles.blobOne} />
        <View style={styles.blobTwo} />
        <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ translateY: slide }] }}>
          <BusLogo size={74} iconSize={38} variant="darkOnLight" />
          <Text style={styles.brand}>BusTrac</Text>
          <Text style={styles.subtitle}>Driver Console</Text>
          {driver && (
            <Text style={styles.driverName}>{driver.name}</Text>
          )}
        </Animated.View>
      </View>

      <Animated.View style={[styles.links, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.linkRow}>
            <MaterialCommunityIcons name="view-dashboard" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.linkText}>Dashboard</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/routes" asChild>
          <TouchableOpacity style={styles.linkRow}>
            <MaterialCommunityIcons name="map" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.linkText}>Routes</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.linkRow}>
            <MaterialCommunityIcons name="account" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.linkText}>Profile</Text>
          </TouchableOpacity>
        </Link>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} BusTrac</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card,
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    overflow: 'hidden',
  },
  blobOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 120,
    backgroundColor: theme.colors.skyBg,
    top: -40,
    right: -40,
  },
  blobTwo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: theme.colors.tealBg,
    bottom: -30,
    left: -30,
  },
  brand: {
    marginTop: 10,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  links: {
    padding: 16,
    gap: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.muted,
  },
  linkText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    color: theme.colors.textSecondary,
  },
  driverName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: '#FEF2F2', // light red background
    marginTop: 8,
  },
  logoutText: {
    color: '#EF4444', // red color
    fontWeight: '700',
  },
});
