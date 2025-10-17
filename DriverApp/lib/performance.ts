// Performance monitoring service for tracking app performance metrics
// Note: Firebase Performance Monitoring requires native build - using manual timing for Expo
import crashlyticsService from './crashlytics';

/**
 * Performance monitoring service for tracking app performance metrics
 * Uses manual timing since Firebase Performance requires native build
 */
export class PerformanceMonitor {
  private static traces: Map<string, { startTime: number; metrics: Record<string, number>; attributes: Record<string, string> }> = new Map();

  /**
   * Start a performance trace
   */
  static async startTrace(traceName: string): Promise<void> {
    try {
      const trace = {
        startTime: Date.now(),
        metrics: {},
        attributes: {}
      };
      this.traces.set(traceName, trace);
      console.log(`📊 Started performance trace: ${traceName}`);
    } catch (error) {
      console.error('Failed to start performance trace:', error);
      crashlyticsService.recordError(error as Error, `Performance trace start failed: ${traceName}`);
    }
  }

  /**
   * Stop a performance trace
   */
  static async stopTrace(traceName: string): Promise<void> {
    try {
      const trace = this.traces.get(traceName);
      if (trace) {
        const duration = Date.now() - trace.startTime;
        console.log(`📊 Stopped performance trace: ${traceName} (${duration}ms)`);
        
        // Log performance data to Crashlytics
        crashlyticsService.log(`Performance: ${traceName} completed in ${duration}ms`);
        crashlyticsService.setAttribute(`perf_${traceName}_duration`, duration.toString());
        
        this.traces.delete(traceName);
      }
    } catch (error) {
      console.error('Failed to stop performance trace:', error);
      crashlyticsService.recordError(error as Error, `Performance trace stop failed: ${traceName}`);
    }
  }

  /**
   * Add custom metric to a trace
   */
  static async addMetric(traceName: string, metricName: string, value: number): Promise<void> {
    try {
      const trace = this.traces.get(traceName);
      if (trace) {
        trace.metrics[metricName] = value;
        console.log(`📊 Added metric ${metricName}: ${value} to trace ${traceName}`);
      }
    } catch (error) {
      console.error('Failed to add metric to trace:', error);
      crashlyticsService.recordError(error as Error, `Performance metric failed: ${traceName}.${metricName}`);
    }
  }

  /**
   * Add custom attribute to a trace
   */
  static async addAttribute(traceName: string, attributeName: string, value: string): Promise<void> {
    try {
      const trace = this.traces.get(traceName);
      if (trace) {
        trace.attributes[attributeName] = value;
        console.log(`📊 Added attribute ${attributeName}: ${value} to trace ${traceName}`);
      }
    } catch (error) {
      console.error('Failed to add attribute to trace:', error);
      crashlyticsService.recordError(error as Error, `Performance attribute failed: ${traceName}.${attributeName}`);
    }
  }

  /**
   * Monitor API call performance
   */
  static async monitorAPICall<T>(
    apiName: string,
    apiCall: () => Promise<T>,
    additionalMetrics?: Record<string, number>
  ): Promise<T> {
    const traceName = `api_${apiName}`;
    const startTime = Date.now();

    try {
      await this.startTrace(traceName);
      await this.addAttribute(traceName, 'api_name', apiName);
      await this.addAttribute(traceName, 'timestamp', new Date().toISOString());

      const result = await apiCall();

      const duration = Date.now() - startTime;
      await this.addMetric(traceName, 'duration_ms', duration);
      await this.addMetric(traceName, 'success', 1);

      if (additionalMetrics) {
        for (const [key, value] of Object.entries(additionalMetrics)) {
          await this.addMetric(traceName, key, value);
        }
      }

      await this.stopTrace(traceName);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.addMetric(traceName, 'duration_ms', duration);
      await this.addMetric(traceName, 'success', 0);
      await this.addAttribute(traceName, 'error_type', (error as Error).name || 'Unknown');
      await this.stopTrace(traceName);
      throw error;
    }
  }

  /**
   * Monitor screen load performance
   */
  static async monitorScreenLoad(screenName: string, loadFunction: () => Promise<void>): Promise<void> {
    const traceName = `screen_${screenName.toLowerCase()}_load`;
    const startTime = Date.now();

    try {
      await this.startTrace(traceName);
      await this.addAttribute(traceName, 'screen_name', screenName);
      await this.addAttribute(traceName, 'load_start', new Date().toISOString());

      await loadFunction();

      const loadTime = Date.now() - startTime;
      await this.addMetric(traceName, 'load_time_ms', loadTime);
      await this.addMetric(traceName, 'success', 1);

      await this.stopTrace(traceName);
      console.log(`📱 Screen ${screenName} loaded in ${loadTime}ms`);
    } catch (error) {
      const loadTime = Date.now() - startTime;
      await this.addMetric(traceName, 'load_time_ms', loadTime);
      await this.addMetric(traceName, 'success', 0);
      await this.addAttribute(traceName, 'error_type', (error as Error).name || 'Unknown');
      await this.stopTrace(traceName);
      throw error;
    }
  }

  /**
   * Monitor route calculation performance
   */
  static async monitorRouteCalculation(
    source: string,
    destination: string,
    calculationFunction: () => Promise<any>
  ): Promise<any> {
    const traceName = 'route_calculation';
    const startTime = Date.now();

    try {
      await this.startTrace(traceName);
      await this.addAttribute(traceName, 'source', source);
      await this.addAttribute(traceName, 'destination', destination);
      await this.addAttribute(traceName, 'calculation_start', new Date().toISOString());

      const result = await calculationFunction();

      const calculationTime = Date.now() - startTime;
      await this.addMetric(traceName, 'calculation_time_ms', calculationTime);
      await this.addMetric(traceName, 'success', 1);

      if (result && result.routes) {
        await this.addMetric(traceName, 'routes_found', result.routes.length);
      }

      await this.stopTrace(traceName);
      console.log(`🗺️ Route calculation completed in ${calculationTime}ms`);
      return result;
    } catch (error) {
      const calculationTime = Date.now() - startTime;
      await this.addMetric(traceName, 'calculation_time_ms', calculationTime);
      await this.addMetric(traceName, 'success', 0);
      await this.addAttribute(traceName, 'error_type', (error as Error).name || 'Unknown');
      await this.stopTrace(traceName);
      throw error;
    }
  }

  /**
   * Monitor location services performance
   */
  static async monitorLocationService(
    serviceType: 'getCurrentPosition' | 'watchPosition' | 'geocoding',
    serviceFunction: () => Promise<any>
  ): Promise<any> {
    const traceName = `location_${serviceType}`;
    const startTime = Date.now();

    try {
      await this.startTrace(traceName);
      await this.addAttribute(traceName, 'service_type', serviceType);
      await this.addAttribute(traceName, 'request_start', new Date().toISOString());

      const result = await serviceFunction();

      const serviceTime = Date.now() - startTime;
      await this.addMetric(traceName, 'service_time_ms', serviceTime);
      await this.addMetric(traceName, 'success', 1);

      await this.stopTrace(traceName);
      console.log(`📍 Location service ${serviceType} completed in ${serviceTime}ms`);
      return result;
    } catch (error) {
      const serviceTime = Date.now() - startTime;
      await this.addMetric(traceName, 'service_time_ms', serviceTime);
      await this.addMetric(traceName, 'success', 0);
      await this.addAttribute(traceName, 'error_type', (error as Error).name || 'Unknown');
      await this.stopTrace(traceName);
      throw error;
    }
  }
}

export default PerformanceMonitor;
