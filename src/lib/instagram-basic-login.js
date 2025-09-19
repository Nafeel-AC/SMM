// instagram-basic-login.js
// Simplified Instagram Login with minimal permissions for testing

const INSTAGRAM_OAUTH_BASE = 'https://api.instagram.com/oauth';
const INSTAGRAM_GRAPH_BASE = 'https://graph.instagram.com';

export function getInstagramBasicEnv() {
  const clientId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_CLIENT_ID) || '';
  const redirectUri = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_REDIRECT_URI) || '';
  return { clientId, redirectUri };
}

// Build Instagram Login URL with minimal scopes
export function buildInstagramBasicLoginUrl({ state = '' } = {}) {
  const { clientId, redirectUri } = getInstagramBasicEnv();
  if (!clientId || !redirectUri) {
    throw new Error('Missing VITE_IG_CLIENT_ID or VITE_IG_REDIRECT_URI');
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'instagram_business_basic', // Only basic scope
    response_type: 'code',
    state
  });
  
  return `${INSTAGRAM_OAUTH_BASE}/authorize?${params.toString()}`;
}

// Parse callback parameters
export function parseInstagramBasicCallback() {
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
export async function exchangeCodeForBasicToken(code) {
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

// Get basic Instagram profile
export async function getInstagramBasicProfile(accessToken) {
  try {
    const response = await fetch(`${INSTAGRAM_GRAPH_BASE}/me?fields=id,username,account_type`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    throw error;
  }
}

// Test Instagram connection
export async function testInstagramConnection(accessToken) {
  try {
    const profile = await getInstagramBasicProfile(accessToken);
    console.log('✅ Instagram connection successful:', profile);
    return { success: true, profile };
  } catch (error) {
    console.error('❌ Instagram connection failed:', error);
    return { success: false, error: error.message };
  }
}
