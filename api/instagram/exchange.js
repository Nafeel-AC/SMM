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

    // Use Instagram Basic Display API for token exchange
    const formData = new URLSearchParams();
    formData.append('client_id', appId);
    formData.append('client_secret', appSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirectUri);
    formData.append('code', code);

    const tokenResp = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      return res.status(tokenResp.status).json({ error: 'exchange_failed', details: tokenJson });
    }

    // For Instagram Basic Display, try to get a long-lived token
    try {
      const longLivedUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${tokenJson.access_token}`;
      
      const llResp = await fetch(longLivedUrl);
      const llJson = await llResp.json();
      
      if (llResp.ok && llJson.access_token) {
        return res.status(200).json(llJson);
      }
    } catch (error) {
      console.warn('Failed to get long-lived token:', error);
    }

    // Return short-lived token if long-lived exchange fails
    return res.status(200).json(tokenJson);
  } catch (err) {
    return res.status(500).json({ error: 'server_error', message: err.message });
  }
}


