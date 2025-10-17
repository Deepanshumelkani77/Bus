// Crashlytics setup for React Native
import crashlytics from '@react-native-firebase/crashlytics';

// Initialize crashlytics
export const initializeCrashlytics = () => {
  // Enable crashlytics collection
  crashlytics().setCrashlyticsCollectionEnabled(true);
  
  console.log('Firebase Crashlytics initialized');
};

// Log custom errors
export const logError = (error: Error, context?: string) => {
  if (context) {
    crashlytics().log(`Context: ${context}`);
  }
  crashlytics().recordError(error);
};

// Log custom events
export const logEvent = (event: string, attributes?: { [key: string]: string }) => {
  crashlytics().log(event);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      crashlytics().setAttribute(key, value);
    });
  }
};

// Set user identifier
export const setUserId = (userId: string) => {
  crashlytics().setUserId(userId);
};

// Test crash (for testing purposes only)
export const testCrash = () => {
  crashlytics().crash();
};

export default crashlytics;
