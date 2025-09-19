import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseInstagramCallback, exchangeCodeForToken, getInstagramProfile, getInstagramMedia, getBasicInsights, calculateInstagramInsights } from '../lib/instagram-login-client';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { firebaseDb } from '../lib/firebase-db';

const InstagramCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const [status, setStatus] = useState('Processing login...');

  useEffect(() => {
    const run = async () => {
      try {
        const { code, error, error_description } = parseInstagramCallback();
        if (error) throw new Error(error_description || error);
        if (!code) throw new Error('No authorization code received');

        setStatus('Exchanging code for access token...');
        const tokenData = await exchangeCodeForToken(code);
        const { access_token } = tokenData;

        setStatus('Fetching Instagram profile...');
        const profile = await getInstagramProfile(access_token);
        const { id: instagram_user_id, username } = profile;

        setStatus('Fetching Instagram media...');
        const mediaData = await getInstagramMedia(access_token, 25);

        setStatus('Fetching Instagram insights...');
        const insightsData = await getBasicInsights(access_token);
        
        setStatus('Calculating insights...');
        const insights = calculateInstagramInsights(profile, insightsData, mediaData);

        setStatus('Saving Instagram account...');
        await firebaseDb.saveInstagramAccount({
          user_id: user.uid,
          instagram_user_id,
          username: username || 'instagram_user',
          access_token,
          connected_at: new Date().toISOString(),
          last_sync: new Date().toISOString()
        });

        setStatus('Saving insights...');
        await firebaseDb.saveInstagramInsights({
          user_id: user.uid,
          ...insights
        });

        setStatus('Finalizing...');
        navigate('/requirements-form');
      } catch (e) {
        console.error(e);
        setStatus(`Login failed: ${e.message}. Please try again.`);
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

export default InstagramCallbackPage;
