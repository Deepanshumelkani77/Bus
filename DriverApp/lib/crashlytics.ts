import crashlytics from '@react-native-firebase/crashlytics';
import { Platform } from 'react-native';

class CrashlyticsService {
  private isEnabled: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Only enable on native platforms (not web)
      if (Platform.OS !== 'web') {
        this.isEnabled = await crashlytics().isCrashlyticsCollectionEnabled;
        
        // Enable crashlytics collection
        await crashlytics().setCrashlyticsCollectionEnabled(true);
        
        console.log('Firebase Crashlytics initialized successfully');
      } else {
        console.log('Crashlytics not available on web platform');
      }
    } catch (error) {
      console.error('Failed to initialize Crashlytics:', error);
    }
  }

  // Log a non-fatal error
  recordError(error: Error, context?: string) {
    if (!this.isEnabled || Platform.OS === 'web') {
      console.error('Crashlytics Error:', error, context);
      return;
    }

    try {
      if (context) {
        crashlytics().log(context);
      }
      crashlytics().recordError(error);
    } catch (e) {
      console.error('Failed to record error to Crashlytics:', e);
    }
  }

  // Log custom events
  log(message: string) {
    if (!this.isEnabled || Platform.OS === 'web') {
      console.log('Crashlytics Log:', message);
      return;
    }

    try {
      crashlytics().log(message);
    } catch (error) {
      console.error('Failed to log to Crashlytics:', error);
    }
  }

  // Set user identifier
  setUserId(userId: string) {
    if (!this.isEnabled || Platform.OS === 'web') {
      console.log('Crashlytics User ID:', userId);
      return;
    }

    try {
      crashlytics().setUserId(userId);
    } catch (error) {
      console.error('Failed to set user ID in Crashlytics:', error);
    }
  }

  // Set custom attributes
  setAttribute(key: string, value: string) {
    if (!this.isEnabled || Platform.OS === 'web') {
      console.log('Crashlytics Attribute:', key, value);
      return;
    }

    try {
      crashlytics().setAttribute(key, value);
    } catch (error) {
      console.error('Failed to set attribute in Crashlytics:', error);
    }
  }

  // Force a crash (for testing only)
  crash() {
    if (!this.isEnabled || Platform.OS === 'web') {
      console.log('Crashlytics crash test (web platform - no actual crash)');
      return;
    }

    try {
      crashlytics().crash();
    } catch (error) {
      console.error('Failed to trigger crash:', error);
    }
  }
}

// Export singleton instance
export const crashlyticsService = new CrashlyticsService();
export default crashlyticsService;
