import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../lib/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>This is a placeholder screen. We can show driver profile details here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
});
