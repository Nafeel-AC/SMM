import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../../lib/role-auth-service';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [assignedUsers, setAssignedUsers] = useState([]);
  // Modals removed; we'll navigate to dedicated pages
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

  const handleViewUserDashboard = (user) => {
    const stableUserId = user.id || user.uid;
    navigate(`/staff-dashboard/user/${stableUserId}`, { state: { user } });
  };

  const handleEditUser = (user) => {
    const stableUserId = user.id || user.uid;
    navigate(`/staff-dashboard/edit-user/${stableUserId}`, { state: { user } });
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
                    onClick={() => handleEditUser(user)}
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals removed - navigation used instead */}
    </div>
  );
};

export default StaffDashboard;
