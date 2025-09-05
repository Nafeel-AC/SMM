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
import './DashboardPage.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [dashboardSettings, setDashboardSettings] = useState(null);
  const [timeRange, setTimeRange] = useState('12months');
  const [isRealtime, setIsRealtime] = useState(false);
  const { user, signOut } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchRequirements();
      fetchDashboardSettings();
    }
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

  const fetchDashboardData = async () => {
    try {
      console.log('🔍 Fetching comprehensive dashboard data for user:', user.uid);
      
      const result = await dashboardDataService.getDashboardData(user.uid);
      
      if (result.error) {
        console.error('❌ Error fetching dashboard data:', result.error);
      } else {
        console.log('✅ Dashboard data loaded successfully:', result.data);
        setDashboardData(result.data);
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

  const handleRealtimeToggle = () => {
    setIsRealtime(!isRealtime);
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button
            className="logout-btn"
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
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
              {/* Top Metrics and Realtime Toggle */}
              <MetricsDisplay 
                followers={dashboardData.insights.followers_count}
                following={dashboardData.insights.following_count}
                onRealtimeToggle={handleRealtimeToggle}
                isRealtime={isRealtime}
              />

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
