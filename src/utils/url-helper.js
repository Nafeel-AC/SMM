// url-helper.js
// Utility functions for handling URLs dynamically

/**
 * Get the base URL for the current environment
 * @returns {string} The base URL (localhost for dev, Vercel URL for production)
 */
export function getBaseUrl() {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return process.env.VITE_BASE_URL || 'https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app';
  }
  
  // Client-side
  return window.location.origin;
}

/**
 * Get the full URL for a given path
 * @param {string} path - The path to append to the base URL
 * @returns {string} The full URL
 */
export function getFullUrl(path) {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get Instagram callback URL
 * @returns {string} The Instagram callback URL
 */
export function getInstagramCallbackUrl() {
  return getFullUrl('/instagram/callback');
}

/**
 * Get Instagram connect URL
 * @returns {string} The Instagram connect URL
 */
export function getInstagramConnectUrl() {
  return getFullUrl('/instagram-connect');
}

/**
 * Get dashboard URL
 * @returns {string} The dashboard URL
 */
export function getDashboardUrl() {
  return getFullUrl('/dashboard');
}

/**
 * Get payment success URL with session ID
 * @param {string} sessionId - The Stripe session ID
 * @returns {string} The payment success URL
 */
export function getPaymentSuccessUrl(sessionId) {
  return getFullUrl(`/payment-success?session_id=${sessionId}`);
}

/**
 * Get payment cancel URL
 * @returns {string} The payment cancel URL
 */
export function getPaymentCancelUrl() {
  return getFullUrl('/payment-cancel');
}
