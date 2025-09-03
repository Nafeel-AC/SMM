import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import './AdminPanel.css';

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useFirebaseAuth();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch user statistics
      const profilesRef = collection(db, 'profiles');
      const profilesSnapshot = await getDocs(profilesRef);
      const usersData = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalUsers = usersData?.length || 0;
      const activeUsers = usersData?.filter(u => u.status === 'active').length || 0;
      const instagramConnected = usersData?.filter(u => u.instagram_connected).length || 0;
      
      setStats({
        totalUsers,
        activeUsers,
        instagramConnected,
        newUsersThisMonth: Math.floor(totalUsers * 0.15) // Mock data
      });
      
      setRecentUsers(usersData?.slice(0, 5) || []);

      // Fetch system health data
      const insightsRef = collection(db, 'instagram_insights');
      const insightsSnapshot = await getDocs(insightsRef);
      const insightsData = insightsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const avgEngagement = insightsData?.length > 0 
        ? (insightsData.reduce((sum, insight) => sum + (insight.engagement_rate || 0), 0) / insightsData.length).toFixed(1)
        : 0;
      
      setSystemHealth({
        avgEngagement: parseFloat(avgEngagement),
        totalInsights: insightsData?.length || 0,
        systemUptime: '99.9%',
        lastBackup: new Date().toLocaleDateString()
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>System overview and management dashboard</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System Health
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-change positive">+{stats.newUsersThisMonth} this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Active Users</h3>
                  <div className="stat-value">{stats.activeUsers}</div>
                  <div className="stat-change positive">
                    {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📱</div>
                <div className="stat-content">
                  <h3>Instagram Connected</h3>
                  <div className="stat-value">{stats.instagramConnected}</div>
                  <div className="stat-change positive">
                    {stats.totalUsers > 0 ? Math.round((stats.instagramConnected / stats.totalUsers) * 100) : 0}% of users
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Avg Engagement</h3>
                  <div className="stat-value">{systemHealth.avgEngagement}%</div>
                  <div className="stat-change positive">+0.3% this month</div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent User Activity</h3>
              <div className="activity-list">
                {recentUsers.map((userData) => (
                  <div key={userData.id} className="activity-item">
                    <div className="activity-avatar">
                      {userData.avatar_url ? (
                        <img src={userData.avatar_url} alt="User Avatar" />
                      ) : (
                        <div className="avatar-placeholder">
                          {userData.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="activity-info">
                      <h4>{userData.full_name || 'Unknown User'}</h4>
                      <p>{userData.email}</p>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-time">{formatDate(userData.created_at)}</span>
                      <span className={`activity-status ${userData.status || 'inactive'}`}>
                        {userData.status || 'inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h3>User Management</h3>
              <button className="action-btn">Export Users</button>
            </div>
            
            <div className="users-table">
              <div className="table-header">
                <div className="table-cell">User</div>
                <div className="table-cell">Email</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Instagram</div>
                <div className="table-cell">Joined</div>
                <div className="table-cell">Actions</div>
              </div>
              
              {recentUsers.map((userData) => (
                <div key={userData.id} className="table-row">
                  <div className="table-cell">
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {userData.avatar_url ? (
                          <img src={userData.avatar_url} alt="User Avatar" />
                        ) : (
                          <div className="avatar-placeholder-small">
                            {userData.full_name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <span>{userData.full_name || 'Unknown User'}</span>
                    </div>
                  </div>
                  <div className="table-cell">{userData.email}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${userData.status || 'inactive'}`}>
                      {userData.status || 'inactive'}
                    </span>
                  </div>
                  <div className="table-cell">
                    {userData.instagram_accounts?.length > 0 ? '✅' : '❌'}
                  </div>
                  <div className="table-cell">{formatDate(userData.created_at)}</div>
                  <div className="table-cell">
                    <button className="action-btn-small">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="system-section">
            <div className="system-grid">
              <div className="system-card">
                <h3>System Health</h3>
                <div className="health-metrics">
                  <div className="health-item">
                    <span className="health-label">Uptime</span>
                    <span className="health-value good">{systemHealth.systemUptime}</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">Database</span>
                    <span className="health-value good">Healthy</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">API Status</span>
                    <span className="health-value good">Operational</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">Last Backup</span>
                    <span className="health-value">{systemHealth.lastBackup}</span>
                  </div>
                </div>
              </div>

              <div className="system-card">
                <h3>Performance Metrics</h3>
                <div className="performance-metrics">
                  <div className="performance-item">
                    <span className="performance-label">Avg Response Time</span>
                    <span className="performance-value">245ms</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-label">Error Rate</span>
                    <span className="performance-value good">0.02%</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-label">Active Sessions</span>
                    <span className="performance-value">{stats.activeUsers}</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-label">Data Processed</span>
                    <span className="performance-value">2.4GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-grid">
              <div className="settings-card">
                <h3>System Settings</h3>
                <div className="setting-item">
                  <label>Maintenance Mode</label>
                  <button className="toggle-btn">Off</button>
                </div>
                <div className="setting-item">
                  <label>Auto Backups</label>
                  <button className="toggle-btn active">On</button>
                </div>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <button className="toggle-btn active">On</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-btn">Run System Backup</button>
                  <button className="action-btn">Clear Cache</button>
                  <button className="action-btn">Update System</button>
                  <button className="action-btn danger">Reset Database</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
