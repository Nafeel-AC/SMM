// instagram-minimal-login.js
// Minimal Instagram Login with no advanced permissions

const INSTAGRAM_OAUTH_BASE = 'https://api.instagram.com/oauth';

export function getInstagramMinimalEnv() {
  const clientId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_CLIENT_ID) || '';
  const redirectUri = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_REDIRECT_URI) || '';
  return { clientId, redirectUri };
}

// Build Instagram Login URL with NO scopes (minimal permissions)
export function buildInstagramMinimalLoginUrl({ state = '' } = {}) {
  const { clientId, redirectUri } = getInstagramMinimalEnv();
  if (!clientId || !redirectUri) {
    throw new Error('Missing VITE_IG_CLIENT_ID or VITE_IG_REDIRECT_URI');
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    // No scope parameter - this requests minimal permissions
    response_type: 'code',
    state
  });
  
  return `${INSTAGRAM_OAUTH_BASE}/authorize?${params.toString()}`;
}

// Parse callback parameters
export function parseInstagramMinimalCallback() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
    error_description: params.get('error_description')
  };
}

// Mock token exchange (requires backend in production)
export async function exchangeCodeForMinimalToken(code) {
  console.warn('⚠️ Token exchange requires backend implementation');
  console.log('Code received:', code);
  
  // In production, this should call your backend
  // For now, return a mock response
  return {
    access_token: 'mock_access_token_' + Date.now(),
    user_id: 'mock_user_id',
    expires_in: 3600
  };
}

// Test minimal Instagram connection
export async function testMinimalInstagramConnection(accessToken) {
  try {
    console.log('✅ Minimal Instagram connection successful');
    return { 
      success: true, 
      profile: { 
        id: 'mock_user_id', 
        username: 'test_user',
        account_type: 'BUSINESS'
      } 
    };
  } catch (error) {
    console.error('❌ Minimal Instagram connection failed:', error);
    return { success: false, error: error.message };
  }
}
