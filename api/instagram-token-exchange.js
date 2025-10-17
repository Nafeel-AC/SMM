// Vercel Serverless Function: Exchange Instagram authorization code for tokens
// Docs:
// - Step 2 (code -> short-lived token): https://api.instagram.com/oauth/access_token
// - Step 3 (short-lived -> long-lived): https://graph.instagram.com/access_token

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

    const IG_APP_ID = process.env.IG_APP_ID || process.env.VITE_IG_CLIENT_ID; // prefer server-only var
    const IG_APP_SECRET = process.env.IG_APP_SECRET;
    const IG_REDIRECT_URI = process.env.IG_REDIRECT_URI || process.env.VITE_IG_REDIRECT_URI;

    if (!IG_APP_ID || !IG_APP_SECRET || !IG_REDIRECT_URI) {
      res.status(500).json({ error: 'Server misconfiguration: missing IG_APP_ID, IG_APP_SECRET, or IG_REDIRECT_URI' });
      return;
    }

    // Step 2: Exchange code for short-lived token
    const form = new URLSearchParams();
    form.set('client_id', IG_APP_ID);
    form.set('client_secret', IG_APP_SECRET);
    form.set('grant_type', 'authorization_code');
    form.set('redirect_uri', IG_REDIRECT_URI);
    form.set('code', code);

    const shortResp = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });

    const shortJson = await shortResp.json().catch(() => ({}));
    if (!shortResp.ok) {
      res.status(shortResp.status).json({ error: shortJson?.error_message || 'Failed to exchange code', details: shortJson });
      return;
    }

    const shortToken = shortJson.access_token;
    const userId = shortJson.user_id || shortJson.user?.id;

    // Step 3: Exchange short-lived for long-lived token (server-only per Meta guidance)
    const longUrl = new URL('https://graph.instagram.com/access_token');
    longUrl.searchParams.set('grant_type', 'ig_exchange_token');
    longUrl.searchParams.set('client_secret', IG_APP_SECRET);
    longUrl.searchParams.set('access_token', shortToken);

    const longResp = await fetch(longUrl.toString());
    const longJson = await longResp.json().catch(() => ({}));
    // If long-lived fails, still return short-lived as fallback

    const payload = {
      // Short-lived
      short_lived: {
        access_token: shortToken,
        user_id: userId,
      },
      // Long-lived (if available)
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
