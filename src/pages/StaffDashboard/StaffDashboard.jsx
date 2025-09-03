import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../../lib/role-auth-service';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDashboardData, setUserDashboardData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  const fetchAssignedUsers = async () => {
    try {
      setLoading(true);
      // Get current staff user ID from auth context
      const currentStaffId = user?.uid;
      
      if (!currentStaffId) {
        console.error('No user ID available');
        setLoading(false);
        return;
      }
      
      const result = await roleAuthService.getAssignedUsers(currentStaffId);
      
      if (result.success) {
        setAssignedUsers(result.users);
      } else {
        console.error('Error fetching assigned users:', result.error);
      }
    } catch (error) {
      console.error('Error fetching assigned users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDashboard = async (user) => {
    try {
      setLoading(true);
      const result = await dashboardDataService.getDashboardData(user.uid);
      if (result.success) {
        setUserDashboardData(result.data);
        setSelectedUser(user);
      }
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditData({
      display_name: user.display_name || '',
      business_type: user.business_type || '',
      posting_frequency: user.posting_frequency || '',
      budget_range: user.budget_range || ''
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const result = await roleAuthService.updateUserProfile(selectedUser.uid, editData);
      
      if (result.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        setEditData({});
        fetchAssignedUsers(); // Refresh data
        alert('User updated successfully!');
      } else {
        alert('Error updating user: ' + result.error);
      }
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading staff dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
        <h1>Staff Dashboard</h1>
        <div className="staff-info">
          <p>Assigned Users: {assignedUsers.length}</p>
          <button 
            className="logout-btn"
            onClick={() => {
              roleAuthService.logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="assigned-users-section">
        <div className="section-header">
          <h2>Your Assigned Users</h2>
          <p>Manage and view the users assigned to you</p>
        </div>
        
        {assignedUsers.length === 0 ? (
          <div className="no-users">
            <div className="no-users-icon">👥</div>
            <h3>No Users Assigned</h3>
            <p>You don't have any users assigned to you yet. Contact your admin to get users assigned.</p>
          </div>
        ) : (
          <div className="users-grid">
            {assignedUsers.map((user) => (
              <div key={user.uid} className="user-card">
                <div className="user-info">
                  <h3>{user.display_name || user.email}</h3>
                  <p>{user.email}</p>
                  <p className="user-role">Role: {user.role || 'User'}</p>
                  <p className="user-created">
                    Created: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  {user.business_type && (
                    <p className="user-business">Business: {user.business_type}</p>
                  )}
                </div>
                <div className="user-actions">
                  <button 
                    className="view-btn"
                    onClick={() => handleViewUserDashboard(user)}
                  >
                    View Dashboard
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Dashboard Modal */}
      {selectedUser && userDashboardData && (
        <div className="modal-overlay large">
          <div className="modal large">
            <div className="modal-header">
              <h3>{selectedUser.display_name || selectedUser.email} - Dashboard</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setSelectedUser(null);
                  setUserDashboardData(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="user-dashboard-content">
              <div className="dashboard-metrics">
                <div className="metric">
                  <h4>Followers</h4>
                  <p>{userDashboardData.insights.followers_count}</p>
                </div>
                <div className="metric">
                  <h4>Following</h4>
                  <p>{userDashboardData.insights.following_count}</p>
                </div>
                <div className="metric">
                  <h4>Engagement Rate</h4>
                  <p>{userDashboardData.insights.engagement_rate}%</p>
                </div>
                <div className="metric">
                  <h4>Posts</h4>
                  <p>{userDashboardData.insights.media_count}</p>
                </div>
              </div>
              
              <div className="dashboard-details">
                <div className="detail-section">
                  <h4>Business Type</h4>
                  <p>{userDashboardData.requirements.business_type}</p>
                </div>
                <div className="detail-section">
                  <h4>Posting Frequency</h4>
                  <p>{userDashboardData.requirements.posting_frequency}</p>
                </div>
                <div className="detail-section">
                  <h4>Budget Range</h4>
                  <p>{userDashboardData.requirements.budget_range}</p>
                </div>
                <div className="detail-section">
                  <h4>Target Locations</h4>
                  <p>{userDashboardData.strategy.target_locations.join(', ')}</p>
                </div>
                <div className="detail-section">
                  <h4>Selected Hashtags</h4>
                  <p>{userDashboardData.hashtags.selected.map(h => h.hashtag).join(', ')}</p>
                </div>
                <div className="detail-section">
                  <h4>Target Accounts</h4>
                  <p>{userDashboardData.accounts.selected.map(a => a.account).join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit User Profile</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setEditData({});
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="modal-form">
              <div className="form-group">
                <label>Display Name:</label>
                <input
                  type="text"
                  value={editData.display_name}
                  onChange={(e) => setEditData({...editData, display_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Business Type:</label>
                <input
                  type="text"
                  value={editData.business_type}
                  onChange={(e) => setEditData({...editData, business_type: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Posting Frequency:</label>
                <select
                  value={editData.posting_frequency}
                  onChange={(e) => setEditData({...editData, posting_frequency: e.target.value})}
                >
                  <option value="">Select Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="3-4 times per week">3-4 times per week</option>
                  <option value="2-3 times per week">2-3 times per week</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget Range:</label>
                <select
                  value={editData.budget_range}
                  onChange={(e) => setEditData({...editData, budget_range: e.target.value})}
                >
                  <option value="">Select Budget</option>
                  <option value="$100-300/month">$100-300/month</option>
                  <option value="$300-500/month">$300-500/month</option>
                  <option value="$500-1000/month">$500-1000/month</option>
                  <option value="$1000+/month">$1000+/month</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
