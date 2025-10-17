// Facebook Login for Business -> Instagram API client
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/

const FB_GRAPH = 'https://graph.facebook.com';
const API_VERSION = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FB_API_VERSION) || 'v24.0';
const FB_OAUTH_BASE = 'https://www.facebook.com';

export function getFacebookLoginEnv() {
  const appId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FB_APP_ID) || '';
  const redirectUri = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FB_REDIRECT_URI) || '';
  return { appId, redirectUri };
}

// Build Facebook Login for Business URL to request instagram_basic, pages_show_list
export function buildFacebookLoginUrl({ state = '', scopes = ['instagram_basic', 'pages_show_list'] } = {}) {
  const { appId, redirectUri } = getFacebookLoginEnv();
  if (!appId || !redirectUri) throw new Error('Missing VITE_FB_APP_ID or VITE_FB_REDIRECT_URI');
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state
  });
  return `${FB_OAUTH_BASE}/${API_VERSION}/dialog/oauth?${params.toString()}`;
}

export function parseFacebookCallback() {
  const url = new URL(window.location.href);
  return {
    code: url.searchParams.get('code'),
    error: url.searchParams.get('error'),
    error_description: url.searchParams.get('error_description'),
    state: url.searchParams.get('state')
  };
}

// Exchange code for FB user token via serverless function
export async function exchangeFacebookCodeForToken(code) {
  const endpoint = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? `${window.location.origin}/api/facebook-token-exchange`
    : '/api/facebook-token-exchange';
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ code })
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error || 'Facebook token exchange failed');
  const access_token = json?.long_lived?.access_token || json?.short_lived?.access_token;
  const expires_in = json?.long_lived?.expires_in || json?.short_lived?.expires_in;
  return { access_token, expires_in, raw: json };
}

// Step 4: Get user's Pages
export async function getUserPages(fbUserAccessToken) {
  const url = `${FB_GRAPH}/${API_VERSION}/me/accounts?access_token=${encodeURIComponent(fbUserAccessToken)}`;
  const resp = await fetch(url);
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error?.message || 'Failed to fetch user pages');
  return json?.data || [];
}

// Step 5: Get Page's Instagram Business Account
export async function getPageInstagramAccount(pageId, fbUserAccessToken) {
  const url = `${FB_GRAPH}/${API_VERSION}/${encodeURIComponent(pageId)}?fields=instagram_business_account&access_token=${encodeURIComponent(fbUserAccessToken)}`;
  const resp = await fetch(url);
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error?.message || 'Failed to fetch page instagram_business_account');
  return json?.instagram_business_account?.id || null;
}

// Step 6: Get IG User media ids
export async function getIgMediaIds(igUserId, fbUserAccessToken, limit = 25) {
  const url = `${FB_GRAPH}/${API_VERSION}/${encodeURIComponent(igUserId)}/media?limit=${limit}&access_token=${encodeURIComponent(fbUserAccessToken)}`;
  const resp = await fetch(url);
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error?.message || 'Failed to fetch IG media ids');
  return json?.data || [];
}

export async function getIgMediaDetails(mediaId, fbUserAccessToken) {
  const url = `${FB_GRAPH}/${API_VERSION}/${encodeURIComponent(mediaId)}?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${encodeURIComponent(fbUserAccessToken)}`;
  const resp = await fetch(url);
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error?.message || 'Failed to fetch IG media details');
  return json;
}

export async function getIgUserDetails(igUserId, fbUserAccessToken) {
  const fields = 'id,username,profile_picture_url,media_count,biography,followers_count,follows_count,account_type';
  const url = `${FB_GRAPH}/${API_VERSION}/${encodeURIComponent(igUserId)}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(fbUserAccessToken)}`;
  const resp = await fetch(url);
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error?.message || 'Failed to fetch IG user details');
  return json;
}

export async function getIgAccountInsights(igUserId, fbUserAccessToken) {
  // Examples: impressions, reach, profile_views (requires instagram_business_basic)
  const url = `${FB_GRAPH}/${API_VERSION}/${encodeURIComponent(igUserId)}/insights?metric=impressions,reach,profile_views&period=day&access_token=${encodeURIComponent(fbUserAccessToken)}`;
  const resp = await fetch(url);
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.error?.message || 'Failed to fetch IG account insights');
  return json;
}

export const facebookInstagramClient = {
  buildFacebookLoginUrl,
  parseFacebookCallback,
  exchangeFacebookCodeForToken,
  getUserPages,
  getPageInstagramAccount,
  getIgMediaIds,
  getIgMediaDetails,
  getIgUserDetails,
  getIgAccountInsights
};
