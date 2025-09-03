export default async function handler(req, res) {
  try {
    const { code } = req.method === 'GET' ? req.query : req.body || {};
    if (!code) {
      return res.status(400).json({ error: 'missing_code' });
    }

    const appId = process.env.FB_APP_ID || process.env.VITE_INSTAGRAM_APP_ID;
    const appSecret = process.env.FB_APP_SECRET || process.env.VITE_INSTAGRAM_APP_SECRET;
    const redirectUri = process.env.FB_REDIRECT_URI || process.env.VITE_INSTAGRAM_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) {
      return res.status(500).json({ error: 'server_env_missing' });
    }

    const version = 'v18.0';

    const tokenUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenResp = await fetch(tokenUrl.toString());
    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      return res.status(tokenResp.status).json({ error: 'exchange_failed', details: tokenJson });
    }

    const shortLived = tokenJson.access_token;

    // Upgrade to long‑lived user token
    const llUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
    llUrl.searchParams.set('grant_type', 'fb_exchange_token');
    llUrl.searchParams.set('client_id', appId);
    llUrl.searchParams.set('client_secret', appSecret);
    llUrl.searchParams.set('fb_exchange_token', shortLived);

    const llResp = await fetch(llUrl.toString());
    const llJson = await llResp.json();
    if (!llResp.ok) {
      // Fall back to short‑lived if upgrade fails
      return res.status(200).json({ access_token: shortLived, token_type: tokenJson.token_type, expires_in: tokenJson.expires_in, upgrade_error: llJson });
    }

    return res.status(200).json(llJson);
  } catch (err) {
    return res.status(500).json({ error: 'server_error', message: err.message });
  }
}


