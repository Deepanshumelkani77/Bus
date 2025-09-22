import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../lib/theme';

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routes</Text>
      <Text style={styles.subtitle}>This is a placeholder screen. We can list assigned routes here.</Text>
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
