import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { loginDriver } from '../../lib/api';
import { setCurrentDriver } from '../../lib/session';
import { theme } from '../../lib/theme';
import BusLogo from '../../components/BusLogo';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [fade, slide, float]);

  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const res = await loginDriver({ email: email.trim(), password });
      // TODO: store token securely (SecureStore/Keychain). For MVP, set session in-memory/localStorage.
      setCurrentDriver(res.driver);
      Alert.alert('Welcome', `Logged in as ${res.driver.name}`);
      router.replace('/(app)');
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Login failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        {/* Animated hero */}
        <View style={styles.hero}>
          <Animated.View style={[styles.blobOne, { transform: [{ translateY: floatY }] }]} />
          <View style={styles.blobTwo} />
          <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ translateY: slide }] }}>
            <Text style={styles.brand}>BusTrac</Text>
            <View style={{ marginTop: 8, marginBottom: 12 }}>
              <BusLogo size={64} iconSize={36} variant="lightOnDark" />
            </View>
            <Text style={styles.heroTitle}>Welcome back</Text>
            <Text style={styles.heroSubtitle}>Sign in to continue</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="driver@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={onLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>
          <Text style={styles.switchText}>
            New driver? <Link href="/(auth)/signup" style={styles.link}>Create an account</Link>
          </Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
  },
  hero: {
    backgroundColor: theme.colors.navy,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: theme.spacing.lg,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    marginHorizontal: -theme.spacing.lg,
    overflow: 'hidden',
  },
  blobOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 120,
    backgroundColor: 'rgba(56,189,248,0.20)', // sky
    top: -50,
    right: -30,
  },
  blobTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: 'rgba(20,184,166,0.18)', // teal
    bottom: -30,
    left: -20,
  },
  brand: {
    color: theme.colors.navyTextOn,
    opacity: 0.9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    fontSize: 16,
  },
  heroTitle: {
    color: theme.colors.navyTextOn,
    fontSize: 26,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
    marginTop: -24,
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
    width: '100%',
    ...theme.shadow.card,
  },
  buttonText: {
    color: theme.colors.navyTextOn,
    fontWeight: '800',
    fontSize: 16,
  },
  switchText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  link: {
    color: theme.colors.navy,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    paddingHorizontal: 8,
  },
});
