import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import './StaffPanel.css';

const StaffPanel = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useFirebaseAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const profilesRef = collection(db, 'profiles');
      const profilesSnapshot = await getDocs(profilesRef);
      const usersData = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // For now, we'll use the basic profile data
      // In a real implementation, you might want to fetch related data separately
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="staff-panel">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading staff panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-panel">
      <div className="staff-container">
        <div className="staff-header">
          <h1>Staff Panel</h1>
          <p>Manage users and monitor their Instagram growth</p>
        </div>

        <div className="staff-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            Support
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="users-grid">
              {users.map((userData) => (
                <div 
                  key={userData.id} 
                  className="user-card"
                  onClick={() => setSelectedUser(userData)}
                >
                  <div className="user-avatar">
                    {userData.avatar_url ? (
                      <img src={userData.avatar_url} alt="User Avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        {userData.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  
                  <div className="user-info">
                    <h3>{userData.full_name || 'Unknown User'}</h3>
                    <p className="user-email">{userData.email}</p>
                    <div className="user-status">
                      <span 
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(userData.status) }}
                      ></span>
                      {userData.status || 'inactive'}
                    </div>
                  </div>

                  <div className="user-stats">
                    <div className="stat">
                      <span className="stat-label">Joined</span>
                      <span className="stat-value">{formatDate(userData.created_at)}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Instagram</span>
                      <span className="stat-value">
                        {userData.instagram_connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Total Users</h3>
                <div className="analytics-value">{users.length}</div>
                <div className="analytics-change positive">+12% this month</div>
              </div>
              
              <div className="analytics-card">
                <h3>Active Users</h3>
                <div className="analytics-value">
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div className="analytics-change positive">+8% this month</div>
              </div>
              
              <div className="analytics-card">
                <h3>Instagram Connected</h3>
                <div className="analytics-value">
                  {users.filter(u => u.instagram_connected).length}
                </div>
                <div className="analytics-change positive">+15% this month</div>
              </div>
              
              <div className="analytics-card">
                <h3>Avg Engagement</h3>
                <div className="analytics-value">4.2%</div>
                <div className="analytics-change positive">+0.3% this month</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="support-section">
            <div className="support-cards">
              <div className="support-card">
                <h3>Recent Support Requests</h3>
                <div className="support-list">
                  <div className="support-item">
                    <div className="support-info">
                      <h4>Account Connection Issue</h4>
                      <p>User: john@example.com</p>
                    </div>
                    <div className="support-status pending">Pending</div>
                  </div>
                  <div className="support-item">
                    <div className="support-info">
                      <h4>Growth Strategy Question</h4>
                      <p>User: sarah@example.com</p>
                    </div>
                    <div className="support-status resolved">Resolved</div>
                  </div>
                </div>
              </div>
              
              <div className="support-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-btn">View All Tickets</button>
                  <button className="action-btn">Send Announcement</button>
                  <button className="action-btn">Export User Data</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedUser && (
          <div className="user-modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedUser.full_name || 'User Details'}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="user-details">
                  <div className="detail-group">
                    <label>Email</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="detail-group">
                    <label>Status</label>
                    <span className={`status ${selectedUser.status || 'inactive'}`}>
                      {selectedUser.status || 'inactive'}
                    </span>
                  </div>
                  <div className="detail-group">
                    <label>Joined</label>
                    <span>{formatDate(selectedUser.created_at)}</span>
                  </div>
                  <div className="detail-group">
                    <label>Instagram Connected</label>
                    <span>
                      {selectedUser.instagram_connected ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                {selectedUser.user_requirements && selectedUser.user_requirements.length > 0 && (
                  <div className="requirements-section">
                    <h3>Requirements</h3>
                    <div className="requirements-details">
                      <div className="requirement-item">
                        <label>Business Type</label>
                        <span>{selectedUser.user_requirements[0].business_type}</span>
                      </div>
                      <div className="requirement-item">
                        <label>Posting Frequency</label>
                        <span>{selectedUser.user_requirements[0].posting_frequency}</span>
                      </div>
                      <div className="requirement-item">
                        <label>Budget Range</label>
                        <span>{selectedUser.user_requirements[0].budget_range}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPanel;
