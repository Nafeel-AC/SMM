import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { instagramService } from '../../lib/instagram';
import './InstagramConnectPage.css';

const InstagramConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [instagramAccount, setInstagramAccount] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkInstagramConnection();
  }, []);

  const checkInstagramConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('instagram_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setConnected(true);
        setInstagramAccount(data);
      }
    } catch (error) {
      console.error('Error checking Instagram connection:', error);
    }
  };

  const handleInstagramConnect = async () => {
    setLoading(true);
    setError('');

    try {
      // Redirect to Instagram OAuth
      const authUrl = instagramService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Instagram connection:', error);
      setError('Failed to initiate Instagram connection. Please try again.');
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/requirements-form');
  };

  if (connected) {
    return (
      <div className="instagram-connect-page">
        <div className="connect-container">
          <div className="success-section">
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
              </svg>
            </div>
            <h2>Instagram Connected Successfully!</h2>
            <p>Your Instagram account has been connected and we can now access your insights.</p>
            
            <div className="account-info">
              <div className="account-details">
                <h3>Connected Account</h3>
                <p>Instagram User ID: {instagramAccount?.instagram_user_id}</p>
                <p>Connected: {new Date(instagramAccount?.connected_at).toLocaleDateString()}</p>
              </div>
            </div>

            <button 
              className="continue-btn"
              onClick={handleContinue}
            >
              Continue to Requirements Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instagram-connect-page">
      <div className="connect-container">
        <div className="connect-header">
          <div className="instagram-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#E4405F"/>
            </svg>
          </div>
          <h1>Connect Your Instagram Account</h1>
          <p>To provide you with personalized SMM services, we need to connect to your Instagram account to access your insights and analytics.</p>
        </div>

        <div className="benefits-section">
          <h3>What we'll access:</h3>
          <ul className="benefits-list">
            <li>
              <span className="benefit-icon">📊</span>
              <div>
                <strong>Account Insights</strong>
                <p>Follower count, engagement rates, and growth metrics</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🎯</span>
              <div>
                <strong>Audience Demographics</strong>
                <p>Age, gender, location, and interests of your followers</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">📈</span>
              <div>
                <strong>Performance Analytics</strong>
                <p>Post reach, impressions, and engagement data</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🔒</span>
              <div>
                <strong>Secure Access</strong>
                <p>Your data is encrypted and we only access what's necessary</p>
              </div>
            </li>
          </ul>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="connect-actions">
          <button 
            className="connect-btn"
            onClick={handleInstagramConnect}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                </svg>
                Connect Instagram Account
              </>
            )}
          </button>
          
          <p className="privacy-note">
            By connecting your Instagram account, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstagramConnectPage;
