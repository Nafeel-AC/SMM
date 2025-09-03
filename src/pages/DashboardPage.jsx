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
  const [timeRange, setTimeRange] = useState('12months');
  const [isRealtime, setIsRealtime] = useState(false);
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

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
                targetLocations={dashboardData.strategy.target_locations}
                targetAudience={dashboardData.strategy.target_audience}
              />

              {/* Accounts Section */}
              <AccountsSection 
                initialAccounts={dashboardData.accounts.selected}
                initialBulkAccounts={dashboardData.accounts.bulk}
                userId={user.uid}
              />
            </div>

            <div className="dashboard-sidebar">
              {/* Hashtags Section */}
              <HashtagsSection 
                initialHashtags={dashboardData.hashtags.selected}
                predefinedHashtags={dashboardData.hashtags.predefined}
                userId={user.uid}
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
