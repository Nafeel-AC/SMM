import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import './DashboardPage.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch Instagram insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('instagram_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();

      if (insightsError && insightsError.code !== 'PGRST116') {
        console.error('Error fetching insights:', insightsError);
      } else {
        setInsights(insightsData);
      }

      // Fetch user requirements
      const { data: requirementsData, error: requirementsError } = await supabase
        .from('user_requirements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (requirementsError && requirementsError.code !== 'PGRST116') {
        console.error('Error fetching requirements:', requirementsError);
      } else {
        setRequirements(requirementsData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getEngagementColor = (rate) => {
    if (rate >= 5) return '#10b981';
    if (rate >= 3) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.user_metadata?.full_name || 'User'}!</h1>
          <p>Here's your Instagram growth overview</p>
        </div>

        {insights ? (
          <>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👥</div>
                <div className="metric-content">
                  <h3>Followers</h3>
                  <div className="metric-value">{formatNumber(insights.followers_count)}</div>
                  <div className="metric-change positive">+12% this month</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <h3>Engagement Rate</h3>
                  <div className="metric-value" style={{ color: getEngagementColor(insights.engagement_rate) }}>
                    {insights.engagement_rate}%
                  </div>
                  <div className="metric-change positive">+0.8% this month</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">👀</div>
                <div className="metric-content">
                  <h3>Reach</h3>
                  <div className="metric-value">{formatNumber(insights.reach)}</div>
                  <div className="metric-change positive">+18% this month</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">📱</div>
                <div className="metric-content">
                  <h3>Posts</h3>
                  <div className="metric-value">{insights.media_count}</div>
                  <div className="metric-change">+3 this month</div>
                </div>
              </div>
            </div>

            <div className="insights-grid">
              <div className="insight-card">
                <h3>Content Performance</h3>
                <div className="performance-metrics">
                  <div className="performance-item">
                    <span className="label">Avg Likes</span>
                    <span className="value">{insights.avg_likes}</span>
                  </div>
                  <div className="performance-item">
                    <span className="label">Avg Comments</span>
                    <span className="value">{insights.avg_comments}</span>
                  </div>
                  <div className="performance-item">
                    <span className="label">Impressions</span>
                    <span className="value">{formatNumber(insights.impressions)}</span>
                  </div>
                </div>
              </div>

              <div className="insight-card">
                <h3>Profile Activity</h3>
                <div className="activity-metrics">
                  <div className="activity-item">
                    <span className="label">Profile Views</span>
                    <span className="value">{insights.profile_views}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Website Clicks</span>
                    <span className="value">{insights.website_clicks}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Email Contacts</span>
                    <span className="value">{insights.email_contacts}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data-card">
            <div className="no-data-icon">📊</div>
            <h3>No Instagram Data Yet</h3>
            <p>Connect your Instagram account to see detailed analytics and insights.</p>
            <button className="connect-btn">Connect Instagram</button>
          </div>
        )}

        {requirements && (
          <div className="requirements-card">
            <h3>Your Growth Strategy</h3>
            <div className="strategy-details">
              <div className="strategy-item">
                <span className="label">Business Type</span>
                <span className="value">{requirements.business_type}</span>
              </div>
              <div className="strategy-item">
                <span className="label">Posting Frequency</span>
                <span className="value">{requirements.posting_frequency}</span>
              </div>
              <div className="strategy-item">
                <span className="label">Budget Range</span>
                <span className="value">{requirements.budget_range}</span>
              </div>
              {requirements.content_goals && requirements.content_goals.length > 0 && (
                <div className="strategy-item">
                  <span className="label">Goals</span>
                  <span className="value">{requirements.content_goals.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="action-cards">
          <div className="action-card">
            <div className="action-icon">📈</div>
            <h4>Growth Report</h4>
            <p>View detailed analytics and growth trends</p>
            <button className="action-btn">View Report</button>
          </div>

          <div className="action-card">
            <div className="action-icon">🎯</div>
            <h4>Content Strategy</h4>
            <p>Get personalized content recommendations</p>
            <button className="action-btn">View Strategy</button>
          </div>

          <div className="action-card">
            <div className="action-icon">💬</div>
            <h4>Support</h4>
            <p>Get help from our growth experts</p>
            <button className="action-btn">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
