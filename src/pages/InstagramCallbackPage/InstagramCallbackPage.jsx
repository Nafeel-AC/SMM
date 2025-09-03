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

      if (errorParam) {
        throw new Error(`Instagram authorization failed: ${errorParam}`);
      }

      if (!code) {
        throw new Error('No authorization code received from Instagram');
      }

      // Exchange code for access token
      const tokenData = await instagramService.exchangeCodeForToken(code);
      
      if (!tokenData.access_token) {
        throw new Error('No access token received from Instagram');
      }

      // Get long-lived Facebook user access token
      const longLivedToken = await instagramService.getLongLivedToken(tokenData.access_token);

      // Resolve IG Business user via Pages and get IG profile
      const { igUserId } = await instagramService.resolveInstagramUserFromPages(longLivedToken.access_token);
      const igProfile = await instagramService.getIgUserProfile(igUserId, longLivedToken.access_token);

      // Save Instagram account to database
      await instagramService.saveInstagramAccount(
        user.id,
        igProfile,
        longLivedToken.access_token
      );

      // Fetch and save initial insights
      await instagramService.fetchAndSaveInsights(user.id, longLivedToken.access_token);

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
