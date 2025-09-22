import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { theme } from '../lib/theme';
import BusLogo from './BusLogo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SidebarContent() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BusLogo size={72} iconSize={36} variant="darkOnLight" />
        <Text style={styles.brand}>BusTrac</Text>
        <Text style={styles.subtitle}>Driver Console</Text>
      </View>

      <View style={styles.links}>
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
      </View>

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
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
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
});
