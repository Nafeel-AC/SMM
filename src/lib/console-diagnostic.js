// Console diagnostic utilities
// This file provides debugging and diagnostic functionality

console.log('Console diagnostic module loaded');

// Add any diagnostic utilities here
export const diagnosticUtils = {
  logEnvironment: () => {
    console.log('Environment:', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  },
  
  logPerformance: () => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      console.log('Performance metrics:', {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: timing.responseEnd - timing.requestStart
      });
    }
  }
};

// Auto-run basic diagnostics in development
if (process.env.NODE_ENV === 'development') {
  diagnosticUtils.logEnvironment();
}
