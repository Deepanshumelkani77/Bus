import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CrashTest from '@/lib/crashTest';
import { useAuth } from '@/lib/AuthContext';

interface CrashTestButtonProps {
  visible?: boolean;
}

export default function CrashTestButton({ visible = __DEV__ }: CrashTestButtonProps) {
  const { driver } = useAuth();

  if (!visible) return null;

  const handleTestSuite = () => {
    Alert.alert(
      'Run Crash Test Suite?',
      'This will test Firebase Crashlytics integration by logging test errors and events. Check Firebase Console after running.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Run Tests',
          onPress: () => {
            CrashTest.runTestSuite(driver?._id);
          },
        },
      ]
    );
  };

  const handleRouteTests = () => {
    Alert.alert(
      'Test Route Page Errors?',
      'This will simulate common Route page errors for crash reporting validation.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Test Errors',
          onPress: () => {
            CrashTest.testRoutePageErrors();
          },
        },
      ]
    );
  };

  const handleForceCrash = () => {
    Alert.alert(
      '⚠️ Force App Crash?',
      'This will force the app to crash for testing purposes. The app will close immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Force Crash',
          style: 'destructive',
          onPress: () => {
            CrashTest.forceCrash();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Crashlytics Testing</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleTestSuite}>
        <Text style={styles.buttonText}>Run Test Suite</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRouteTests}>
        <Text style={styles.buttonText}>Test Route Errors</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleForceCrash}>
        <Text style={styles.buttonText}>⚠️ Force Crash</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Check Firebase Console after testing:{'\n'}
        console.firebase.google.com/project/bustrac-16074/crashlytics
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    minWidth: 200,
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  note: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
});
