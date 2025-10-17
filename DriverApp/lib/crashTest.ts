import crashlyticsService from './crashlytics';
import ErrorHandler from './errorHandler';

/**
 * Crash testing utilities for validating Firebase Crashlytics integration
 * Use these functions to test crash reporting in development/testing environments
 */
export class CrashTest {
  
  /**
   * Force a test crash (use only for testing!)
   */
  static forceCrash() {
    console.log('🔥 Forcing test crash for Crashlytics validation...');
    crashlyticsService.crash();
  }

  /**
   * Test non-fatal error logging
   */
  static testNonFatalError() {
    console.log('⚠️ Testing non-fatal error logging...');
    const testError = new Error('Test non-fatal error for Crashlytics validation');
    ErrorHandler.reportError(testError, 'Crashlytics Test - Non-Fatal Error');
  }

  /**
   * Test promise rejection handling
   */
  static testPromiseRejection() {
    console.log('🚫 Testing unhandled promise rejection...');
    // This will be caught by the global error handler
    Promise.reject(new Error('Test unhandled promise rejection'));
  }

  /**
   * Test API error simulation
   */
  static testAPIError() {
    console.log('🌐 Testing API error simulation...');
    const apiError = new Error('Simulated API timeout error');
    apiError.name = 'NetworkError';
    ErrorHandler.reportError(apiError, 'API Error Test - Route Page Simulation');
  }

  /**
   * Test user context logging
   */
  static testUserContext(driverId: string = 'test-driver-123') {
    console.log('👤 Testing user context logging...');
    ErrorHandler.setUserContext(driverId, {
      name: 'Test Driver',
      email: 'test@example.com',
      city: 'Test City',
      role: 'driver',
      testMode: 'true'
    });
    
    ErrorHandler.logEvent('User context test completed');
  }

  /**
   * Test custom attributes and logging
   */
  static testCustomLogging() {
    console.log('📝 Testing custom logging and attributes...');
    
    // Test custom attributes
    crashlyticsService.setAttribute('test_scenario', 'crash_validation');
    crashlyticsService.setAttribute('app_version', '1.0.0');
    crashlyticsService.setAttribute('test_timestamp', new Date().toISOString());
    
    // Test custom logging
    crashlyticsService.log('Starting crash test sequence');
    crashlyticsService.log('Testing custom attribute setting');
    crashlyticsService.log('Crash test sequence completed');
    
    ErrorHandler.logEvent('Custom logging test completed');
  }

  /**
   * Run comprehensive crash test suite
   */
  static runTestSuite(driverId?: string) {
    console.log('🧪 Running comprehensive Crashlytics test suite...');
    
    // Test 1: User context
    this.testUserContext(driverId);
    
    // Test 2: Custom logging
    setTimeout(() => {
      this.testCustomLogging();
    }, 1000);
    
    // Test 3: Non-fatal error
    setTimeout(() => {
      this.testNonFatalError();
    }, 2000);
    
    // Test 4: API error simulation
    setTimeout(() => {
      this.testAPIError();
    }, 3000);
    
    // Test 5: Promise rejection (optional - can be disruptive)
    // setTimeout(() => {
    //   this.testPromiseRejection();
    // }, 4000);
    
    console.log('✅ Test suite scheduled. Check Firebase Console in a few minutes for results.');
    console.log('🔗 Firebase Console: https://console.firebase.google.com/project/bustrac-16074/crashlytics');
  }

  /**
   * Test route page specific errors
   */
  static testRoutePageErrors() {
    console.log('🗺️ Testing Route page specific error scenarios...');
    
    // Simulate Google Places API error
    const placesError = new Error('Google Places API request failed');
    placesError.name = 'PlacesAPIError';
    ErrorHandler.reportError(placesError, 'Route Page - Places API Error');
    
    // Simulate Directions API error
    const directionsError = new Error('Google Directions API timeout');
    directionsError.name = 'DirectionsAPIError';
    ErrorHandler.reportError(directionsError, 'Route Page - Directions API Error');
    
    // Simulate location permission error
    const locationError = new Error('Location permission denied');
    locationError.name = 'LocationPermissionError';
    ErrorHandler.reportError(locationError, 'Route Page - Location Permission Error');
    
    // Simulate map rendering error
    const mapError = new Error('MapView rendering failed');
    mapError.name = 'MapRenderError';
    ErrorHandler.reportError(mapError, 'Route Page - Map Rendering Error');
    
    console.log('✅ Route page error tests completed');
  }
}

export default CrashTest;
