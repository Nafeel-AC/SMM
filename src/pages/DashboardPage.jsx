import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { dashboardDataService } from '../lib/dashboard-data-service';
import { addUserSampleData } from '../lib/add-dashboard-sample-data';
import AnalyticsChart from '../components/AnalyticsChart';
import MetricsDisplay from '../components/MetricsDisplay';
import StrategySection from '../components/StrategySection';
import HashtagsSection from '../components/HashtagsSection';
import AccountsSection from '../components/AccountsSection';
import Navbar from '../components/Navbar';
import './DashboardPage.css';
import { firebaseInstagramService } from '../lib/firebase-instagram';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [dashboardSettings, setDashboardSettings] = useState(null);
  const [instagramAccount, setInstagramAccount] = useState(null);
  const [timeRange, setTimeRange] = useState('6months');
  const { user, signOut, isStaff } = useFirebaseAuth();

  useEffect(() => {
    if (!user) return;
    
    // Fetch initial data
    fetchInstagramAccount();
    fetchRequirements();
    fetchDashboardSettings();
    fetchDashboardData();
    
    const intervalMs = 6 * 60 * 60 * 1000; // 6 hours
    const id = setInterval(async () => {
      try {
        await firebaseInstagramService.fetchAndSaveRealInsights(user.uid);
        await fetchDashboardData();
      } catch (e) {
        // ignore transient failures
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [user]);

  const fetchRequirements = async () => {
    try {
      const result = await dashboardDataService.db.getUserRequirements(user.uid);
      if (!result.error && result.data) {
        setRequirements(result.data);
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  const fetchDashboardSettings = async () => {
    try {
      const result = await dashboardDataService.getDashboardSettings(user.uid);
      if (!result.error && result.data) {
        setDashboardSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard settings:', error);
    }
  };

  const isStale = (iso) => {
    if (!iso) return true;
    const updated = new Date(iso).getTime();
    const now = Date.now();
    return (now - updated) > 24 * 60 * 60 * 1000;
  };

  const fetchInstagramAccount = async () => {
    try {
      const result = await firebaseDb.getInstagramAccount(user.uid);
      if (!result.error && result.data) {
        setInstagramAccount(result.data);
      }
    } catch (error) {
      console.error('Error fetching Instagram account:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      console.log('🔍 Fetching comprehensive dashboard data for user:', user.uid);
      const result = await dashboardDataService.getDashboardData(user.uid);
      if (result.error) {
        console.error('❌ Error fetching dashboard data:', result.error);
      } else {
        console.log('✅ Dashboard data loaded successfully:', result.data);
        setDashboardData(result.data);

        // Auto-refresh insights if stale (>24h)
        const lastUpdated = result.data?.insights?.last_updated;
        if (isStale(lastUpdated)) {
          console.log('⏱️ Insights stale or missing, refreshing from Instagram Graph API...');
          await firebaseInstagramService.fetchAndSaveRealInsights(user.uid);
          const refreshed = await dashboardDataService.getDashboardData(user.uid);
          if (!refreshed.error) {
            setDashboardData(refreshed.data);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
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

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleAddSampleData = async () => {
    try {
      setLoading(true);
      const result = await addUserSampleData(user.uid);
      if (result.success) {
        // Refresh dashboard data
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error adding sample data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInsights = async () => {
    try {
      setLoading(true);
      await firebaseInstagramService.fetchAndSaveRealInsights(user.uid);
      await fetchDashboardData();
    } catch (e) {
      console.error('Error refreshing insights:', e);
    } finally {
      setLoading(false);
    }
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
      <Navbar />
      <div className="dashboard-container">
        {/* Show order status at the top if requirements are loaded */}
        {requirements && typeof requirements.order_completed !== 'undefined' && (
          <div style={{
            background: requirements.order_completed ? '#e6ffed' : '#fffbe6',
            color: requirements.order_completed ? '#237804' : '#ad8b00',
            border: '1px solid',
            borderColor: requirements.order_completed ? '#b7eb8f' : '#ffe58f',
            borderRadius: 8,
            padding: '12px 20px',
            marginBottom: 24,
            fontWeight: 600,
            fontSize: 18
          }}>
            Order Status: {requirements.order_completed ? 'Completed' : 'Pending'}
          </div>
        )}
        {dashboardData ? (
          <div className="dashboard-layout">
            <div className="dashboard-main">
              {/* Instagram Account Info */}
              {instagramAccount && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    📸
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1a202c' }}>
                      @{instagramAccount.username}
                    </h3>
                    <p style={{ margin: '0 0 4px 0', color: '#4a5568', fontSize: '14px' }}>
                      Instagram Account Connected
                    </p>
                    <p style={{ margin: '0', color: '#718096', fontSize: '12px' }}>
                      Connected on {new Date(instagramAccount.connected_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ✓ Connected
                  </div>
                </div>
              )}

              {/* Top Metrics */}
              <MetricsDisplay 
                followers={dashboardData.insights.followers_count}
                following={dashboardData.insights.following_count}
              />

              {/* Add manual refresh insights button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button className="sample-data-btn" onClick={handleRefreshInsights}>
                  Refresh Insights
                </button>
              </div>

              {/* Analytics Chart */}
              <AnalyticsChart 
                data={dashboardData.insights.chartData}
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />

              {/* Strategy Section */}
              <StrategySection 
                targetLocations={requirements?.location || dashboardSettings?.strategy?.target_locations || []}
                targetAudience={requirements?.niche || dashboardSettings?.strategy?.target_audience || []}
                disabled={true}
              />

              {/* Display Currently following From field (disabled input) - Only visible to staff */}
              {isStaff() && (
                <div style={{ margin: '24px 0' }}>
                  <label style={{ fontWeight: 600 }}>Currently following From:</label>
                  <input
                    type="text"
                    value={requirements?.currently_following_from && requirements.currently_following_from.trim() !== '' ? requirements.currently_following_from : 'none'}
                    disabled
                    style={{ marginLeft: 8, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '100%' }}
                  />
                </div>
              )}


              {/* Accounts Section */}
              <AccountsSection 
                initialAccounts={Array.isArray(requirements?.account_targets)
                  ? requirements.account_targets.map((acc, idx) => ({ id: idx + 1, account: acc }))
                  : dashboardSettings?.accounts || []}
                initialBulkAccounts={Array.isArray(requirements?.account_targets) ? requirements.account_targets.join(' ') : ''}
                userId={user.uid}
                disabled={true}
              />
            </div>

            <div className="dashboard-sidebar">
              {/* Hashtags Section */}
              <HashtagsSection 
                initialHashtags={Array.isArray(requirements?.hashtags)
                  ? requirements.hashtags.map((tag, idx) => ({ id: idx + 1, hashtag: tag, posts: 0 }))
                  : dashboardSettings?.hashtags || []}
                predefinedHashtags={Array.isArray(requirements?.hashtags) ? requirements.hashtags : []}
                userId={user.uid}
                disabled={true}
              />
            </div>
          </div>
        ) : (
          <div className="no-data-card">
            <div className="no-data-icon">📊</div>
            <h3>No Instagram Data Yet</h3>
            <p>Connect your Instagram account to see detailed analytics and insights, or add sample data to explore the dashboard.</p>
            <div className="no-data-actions">
              <button 
                className="connect-btn"
                onClick={() => navigate('/instagram-connect')}
              >
                Connect Instagram
              </button>
              <button 
                className="sample-data-btn"
                onClick={handleAddSampleData}
                disabled={loading}
              >
                {loading ? 'Adding Sample Data...' : 'Add Sample Data'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
