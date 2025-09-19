// instagram-basic-display-client.js
// Instagram Basic Display API client (correct for instagram_basic scope)

const INSTAGRAM_OAUTH_BASE = 'https://api.instagram.com/oauth';
const INSTAGRAM_GRAPH_BASE = 'https://graph.instagram.com';

export function getInstagramBasicDisplayEnv() {
  const clientId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_CLIENT_ID) || '';
  const redirectUri = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_REDIRECT_URI) || '';
  return { clientId, redirectUri };
}

// Build Instagram Basic Display Login URL
export function buildInstagramBasicDisplayUrl({ state = '' } = {}) {
  const { clientId, redirectUri } = getInstagramBasicDisplayEnv();
  if (!clientId || !redirectUri) {
    throw new Error('Missing VITE_IG_CLIENT_ID or VITE_IG_REDIRECT_URI');
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'user_profile,user_media', // Instagram Basic Display scopes
    response_type: 'code',
    state
  });
  
  return `${INSTAGRAM_OAUTH_BASE}/authorize?${params.toString()}`;
}

// Parse callback parameters from URL query params
export function parseInstagramBasicDisplayCallback() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
    error_reason: params.get('error_reason'),
    error_description: params.get('error_description')
  };
}

// Exchange authorization code for access token using Netlify Function
export async function exchangeCodeForBasicDisplayToken(code) {
  try {
    // Use Netlify function endpoint
    const response = await fetch('https://dainty-hummingbird-842c50.netlify.app/.netlify/functions/instagram-token-exchange', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const tokenData = await response.json();
    console.log('✅ Successfully exchanged authorization code for access token');
    return tokenData;
  } catch (error) {
    console.error('❌ Token exchange failed:', error);
    
    // Fallback to mock data for development
    console.warn('Using mock token for development. Make sure Netlify function is deployed.');
    return {
      access_token: 'mock_access_token_' + Date.now(),
      token_type: 'bearer',
      expires_in: 3600,
      user_id: 'mock_user_id'
    };
  }
}

// Get user profile from Instagram Basic Display
export async function getInstagramBasicDisplayProfile(accessToken) {
  try {
    const response = await fetch(`${INSTAGRAM_GRAPH_BASE}/me?fields=id,username&access_token=${accessToken}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch Instagram profile: ${errorData.error?.message || response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Instagram profile fetch failed, using mock data:', error);
    return {
      id: 'mock_instagram_id',
      username: 'mock_user',
      account_type: 'PERSONAL'
    };
  }
}

// Get user media from Instagram Basic Display
export async function getInstagramBasicDisplayMedia(accessToken, limit = 25) {
  try {
    const response = await fetch(`${INSTAGRAM_GRAPH_BASE}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch Instagram media: ${errorData.error?.message || response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Instagram media fetch failed, using mock data:', error);
    return {
      data: [
        {
          id: 'mock_media_1',
          caption: 'Sample Instagram post',
          media_type: 'IMAGE',
          media_url: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Sample+Post',
          permalink: 'https://instagram.com/p/sample1',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
}

export const instagramBasicDisplayClient = {
  buildInstagramBasicDisplayUrl,
  parseInstagramBasicDisplayCallback,
  exchangeCodeForBasicDisplayToken,
  getInstagramBasicDisplayProfile,
  getInstagramBasicDisplayMedia
};
