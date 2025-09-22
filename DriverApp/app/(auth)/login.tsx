import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { loginDriver } from '../../lib/api';
import { theme } from '../../lib/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const res = await loginDriver({ email: email.trim(), password });
      // TODO: store token securely (SecureStore/Keychain). For MVP, navigate to Home.
      Alert.alert('Welcome', `Logged in as ${res.driver.name}`);
      router.replace('/home');
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
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Driver Login</Text>
          <Text style={styles.subtitle}>Access your driver dashboard</Text>
        </View>

        <View style={styles.card}>
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

          <Text style={styles.switchText}>
            New driver? <Link href="/(auth)/signup" style={styles.link}>Create an account</Link>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 80,
  },
  headerWrap: {
    marginBottom: 24,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
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
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
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
});
