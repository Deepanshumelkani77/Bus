// Crashlytics setup for Expo/Web (using console logging as fallback)
// Initialize crashlytics
export const initializeCrashlytics = () => {
  console.log('Firebase Crashlytics initialized (Web fallback)');
};

// Log custom errors
export const logError = (error: Error, context?: string) => {
  console.error(`[Crashlytics] ${context || 'Error'}:`, error);
  // In production, you could send this to a logging service
};

// Log custom events
export const logEvent = (event: string, attributes?: { [key: string]: string }) => {
  console.log(`[Crashlytics] Event: ${event}`, attributes);
  // In production, you could send this to an analytics service
};

// Set user identifier
export const setUserId = (userId: string) => {
  console.log(`[Crashlytics] User ID set: ${userId}`);
  // In production, you could store this for error attribution
};

// Test crash (for testing purposes only)
export const testCrash = () => {
  console.warn('[Crashlytics] Test crash called (no-op in web environment)');
};
