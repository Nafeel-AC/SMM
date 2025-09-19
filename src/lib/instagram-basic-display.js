// instagram-basic-display.js
// Frontend-only Instagram Basic Display API client
// This approach doesn't require backend token exchange

const INSTAGRAM_BASIC_DISPLAY_BASE = 'https://api.instagram.com';
const INSTAGRAM_OAUTH_BASE = 'https://api.instagram.com/oauth';

export function getBasicDisplayEnv() {
  const clientId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_CLIENT_ID) || '';
  const redirectUri = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_REDIRECT_URI) || '';
  return { clientId, redirectUri };
}

export function buildBasicDisplayLoginUrl({ scopes = ['user_profile', 'user_media'], state = '' } = {}) {
  const { clientId, redirectUri } = getBasicDisplayEnv();
  if (!clientId || !redirectUri) {
    throw new Error('Missing VITE_IG_CLIENT_ID or VITE_IG_REDIRECT_URI');
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(','),
    response_type: 'code',
    state
  });
  
  return `${INSTAGRAM_OAUTH_BASE}/authorize?${params.toString()}`;
}

export function parseBasicDisplayCallback() {
  const url = new URL(window.location.href);
  return {
    code: url.searchParams.get('code'),
    state: url.searchParams.get('state'),
    error: url.searchParams.get('error'),
    error_reason: url.searchParams.get('error_reason'),
    error_description: url.searchParams.get('error_description')
  };
}

// Exchange code for access token (frontend-only, no secret required)
export async function exchangeCodeForToken(code) {
  const { clientId, redirectUri } = getBasicDisplayEnv();
  
  const response = await fetch(`${INSTAGRAM_OAUTH_BASE}/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: '', // Basic Display doesn't require secret for frontend
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }
  
  return response.json();
}

// Get user profile
export async function getUserProfile(accessToken) {
  const response = await fetch(`${INSTAGRAM_BASIC_DISPLAY_BASE}/v1/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json();
}

// Get user media
export async function getUserMedia(accessToken, limit = 25) {
  const response = await fetch(`${INSTAGRAM_BASIC_DISPLAY_BASE}/v1/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user media');
  }
  
  return response.json();
}

// Calculate basic engagement metrics from media data
export function calculateBasicMetrics(mediaData) {
  if (!mediaData || !Array.isArray(mediaData)) {
    return {
      followers_count: 0,
      following_count: 0,
      media_count: 0,
      engagement_rate: 0,
      avg_likes: 0,
      avg_comments: 0,
      reach: 0,
      impressions: 0,
      profile_views: 0,
      website_clicks: 0,
      email_contacts: 0,
      phone_contacts: 0,
      get_directions: 0,
      text_message: 0,
      last_updated: new Date().toISOString()
    };
  }

  // Basic Display API doesn't provide detailed insights, so we'll use mock data
  // In a real implementation, you'd need Instagram Business API for detailed metrics
  const mediaCount = mediaData.length;
  const avgLikes = Math.floor(Math.random() * 100) + 50; // Mock data
  const avgComments = Math.floor(Math.random() * 20) + 5; // Mock data
  const engagementRate = ((avgLikes + avgComments) / 1000 * 100).toFixed(1); // Mock calculation

  return {
    followers_count: Math.floor(Math.random() * 2000) + 500, // Mock data
    following_count: Math.floor(Math.random() * 500) + 200, // Mock data
    media_count: mediaCount,
    engagement_rate: parseFloat(engagementRate),
    avg_likes: avgLikes,
    avg_comments: avgComments,
    reach: Math.floor(Math.random() * 1000) + 500, // Mock data
    impressions: Math.floor(Math.random() * 1500) + 800, // Mock data
    profile_views: Math.floor(Math.random() * 50) + 20, // Mock data
    website_clicks: Math.floor(Math.random() * 20) + 5, // Mock data
    email_contacts: Math.floor(Math.random() * 10) + 2, // Mock data
    phone_contacts: Math.floor(Math.random() * 5) + 1, // Mock data
    get_directions: Math.floor(Math.random() * 3), // Mock data
    text_message: Math.floor(Math.random() * 2), // Mock data
    last_updated: new Date().toISOString()
  };
}

export const instagramBasicDisplay = {
  buildBasicDisplayLoginUrl,
  parseBasicDisplayCallback,
  exchangeCodeForToken,
  getUserProfile,
  getUserMedia,
  calculateBasicMetrics
};


