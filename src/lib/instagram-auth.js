// instagram-auth.js
// Helper to initiate Instagram Business Login (Facebook OAuth dialog) and handle state
// Requires: VITE_FB_APP_ID, VITE_FB_REDIRECT_URI

const FB_OAUTH_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FB_OAUTH_BASE) || 'https://www.facebook.com';
const DEFAULT_API_VERSION = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_API_VERSION) || 'v19.0';

export function getRequiredAuthEnv() {
  const appId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FB_APP_ID) || '';
  const redirectUri = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FB_REDIRECT_URI) || '';
  return { appId, redirectUri };
}

export function buildBusinessLoginUrl({ scopes = ['instagram_business_basic','instagram_business_manage_insights'], state = '' } = {}) {
  const { appId, redirectUri } = getRequiredAuthEnv();
  if (!appId || !redirectUri) {
    throw new Error('Missing VITE_FB_APP_ID or VITE_FB_REDIRECT_URI');
  }
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state
  });
  // Facebook OAuth dialog
  return `${FB_OAUTH_BASE}/${DEFAULT_API_VERSION}/dialog/oauth?${params.toString()}`;
}

export function parseCallbackParams() {
  const url = new URL(window.location.href);
  return {
    code: url.searchParams.get('code'),
    state: url.searchParams.get('state'),
    error: url.searchParams.get('error'),
    error_description: url.searchParams.get('error_description')
  };
}

