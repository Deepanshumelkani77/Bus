import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../lib/theme';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Home</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 80,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  button: {
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: theme.colors.navyTextOn,
    fontWeight: '700',
  },
});
