import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './StaffPanel.css';

const UserDashboard = ({ user, onBack, staffId }) => {
  const [dashboardData, setDashboardData] = useState({
    targets: [],
    requirements: null,
    instagramAccount: null,
    payments: []
  });
  const [loading, setLoading] = useState(true);
  const [editingRequirements, setEditingRequirements] = useState(false);
  const [requirementsForm, setRequirementsForm] = useState({});

  useEffect(() => {
    fetchUserData();
  }, [user.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch all user data
      const [targetsResult, requirementsResult, instagramResult, paymentsResult] = await Promise.all([
        supabase.from('dashboard_targets').select('*').eq('user_id', user.id),
        supabase.from('user_requirements').select('*').eq('user_id', user.id).single(),
        supabase.from('instagram_accounts').select('*').eq('user_id', user.id).single(),
        supabase.from('payments').select('*').eq('user_id', user.id)
      ]);

      setDashboardData({
        targets: targetsResult.data || [],
        requirements: requirementsResult.data,
        instagramAccount: instagramResult.data,
        payments: paymentsResult.data || []
      });

      if (requirementsResult.data) {
        setRequirementsForm(requirementsResult.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTarget = async (targetType, value) => {
    try {
      const { data, error } = await supabase
        .from('dashboard_targets')
        .insert([
          {
            user_id: user.id,
            target_type: targetType,
            value: value,
            created_by: staffId
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setDashboardData(prev => ({
        ...prev,
        targets: [...prev.targets, data]
      }));
    } catch (error) {
      console.error('Error adding target:', error);
    }
  };

  const handleUpdateRequirements = async () => {
    try {
      const { error } = await supabase
        .from('user_requirements')
        .update({
          ...requirementsForm,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setEditingRequirements(false);
      await fetchUserData(); // Refresh data
    } catch (error) {
      console.error('Error updating requirements:', error);
    }
  };

  const handleRequirementsChange = (field, value) => {
    setRequirementsForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to User List
        </button>
        <div className="user-info">
          <h1>{user.full_name || 'Unnamed User'}</h1>
          <p>User Dashboard - Staff View</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Growth Metrics (Green Zone) - Read Only */}
        <div className="dashboard-section green-zone">
          <h2>Growth Metrics (Instagram Insights)</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Followers</h3>
              <p className="metric-value">1,234</p>
              <p className="metric-change">+12% this month</p>
            </div>
            <div className="metric-card">
              <h3>Engagement Rate</h3>
              <p className="metric-value">4.2%</p>
              <p className="metric-change">+0.3% this month</p>
            </div>
            <div className="metric-card">
              <h3>Posts</h3>
              <p className="metric-value">45</p>
              <p className="metric-change">+8 this month</p>
            </div>
            <div className="metric-card">
              <h3>Currently Following From</h3>
              <p className="metric-value">892</p>
              <p className="metric-change">Active accounts</p>
            </div>
          </div>
        </div>

        {/* Additional Targets (Red Zone) - Editable by Staff */}
        <div className="dashboard-section red-zone">
          <h2>Additional Targets (Staff Controls)</h2>
          <div className="targets-section">
            <div className="targets-list">
              {dashboardData.targets.map((target) => (
                <div key={target.id} className="target-item">
                  <span className="target-type">{target.target_type}:</span>
                  <span className="target-value">{target.value}</span>
                </div>
              ))}
            </div>
            
            <div className="add-target-form">
              <input 
                type="text" 
                placeholder="Target type (e.g., Unfollowing, Target History)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const targetType = e.target.value;
                    const value = prompt('Enter target value:');
                    if (value) {
                      handleAddTarget(targetType, value);
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* User Requirements - Editable by Staff */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>User Requirements</h2>
            <button 
              className="edit-btn"
              onClick={() => setEditingRequirements(!editingRequirements)}
            >
              {editingRequirements ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingRequirements ? (
            <div className="requirements-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Niche</label>
                  <input 
                    type="text"
                    value={requirementsForm.niche || ''}
                    onChange={(e) => handleRequirementsChange('niche', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text"
                    value={requirementsForm.location || ''}
                    onChange={(e) => handleRequirementsChange('location', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Comments per day</label>
                  <input 
                    type="number"
                    value={requirementsForm.comments || ''}
                    onChange={(e) => handleRequirementsChange('comments', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>DMs per day</label>
                  <input 
                    type="number"
                    value={requirementsForm.dms || ''}
                    onChange={(e) => handleRequirementsChange('dms', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Max Following</label>
                  <input 
                    type="number"
                    value={requirementsForm.max_following || ''}
                    onChange={(e) => handleRequirementsChange('max_following', e.target.value)}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Hashtags</label>
                  <textarea 
                    value={requirementsForm.hashtags || ''}
                    onChange={(e) => handleRequirementsChange('hashtags', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Account Targets</label>
                  <textarea 
                    value={requirementsForm.account_targets || ''}
                    onChange={(e) => handleRequirementsChange('account_targets', e.target.value)}
                    rows="3"
                  />
                </div>
              </div>
              <button className="save-btn" onClick={handleUpdateRequirements}>
                Save Changes
              </button>
            </div>
          ) : (
            <div className="requirements-display">
              {dashboardData.requirements ? (
                <div className="requirements-grid">
                  <div className="requirement-item">
                    <strong>Niche:</strong> {dashboardData.requirements.niche}
                  </div>
                  <div className="requirement-item">
                    <strong>Location:</strong> {dashboardData.requirements.location}
                  </div>
                  <div className="requirement-item">
                    <strong>Comments:</strong> {dashboardData.requirements.comments} per day
                  </div>
                  <div className="requirement-item">
                    <strong>DMs:</strong> {dashboardData.requirements.dms} per day
                  </div>
                  <div className="requirement-item">
                    <strong>Max Following:</strong> {dashboardData.requirements.max_following}
                  </div>
                  <div className="requirement-item full-width">
                    <strong>Hashtags:</strong> {dashboardData.requirements.hashtags}
                  </div>
                  <div className="requirement-item full-width">
                    <strong>Account Targets:</strong> {dashboardData.requirements.account_targets}
                  </div>
                </div>
              ) : (
                <p>No requirements submitted yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Staff-only sections */}
        <div className="dashboard-section staff-only">
          <h2>Staff-Only Information</h2>
          <div className="staff-info">
            <div className="info-item">
              <strong>Unfollowing:</strong> 45 accounts this week
            </div>
            <div className="info-item">
              <strong>Target History:</strong> 234 accounts targeted
            </div>
            <div className="info-item">
              <strong>Last Activity:</strong> 2 hours ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
