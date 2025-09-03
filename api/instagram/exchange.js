
// Serverless function: Exchange Instagram/Facebook OAuth code for a user access token
// Expects query param `code` and uses server-side env vars to keep the secret safe

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'missing_code' });
    }

    const appId = process.env.INSTAGRAM_APP_ID || process.env.VITE_INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET || process.env.VITE_INSTAGRAM_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || process.env.VITE_INSTAGRAM_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) {
      return res.status(500).json({ error: 'missing_server_env', details: ['INSTAGRAM_APP_ID', 'INSTAGRAM_APP_SECRET', 'INSTAGRAM_REDIRECT_URI'] });
    }

    // Exchange code for short-lived Facebook access token
    const tokenUrl = new URL(`${FACEBOOK_API_BASE}/oauth/access_token`);
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const fbResp = await fetch(tokenUrl.toString());
    const tokenData = await fbResp.json();

    if (!fbResp.ok) {
      return res.status(400).json({ error: 'exchange_failed', details: tokenData });
    }

    // Try to get long-lived token
    try {
      const llUrl = new URL(`${FACEBOOK_API_BASE}/oauth/access_token`);
      llUrl.searchParams.set('grant_type', 'fb_exchange_token');
      llUrl.searchParams.set('client_id', appId);
      llUrl.searchParams.set('client_secret', appSecret);
      llUrl.searchParams.set('fb_exchange_token', tokenData.access_token);

      const llResp = await fetch(llUrl.toString());
      const llData = await llResp.json();

      if (llResp.ok && llData.access_token) {
        return res.status(200).json(llData);
      }
    } catch (error) {
      console.warn('Failed to get long-lived token:', error);
    }

    // Return short-lived token if long-lived exchange fails
    return res.status(200).json(tokenData);
  } catch (err) {
    return res.status(500).json({ error: 'unexpected_error', details: String(err && err.message ? err.message : err) });
  }
}


