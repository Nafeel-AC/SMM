// instagram-graph.js
// Lightweight client for Instagram Graph API (account and media insights)
// Docs: https://developers.facebook.com/docs/instagram-platform/insights

const DEFAULT_API_VERSION = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_API_VERSION) || 'v19.0';
const FB_GRAPH_HOST = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FB_GRAPH_HOST) || 'https://graph.facebook.com';
const IG_GRAPH_HOST = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IG_GRAPH_HOST) || 'https://graph.instagram.com';

async function httpGetJson(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  let body;
  try {
    body = await response.json();
  } catch (e) {
    body = null;
  }

  if (!response.ok) {
    const error = new Error(`Instagram Graph API error: ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

// Fetch account-level insights (impressions, reach, profile_views, etc.)
// Host: Facebook Graph per docs example
export async function getAccountInsights({ instagramUserId, accessToken, metrics = ['impressions','reach','profile_views'], period = 'day', since, until, apiVersion = DEFAULT_API_VERSION }) {
  const base = `${FB_GRAPH_HOST}/${apiVersion}/${encodeURIComponent(instagramUserId)}/insights`;
  const params = new URLSearchParams({
    metric: metrics.join(','),
    period
  });
  if (since) params.set('since', String(since));
  if (until) params.set('until', String(until));
  params.set('access_token', accessToken);

  const url = `${base}?${params.toString()}`;
  return httpGetJson(url);
}

// Fetch media insights for a single media ID (engagement, impressions, reach, etc.)
// Host: Instagram Graph per docs example
export async function getMediaInsights({ mediaId, accessToken, metrics = ['engagement','impressions','reach'], apiVersion = DEFAULT_API_VERSION }) {
  const base = `${IG_GRAPH_HOST}/${apiVersion}/${encodeURIComponent(mediaId)}/insights`;
  const params = new URLSearchParams({
    metric: metrics.join(',')
  });
  params.set('access_token', accessToken);

  const url = `${base}?${params.toString()}`;
  return httpGetJson(url);
}

// Fetch recent media IDs for an Instagram user (to iterate for media insights aggregation)
// Using Facebook Graph API for edges on professional accounts
export async function getRecentMediaIds({ instagramUserId, accessToken, limit = 10, apiVersion = DEFAULT_API_VERSION }) {
  const base = `${FB_GRAPH_HOST}/${apiVersion}/${encodeURIComponent(instagramUserId)}/media`;
  const params = new URLSearchParams({
    fields: 'id,caption,timestamp',
    limit: String(limit)
  });
  params.set('access_token', accessToken);

  const url = `${base}?${params.toString()}`;
  const json = await httpGetJson(url);
  const ids = Array.isArray(json?.data) ? json.data.map(item => item.id).filter(Boolean) : [];
  return { ids, raw: json };
}

// Utility: compute a simple engagement average from media insights array
export function computeAverageEngagement(mediaInsights) {
  if (!Array.isArray(mediaInsights) || mediaInsights.length === 0) return 0;
  let total = 0;
  let count = 0;
  for (const insight of mediaInsights) {
    const engagementObj = insight?.data?.find(m => m.name === 'engagement');
    const value = engagementObj?.values?.[0]?.value;
    if (typeof value === 'number') {
      total += value;
      count += 1;
    }
  }
  return count > 0 ? Number((total / count).toFixed(2)) : 0;
}

export const instagramGraphClient = {
  getAccountInsights,
  getMediaInsights,
  getRecentMediaIds,
  computeAverageEngagement
};
