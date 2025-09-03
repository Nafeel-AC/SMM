import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { instagramService } from '../../lib/instagram';
import './InstagramCallbackPage.css';

const InstagramCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleInstagramCallback();
  }, []);

  const handleInstagramCallback = async () => {
    try {
      setLoading(true);
      setError('');

      // Get authorization code from URL parameters
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorReason = searchParams.get('error_reason');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        let errorMessage = `Instagram authorization failed: ${errorParam}`;
        if (errorDescription) {
          errorMessage += ` - ${errorDescription}`;
        }
        throw new Error(errorMessage);
      }

      if (!code) {
        throw new Error('No authorization code received from Instagram. Please try the connection process again.');
      }

      console.log('✅ Authorization code received:', code.substring(0, 10) + '...');

      // Exchange code for access token
      console.log('🔄 Exchanging code for Facebook access token...');
      const tokenData = await instagramService.exchangeCodeForToken(code);
      
      if (!tokenData.access_token) {
        throw new Error('No access token received from Facebook');
      }

      console.log('✅ Facebook access token received');

      // Resolve Instagram Business account from Facebook Pages
      console.log('🔄 Resolving Instagram Business account...');
      const { igUserId, pageAccessToken } = await instagramService.resolveInstagramUserFromPages(tokenData.access_token);
      
      console.log('✅ Instagram Business account found:', igUserId);

      // Get Instagram profile using Graph API
      console.log('🔄 Fetching Instagram profile...');
      const profile = await instagramService.getInstagramProfile(igUserId, pageAccessToken);
      
      console.log('✅ Profile fetched:', profile);

      // Save Instagram account to database
      console.log('🔄 Saving Instagram account to database...');
      await instagramService.saveInstagramAccount(
        user.id,
        profile,
        pageAccessToken
      );

      console.log('✅ Instagram account saved');

      // Fetch and save initial insights
      console.log('🔄 Fetching initial insights...');
      await instagramService.fetchAndSaveInsights(user.id, tokenData.access_token);

      console.log('✅ Initial insights saved');

      setSuccess(true);
      
      // Redirect to requirements form after 2 seconds
      setTimeout(() => {
        navigate('/requirements-form');
      }, 2000);

    } catch (error) {
      console.error('Instagram callback error:', error);
      setError(error.message || 'Failed to connect Instagram account');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="instagram-callback-page">
        <div className="callback-container">
          <div className="loading-section">
            <div className="spinner"></div>
            <h2>Connecting your Instagram account...</h2>
            <p>Please wait while we set up your Instagram integration.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instagram-callback-page">
        <div className="callback-container">
          <div className="error-section">
            <div className="error-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#f44336"/>
              </svg>
            </div>
            <h2>Connection Failed</h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                className="retry-btn"
                onClick={() => navigate('/instagram-connect')}
              >
                Try Again
              </button>
              <button 
                className="skip-btn"
                onClick={() => navigate('/requirements-form')}
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="instagram-callback-page">
        <div className="callback-container">
          <div className="success-section">
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
              </svg>
            </div>
            <h2>Instagram Connected Successfully!</h2>
            <p>Your Instagram account has been connected and we've fetched your initial insights.</p>
            <p className="redirect-message">Redirecting to requirements form...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InstagramCallbackPage;
