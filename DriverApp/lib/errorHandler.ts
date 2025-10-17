import crashlyticsService from './crashlytics';

// Global error handler for unhandled promise rejections and errors
export class ErrorHandler {
  static initialize() {
    // Handle unhandled promise rejections
    if (typeof global !== 'undefined') {
      global.addEventListener?.('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        crashlyticsService.recordError(
          new Error(`Unhandled Promise Rejection: ${event.reason}`),
          'Unhandled Promise Rejection'
        );
      });

      // Handle uncaught exceptions
      global.addEventListener?.('error', (event) => {
        console.error('Uncaught error:', event.error);
        crashlyticsService.recordError(
          event.error || new Error('Unknown error'),
          'Uncaught Exception'
        );
      });
    }

    // React Native specific error handling
    if (typeof ErrorUtils !== 'undefined') {
      const originalHandler = ErrorUtils.getGlobalHandler();
      
      ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.error('React Native Error:', error, 'Fatal:', isFatal);
        
        crashlyticsService.recordError(
          error,
          `React Native ${isFatal ? 'Fatal' : 'Non-Fatal'} Error`
        );
        
        // Call original handler
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }

    console.log('Error handler initialized');
  }

  // Manual error reporting
  static reportError(error: Error, context?: string) {
    console.error('Manual error report:', error, context);
    crashlyticsService.recordError(error, context);
  }

  // Log custom events
  static logEvent(message: string) {
    console.log('Event:', message);
    crashlyticsService.log(message);
  }

  // Set user context
  static setUserContext(userId: string, attributes?: Record<string, string>) {
    crashlyticsService.setUserId(userId);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        crashlyticsService.setAttribute(key, value);
      });
    }
  }
}

export default ErrorHandler;
