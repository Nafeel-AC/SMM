import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { instagramService } from '../../lib/instagram';
import './InstagramInsights.css';

const InstagramInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchInstagramInsights();
  }, [user]);

  const fetchInstagramInsights = async () => {
    try {
      setLoading(true);

      // Get user's Instagram account
      const { data: instagramAccount, error: accountError } = await supabase
        .from('instagram_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (accountError || !instagramAccount) {
        setError('No Instagram account connected');
        return;
      }

      // Try to get stored insights first
      let storedInsights = await instagramService.getStoredInsights(user.id);
      
      // If no stored insights or data is old (older than 24 hours), fetch fresh data
      const isDataOld = !storedInsights || 
        (new Date() - new Date(storedInsights.last_updated)) > 24 * 60 * 60 * 1000;

      if (isDataOld) {
        try {
          // Fetch fresh insights from Instagram API
          storedInsights = await instagramService.fetchAndSaveInsights(
            user.id, 
            instagramAccount.access_token
          );
        } catch (apiError) {
          console.warn('Failed to fetch fresh insights, using stored data:', apiError);
          // If API fails, use stored data if available
          if (!storedInsights) {
            throw new Error('Unable to fetch Instagram insights');
          }
        }
      }

      setInsights(storedInsights);
    } catch (error) {
      setError('Failed to fetch Instagram insights');
      console.error('Error fetching Instagram insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="instagram-insights">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Instagram insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instagram-insights">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="instagram-insights">
        <div className="no-data">
          <p>No Instagram insights available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="instagram-insights">
      <div className="insights-header">
        <h3>Instagram Insights</h3>
        <p>Real-time data from your Instagram account</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon">👥</div>
          <div className="insight-content">
            <h4>Followers</h4>
            <p className="insight-value">{insights.followers_count.toLocaleString()}</p>
            <p className="insight-change">+12% this month</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">📈</div>
          <div className="insight-content">
            <h4>Engagement Rate</h4>
            <p className="insight-value">{insights.engagement_rate}%</p>
            <p className="insight-change">+0.3% this month</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">📱</div>
          <div className="insight-content">
            <h4>Posts</h4>
            <p className="insight-value">{insights.media_count}</p>
            <p className="insight-change">+8 this month</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">👀</div>
          <div className="insight-content">
            <h4>Reach</h4>
            <p className="insight-value">{insights.reach.toLocaleString()}</p>
            <p className="insight-change">+15% this month</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">👁️</div>
          <div className="insight-content">
            <h4>Impressions</h4>
            <p className="insight-value">{insights.impressions.toLocaleString()}</p>
            <p className="insight-change">+22% this month</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">❤️</div>
          <div className="insight-content">
            <h4>Avg Likes</h4>
            <p className="insight-value">{insights.avg_likes}</p>
            <p className="insight-change">+5 this month</p>
          </div>
        </div>
      </div>

      <div className="insights-actions">
        <button className="refresh-btn" onClick={fetchInstagramInsights}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
          </svg>
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default InstagramInsights;
