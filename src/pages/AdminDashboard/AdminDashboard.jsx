import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../../lib/role-auth-service';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [showAssignUsers, setShowAssignUsers] = useState(false);
  const [newStaff, setNewStaff] = useState({ email: '', password: '', displayName: '' });
  const [userDashboardData, setUserDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users and staff in parallel
      const [usersResult, staffResult] = await Promise.all([
        roleAuthService.getAllUsers(),
        roleAuthService.getAllStaff()
      ]);

      if (usersResult.success) {
        setUsers(usersResult.users);
      }

      if (staffResult.success) {
        setStaff(staffResult.staff);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const result = await roleAuthService.createStaff(
        newStaff.email,
        newStaff.password,
        {
          displayName: newStaff.displayName,
          createdBy: 'admin' // In real app, get from current user
        }
      );

      if (result.success) {
        setShowCreateStaff(false);
        setNewStaff({ email: '', password: '', displayName: '' });
        fetchData(); // Refresh staff list
        alert('Staff created successfully!');
      } else {
        alert('Error creating staff: ' + result.error);
      }
    } catch (error) {
      alert('Error creating staff: ' + error.message);
    }
  };

  const handleAssignUsers = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const userIds = formData.getAll('userIds');
      
      const result = await roleAuthService.assignUsersToStaff(selectedStaff.uid, userIds);
      
      if (result.success) {
        setShowAssignUsers(false);
        setSelectedStaff(null);
        alert('Users assigned successfully!');
      } else {
        alert('Error assigning users: ' + result.error);
      }
    } catch (error) {
      alert('Error assigning users: ' + error.message);
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

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await roleAuthService.deleteUser(userId);
        if (result.success) {
          fetchData(); // Refresh data
          alert('User deleted successfully!');
        } else {
          alert('Error deleting user: ' + result.error);
        }
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const result = await roleAuthService.deleteStaff(staffId);
        if (result.success) {
          fetchData(); // Refresh data
          alert('Staff deleted successfully!');
        } else {
          alert('Error deleting staff: ' + result.error);
        }
      } catch (error) {
        alert('Error deleting staff: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
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

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff ({staff.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="users-section">
          <div className="section-header">
            <h2>User Management</h2>
          </div>
          
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.uid} className="user-card">
                <div className="user-info">
                  <h3>{user.display_name || user.email}</h3>
                  <p>{user.email}</p>
                  <p className="user-role">Role: {user.role || 'User'}</p>
                  <p className="user-created">
                    Created: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="user-actions">
                  <button 
                    className="view-btn"
                    onClick={() => handleViewUserDashboard(user)}
                  >
                    View Dashboard
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user.uid)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="staff-section">
          <div className="section-header">
            <h2>Staff Management</h2>
            <button 
              className="create-staff-btn"
              onClick={() => setShowCreateStaff(true)}
            >
              Create Staff
            </button>
          </div>
          
          <div className="staff-grid">
            {staff.map((staffMember) => (
              <div key={staffMember.uid} className="staff-card">
                <div className="staff-info">
                  <h3>{staffMember.display_name || staffMember.email}</h3>
                  <p>{staffMember.email}</p>
                  <p className="staff-assigned">
                    Assigned Users: {staffMember.assigned_users?.length || 0}
                  </p>
                  <p className="staff-created">
                    Created: {new Date(staffMember.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="staff-actions">
                  <button 
                    className="assign-btn"
                    onClick={() => {
                      setSelectedStaff(staffMember);
                      setShowAssignUsers(true);
                    }}
                  >
                    Assign Users
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteStaff(staffMember.uid)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Staff Modal */}
      {showCreateStaff && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Staff</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateStaff(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="modal-form">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Display Name:</label>
                <input
                  type="text"
                  value={newStaff.displayName}
                  onChange={(e) => setNewStaff({...newStaff, displayName: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateStaff(false)}>
                  Cancel
                </button>
                <button type="submit">Create Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Users Modal */}
      {showAssignUsers && selectedStaff && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Users to {selectedStaff.display_name}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAssignUsers(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAssignUsers} className="modal-form">
              <div className="form-group">
                <label>Select Users to Assign:</label>
                <div className="checkbox-list">
                  {users.map((user) => (
                    <label key={user.uid} className="checkbox-item">
                      <input
                        type="checkbox"
                        name="userIds"
                        value={user.uid}
                        defaultChecked={selectedStaff.assigned_users?.includes(user.uid)}
                      />
                      {user.display_name || user.email}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAssignUsers(false)}>
                  Cancel
                </button>
                <button type="submit">Assign Users</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <h4>Target Locations</h4>
                  <p>{userDashboardData.strategy.target_locations.join(', ')}</p>
                </div>
                <div className="detail-section">
                  <h4>Selected Hashtags</h4>
                  <p>{userDashboardData.hashtags.selected.map(h => h.hashtag).join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
