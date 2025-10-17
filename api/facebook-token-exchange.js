// Vercel Serverless Function: Exchange Facebook authorization code for user access token
// Flow: https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { code } = req.body || {};
    if (!code) {
      res.status(400).json({ error: 'Missing authorization code' });
      return;
    }

    const FB_APP_ID = process.env.FB_APP_ID || process.env.VITE_FB_APP_ID;
    const FB_APP_SECRET = process.env.FB_APP_SECRET;
    const FB_REDIRECT_URI = process.env.FB_REDIRECT_URI || process.env.VITE_FB_REDIRECT_URI;
    const API_VERSION = process.env.FB_API_VERSION || 'v24.0';

    if (!FB_APP_ID || !FB_APP_SECRET || !FB_REDIRECT_URI) {
      res.status(500).json({ error: 'Server misconfiguration: missing FB_APP_ID, FB_APP_SECRET, or FB_REDIRECT_URI' });
      return;
    }

    // Step 1: Exchange code for short-lived user access token
    const tokenUrl = new URL(`https://graph.facebook.com/${API_VERSION}/oauth/access_token`);
    tokenUrl.searchParams.set('client_id', FB_APP_ID);
    tokenUrl.searchParams.set('redirect_uri', FB_REDIRECT_URI);
    tokenUrl.searchParams.set('client_secret', FB_APP_SECRET);
    tokenUrl.searchParams.set('code', code);

    const shortResp = await fetch(tokenUrl.toString());
    const shortJson = await shortResp.json().catch(() => ({}));
    if (!shortResp.ok) {
      res.status(shortResp.status).json({ error: 'Failed to exchange code', details: shortJson });
      return;
    }

    const shortToken = shortJson.access_token;
    const tokenType = shortJson.token_type;
    const expiresIn = shortJson.expires_in;

    // Step 2: Exchange short-lived for long-lived user access token (optional but recommended)
    const longUrl = new URL(`https://graph.facebook.com/${API_VERSION}/oauth/access_token`);
    longUrl.searchParams.set('grant_type', 'fb_exchange_token');
    longUrl.searchParams.set('client_id', FB_APP_ID);
    longUrl.searchParams.set('client_secret', FB_APP_SECRET);
    longUrl.searchParams.set('fb_exchange_token', shortToken);

    const longResp = await fetch(longUrl.toString());
    const longJson = await longResp.json().catch(() => ({}));

    const payload = {
      short_lived: {
        access_token: shortToken,
        token_type: tokenType,
        expires_in: expiresIn
      },
      long_lived: longResp.ok ? {
        access_token: longJson.access_token,
        token_type: longJson.token_type,
        expires_in: longJson.expires_in
      } : null
    };

    res.status(200).json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Unexpected server error', message: err?.message || String(err) });
  }
}
