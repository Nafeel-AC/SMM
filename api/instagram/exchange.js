// Serverless function: Exchange Instagram/Facebook OAuth code for a user access token
// Expects query param `code` and uses server-side env vars to keep the secret safe

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';

module.exports = async (req, res) => {
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

    const url = new URL(`${FACEBOOK_API_BASE}/oauth/access_token`);
    url.searchParams.set('client_id', appId);
    url.searchParams.set('client_secret', appSecret);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('code', code);

    const fbResp = await fetch(url.toString());
    const body = await fbResp.json();

    if (!fbResp.ok) {
      return res.status(400).json({ error: 'exchange_failed', details: body });
    }

    return res.status(200).json(body);
  } catch (err) {
    return res.status(500).json({ error: 'unexpected_error', details: String(err && err.message ? err.message : err) });
  }
};


