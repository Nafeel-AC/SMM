import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import MetricsDisplay from '../../components/MetricsDisplay';
import AnalyticsChart from '../../components/AnalyticsChart';
import StrategySection from '../../components/StrategySection';
import HashtagsSection from '../../components/HashtagsSection';
import AccountsSection from '../../components/AccountsSection';
import './StaffDashboard.css';

const EditUserDashboard = () => {
  const { userId } = useParams();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [dashboardSettings, setDashboardSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedRequirements, setEditedRequirements] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchRequirements();
    fetchDashboardSettings();
  }, [userId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const result = await dashboardDataService.getDashboardData(userId);
      if (!result.error && result.data) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequirements = async () => {
    try {
      const result = await dashboardDataService.db.getUserRequirements(userId);
      if (!result.error && result.data) {
        setRequirements(result.data);
        setEditedRequirements(result.data);
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  const fetchDashboardSettings = async () => {
    try {
      const result = await dashboardDataService.getDashboardSettings(userId);
      if (!result.error && result.data) {
        setDashboardSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard settings:', error);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedRequirements(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const result = await dashboardDataService.updateUserRequirements(userId, editedRequirements);
      if (result.error) {
        alert('Error updating requirements: ' + result.error);
      } else {
        setRequirements(editedRequirements);
        setEditMode(false);
        alert('User requirements updated successfully!');
      }
    } catch (error) {
      alert('Error updating requirements: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2>User Dashboard</h2>
        {dashboardData ? (
          <div className="dashboard-layout">
            <div className="dashboard-main">
              <MetricsDisplay 
                followers={dashboardData.insights.followers_count}
                following={dashboardData.insights.following_count}
                isRealtime={false}
              />
              <AnalyticsChart 
                data={dashboardData.insights.chartData}
                timeRange={'12months'}
              />
              <StrategySection 
                targetLocations={editedRequirements.location || dashboardSettings?.strategy?.target_locations || []}
                targetAudience={editedRequirements.niche || dashboardSettings?.strategy?.target_audience || []}
                disabled={!editMode}
              />
              <AccountsSection 
                initialAccounts={Array.isArray(editedRequirements.account_targets)
                  ? editedRequirements.account_targets.map((acc, idx) => ({ id: idx + 1, account: acc }))
                  : dashboardSettings?.accounts || []}
                initialBulkAccounts={Array.isArray(editedRequirements.account_targets) ? editedRequirements.account_targets.join(' ') : ''}
                userId={userId}
                disabled={!editMode}
              />
            </div>
            <div className="dashboard-sidebar">
              <HashtagsSection 
                initialHashtags={Array.isArray(editedRequirements.hashtags)
                  ? editedRequirements.hashtags.map((tag, idx) => ({ id: idx + 1, hashtag: tag, posts: 0 }))
                  : dashboardSettings?.hashtags || []}
                predefinedHashtags={Array.isArray(editedRequirements.hashtags) ? editedRequirements.hashtags : []}
                userId={userId}
                disabled={!editMode}
              />
            </div>
            {/* All User Fields section at the end of the page */}
            <div className="editable-section" style={{ marginTop: 48 }}>
              <h3>All User Fields</h3>
              <div className="editable-fields">
                {requirements && Object.keys(requirements)
                  .filter(key => key !== 'order_completed')
                  .map((key) => (
                    <div key={key} style={{ marginBottom: '16px' }}>
                      <label style={{ fontWeight: 600 }}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={typeof editedRequirements[key] === 'object' && editedRequirements[key] !== null
                            ? editedRequirements[key].seconds !== undefined
                              ? new Date(editedRequirements[key].seconds * 1000).toISOString()
                              : JSON.stringify(editedRequirements[key])
                            : editedRequirements[key] || ''}
                          onChange={e => handleFieldChange(key, e.target.value)}
                          style={{ marginLeft: 8, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '100%' }}
                        />
                      ) : (
                        <span style={{ marginLeft: 8 }}>
                          {typeof requirements[key] === 'object' && requirements[key] !== null
                            ? requirements[key].seconds !== undefined
                              ? new Date(requirements[key].seconds * 1000).toLocaleString()
                              : JSON.stringify(requirements[key])
                            : requirements[key]}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            {/* Edit/Save buttons at the end of the page */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <button onClick={() => setEditMode(!editMode)} className="edit-btn">
                {editMode ? 'Cancel Edit' : 'Edit Fields'}
              </button>
              {editMode && (
                <button onClick={handleSave} className="save-btn" style={{ marginLeft: 12 }}>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="no-data-card">
            <div className="no-data-icon">📊</div>
            <h3>No Instagram Data Yet</h3>
            <p>Connect your Instagram account to see detailed analytics and insights, or add sample data to explore the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserDashboard;
