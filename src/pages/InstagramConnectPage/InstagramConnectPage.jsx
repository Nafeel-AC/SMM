import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { firebaseDb } from '../../lib/firebase-db';
import './InstagramConnectPage.css';
import { buildInstagramLoginUrl, getInstagramLoginEnv } from '../../lib/instagram-login-client';
import { testInstagramConfig } from '../../utils/test-instagram-config';

const InstagramConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState(null);
  const { user, fetchUserProfile } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Test configuration on component mount
    const config = getInstagramLoginEnv();
    setConfig(config);
    testInstagramConfig();
  }, []);

  const handleConnectInstagram = async () => {
    try {
      setLoading(true);
      const state = JSON.stringify({ uid: user.uid, ts: Date.now() });
      const url = buildInstagramLoginUrl({ state });
      window.location.href = url;
    } catch (e) {
      console.error('Unable to start Instagram Login:', e);
      alert('Instagram login is not fully configured. Please set VITE_IG_CLIENT_ID and VITE_IG_REDIRECT_URI.');
      setLoading(false);
    }
  };



  if (connected) {
    return (
      <div className="connect-container">
        <div className="success-section">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#10b981"/>
            </svg>
          </div>
          <h2>Instagram Connected Successfully!</h2>
          <p>Your Instagram account has been connected. Your personalized analytics and insights are now available in your dashboard.</p>
          <div className="redirect-info">
            <p>Redirecting to requirements form...</p>
            <div className="spinner"></div>
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
          <p>Connect your Instagram account to access personalized growth insights and analytics.</p>
        </div>

        {/* Debug Information */}
        {config && (
          <div style={{ 
            background: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>🔧 Configuration Debug</h4>
            <div style={{ marginBottom: '8px' }}>
              <strong>Client ID:</strong> {config.clientId ? '✅ Set' : '❌ Missing'}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Redirect URI:</strong> {config.redirectUri ? '✅ Set' : '❌ Missing'}
            </div>
            {config.redirectUri && (
              <div style={{ 
                background: '#e9ecef', 
                padding: '8px', 
                borderRadius: '4px', 
                fontFamily: 'monospace',
                fontSize: '12px',
                wordBreak: 'break-all'
              }}>
                {config.redirectUri}
              </div>
            )}
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
              Make sure this redirect URI is added to your Meta App Dashboard
            </div>
          </div>
        )}

        <div className="benefits-section">
          <h3>What you'll get:</h3>
          <ul className="benefits-list">
            <li>
              <span className="benefit-icon">📊</span>
              <div>
                <strong>Growth Analytics</strong>
                <p>Track your follower growth and engagement metrics</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🎯</span>
              <div>
                <strong>Audience Insights</strong>
                <p>Understand your audience demographics and behavior</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">📈</span>
              <div>
                <strong>Performance Tracking</strong>
                <p>Monitor your content performance and reach</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🔒</span>
              <div>
                <strong>Secure Connection</strong>
                <p>Your data is encrypted and we only access what's necessary</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="connect-actions">
          <button 
            className="connect-btn"
            onClick={handleConnectInstagram}
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
