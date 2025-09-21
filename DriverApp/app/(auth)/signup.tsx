import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signupDriver } from '../../lib/api';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    if (!name || !email || !password || !city) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const res = await signupDriver({ name: name.trim(), email: email.trim(), password, city: city.trim() });
      Alert.alert('Success', `Welcome ${res.driver.name}`);
      router.replace('/home');
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Signup failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Create Driver Account</Text>
          <Text style={styles.subtitle}>Start driving in your city</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput placeholder="John Doe" value={name} onChangeText={setName} style={styles.input} />

          <Text style={styles.label}>Email</Text>
          <TextInput placeholder="driver@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />

          <Text style={styles.label}>Password</Text>
          <TextInput placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

          <Text style={styles.label}>City</Text>
          <TextInput placeholder="e.g. Jaipur" value={city} onChangeText={setCity} style={styles.input} />

          <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={onSignup} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <Text style={styles.switchText}>
            Already have an account? <Link href="/(auth)/login" style={styles.link}>Sign in</Link>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerWrap: {
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    color: '#94a3b8',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: '#1f2937',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#052e16',
    fontWeight: '800',
    fontSize: 16,
  },
  switchText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
  },
  link: {
    color: '#60a5fa',
    fontWeight: '700',
  },
});
