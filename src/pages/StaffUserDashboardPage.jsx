import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { dashboardDataService } from '../lib/dashboard-data-service';
import './StaffDashboard/StaffDashboard.css';

const StaffUserDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const initialUser = location.state?.user || null;

  const [user, setUser] = useState(initialUser);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await dashboardDataService.getDashboardData(userId);
        if (result && result.data) {
          setData(result.data);
        } else {
          setError('Failed to load user dashboard data.');
        }
      } catch (e) {
        setError('Failed to load user dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
        <h1>{user?.display_name || user?.email || 'User'} Dashboard</h1>
        <div className="staff-info">
          <button className="logout-btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>

      <div className="user-dashboard-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading user dashboard...</p>
          </div>
        )}
        {error && !loading && (
          <div className="detail-section" style={{ background: '#fee2e2', color: '#991b1b' }}>
            {error}
          </div>
        )}
        {!loading && data && (
          <>
            <div className="dashboard-metrics">
              <div className="metric">
                <h4>Followers</h4>
                <p>{data?.insights?.followers_count ?? '-'}</p>
              </div>
              <div className="metric">
                <h4>Following</h4>
                <p>{data?.insights?.following_count ?? '-'}</p>
              </div>
              <div className="metric">
                <h4>Engagement Rate</h4>
                <p>{data?.insights?.engagement_rate ?? '-'}%</p>
              </div>
              <div className="metric">
                <h4>Posts</h4>
                <p>{data?.insights?.media_count ?? '-'}</p>
              </div>
            </div>

            <div className="dashboard-details">
              <div className="detail-section">
                <h4>Business Type</h4>
                <p>{data?.requirements?.business_type ?? '-'}</p>
              </div>
              <div className="detail-section">
                <h4>Posting Frequency</h4>
                <p>{data?.requirements?.posting_frequency ?? '-'}</p>
              </div>
              <div className="detail-section">
                <h4>Target Locations</h4>
                <p>{Array.isArray(data?.strategy?.target_locations) ? data.strategy.target_locations.join(', ') : '-'}</p>
              </div>
              <div className="detail-section">
                <h4>Selected Hashtags</h4>
                <p>{Array.isArray(data?.hashtags?.selected) ? data.hashtags.selected.map(h => h.hashtag).join(', ') : '-'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffUserDashboardPage;


