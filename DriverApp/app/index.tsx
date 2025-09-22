import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../lib/theme';
import BusLogo from '../components/BusLogo';

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>BusTrac</Text>
      <BusLogo size={88} iconSize={48} />
      <Text style={styles.title}>Welcome to BusTrac</Text>
      <Text style={styles.subtitle}>Please select your login type</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.primaryText}>Admin Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.secondaryText}>Driver Login</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By proceeding, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  appName: {
    position: 'absolute',
    top: 60,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: theme.colors.navy,
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    width: '100%',
  },
  primaryText: {
    color: theme.colors.navyTextOn,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: theme.colors.muted,
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  secondaryText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    opacity: 0.9,
  },
  terms: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    position: 'absolute',
    bottom: 24,
    paddingHorizontal: theme.spacing.lg,
  },
  link: {
    color: theme.colors.navy,
    fontWeight: '700',
  },
});
