import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { firebaseDb } from '../lib/firebase-db';
import { facebookInstagramClient as fbIg } from '../lib/facebook-login-instagram';

const FacebookCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const [status, setStatus] = useState('Processing Facebook Login...');

  useEffect(() => {
    const run = async () => {
      try {
        const { code, error, error_description } = fbIg.parseFacebookCallback();
        if (error) throw new Error(error_description || error);
        if (!code) throw new Error('No authorization code received');

        setStatus('Exchanging code for Facebook user token...');
        const { access_token: fbUserToken } = await fbIg.exchangeFacebookCodeForToken(code);

        setStatus('Fetching managed Pages...');
        const pages = await fbIg.getUserPages(fbUserToken);
        if (!pages || pages.length === 0) throw new Error('No Facebook Pages found for this user');

        // TODO: if multiple pages are returned, implement a selector. For now, pick the first with IG.
        let igUserId = null;
        for (const page of pages) {
          try {
            const id = await fbIg.getPageInstagramAccount(page.id, fbUserToken);
            if (id) { igUserId = id; break; }
          } catch (e) {
            // continue
          }
        }

        if (!igUserId) throw new Error('No connected Instagram Business/Creator account found on your Pages');

        setStatus('Fetching Instagram account details...');
        const igUser = await fbIg.getIgUserDetails(igUserId, fbUserToken);

        setStatus('Fetching Instagram account insights...');
        const insights = await fbIg.getIgAccountInsights(igUserId, fbUserToken).catch(() => ({ data: [] }));

        setStatus('Fetching recent media...');
        const mediaIds = await fbIg.getIgMediaIds(igUserId, fbUserToken, 10);
        // Optionally fetch details for a few media
        const media = [];
        for (const m of mediaIds.slice(0, 5)) {
          try { media.push(await fbIg.getIgMediaDetails(m.id, fbUserToken)); } catch {}
        }

        setStatus('Saving Instagram account...');
        await firebaseDb.saveInstagramAccount({
          user_id: user.uid,
          instagram_user_id: igUserId,
          username: igUser?.username || 'instagram_user',
          access_token: fbUserToken,
          connected_at: new Date().toISOString(),
          last_sync: new Date().toISOString(),
          media_count: igUser?.media_count ?? 0,
          followers_count: igUser?.followers_count ?? 0,
          follows_count: igUser?.follows_count ?? 0,
          account_type: igUser?.account_type || 'BUSINESS'
        });

        setStatus('Saving insights...');
        // Flatten a few insight metrics if present
        const mapMetric = (json, name) => {
          const m = Array.isArray(json?.data) ? json.data.find(d => d.name === name) : null;
          const v = m?.values?.[0]?.value;
          return typeof v === 'number' ? v : 0;
        };

        await firebaseDb.saveInstagramInsights({
          user_id: user.uid,
          followers_count: igUser?.followers_count ?? 0,
          following_count: igUser?.follows_count ?? 0,
          media_count: igUser?.media_count ?? (mediaIds?.length ?? 0),
          engagement_rate: 0,
          avg_likes: 0,
          avg_comments: 0,
          reach: mapMetric(insights, 'reach'),
          impressions: mapMetric(insights, 'impressions'),
          profile_views: mapMetric(insights, 'profile_views'),
          website_clicks: 0,
          email_contacts: 0,
          phone_contacts: 0,
          get_directions: 0,
          text_message: 0,
          last_updated: new Date().toISOString()
        });

        setStatus('Finalizing...');
        navigate('/requirements-form');
      } catch (e) {
        console.error(e);
        setStatus(`Facebook Login failed: ${e.message}. Please try again.`);
      }
    };
    run();
  }, [navigate, user]);

  return (
    <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div className="spinner" style={{ marginBottom: 12 }}></div>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default FacebookCallbackPage;
