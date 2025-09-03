import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import InstagramInsights from '../components/InstagramInsights';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [userRequirements, setUserRequirements] = useState(null);
  const [instagramAccount, setInstagramAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user requirements
      const { data: requirements } = await supabase
        .from('user_requirements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch Instagram account
      const { data: instagram } = await supabase
        .from('instagram_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserRequirements(requirements);
      setInstagramAccount(instagram);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {profile?.full_name || user?.email}!</h1>
          <p>Here's your Instagram growth dashboard</p>
        </div>

        <div className="dashboard-content">
          {/* Instagram Insights */}
          <div className="dashboard-section">
            <h2>Instagram Insights</h2>
            <InstagramInsights />
          </div>

          {/* User Requirements */}
          {userRequirements && (
            <div className="dashboard-section">
              <h2>Your Growth Strategy</h2>
              <div className="requirements-card">
                <div className="requirement-item">
                  <strong>Niche:</strong> {userRequirements.niche}
                </div>
                <div className="requirement-item">
                  <strong>Location:</strong> {userRequirements.location}
                </div>
                <div className="requirement-item">
                  <strong>Comments per day:</strong> {userRequirements.comments}
                </div>
                <div className="requirement-item">
                  <strong>DMs per day:</strong> {userRequirements.dms}
                </div>
                <div className="requirement-item">
                  <strong>Max Following:</strong> {userRequirements.max_following}
                </div>
                <div className="requirement-item">
                  <strong>Hashtags:</strong> {userRequirements.hashtags}
                </div>
                <div className="requirement-item">
                  <strong>Account Targets:</strong> {userRequirements.account_targets}
                </div>
              </div>
            </div>
          )}

          {/* Instagram Account Status */}
          {instagramAccount && (
            <div className="dashboard-section">
              <h2>Connected Account</h2>
              <div className="account-card">
                <div className="account-status">
                  <span className="status-indicator connected"></span>
                  <span>Instagram Connected</span>
                </div>
                <div className="account-details">
                  <p><strong>User ID:</strong> {instagramAccount.instagram_user_id}</p>
                  <p><strong>Connected:</strong> {new Date(instagramAccount.connected_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary">
                View Growth Reports
              </button>
              <button className="action-btn secondary">
                Update Requirements
              </button>
              <button className="action-btn secondary">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


