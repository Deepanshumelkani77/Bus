import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../lib/theme';
import BusLogo from '../components/BusLogo';

export default function Index() {
  const router = useRouter();

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
    ]).start();

    // Subtle floating loop for background blob
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [fade, scale, float]);

  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <View style={styles.container}>
      {/* Decorative blobs */}
      <Animated.View style={[styles.blobOne, { transform: [{ translateY: floatY }] }]} />
      <View style={styles.blobTwo} />

      <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ scale }] }}>
        <Text style={styles.appName}>BusTrac</Text>
        <BusLogo size={96} iconSize={54} variant="darkOnLight" />
        <Text style={styles.title}>Welcome to BusTrac</Text>
        <Text style={styles.subtitle}>This app is for drivers. Sign in to continue or create a new account.</Text>
      </Animated.View>

      <View style={styles.ctaWrap}>
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9} style={styles.secondaryBtn} onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.secondaryText}>Create Account</Text>
        </TouchableOpacity>
      </View>

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
  blobOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.skyBg,
    top: -40,
    right: -30,
  },
  blobTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 100,
    backgroundColor: theme.colors.tealBg,
    bottom: -30,
    left: -20,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaWrap: {
    width: '100%',
    paddingHorizontal: 6,
    marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: theme.colors.navy,
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    width: '100%',
    ...theme.shadow.card,
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
    ...theme.shadow.card,
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
