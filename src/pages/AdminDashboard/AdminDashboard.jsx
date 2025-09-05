import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../../lib/role-auth-service';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  // Removed selectedUser modal usage in favor of dedicated page navigation
  // Assign users handled on a dedicated page now
  // Removed local form state for create staff
  // Removed inline user dashboard modal state
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();

  useEffect(() => {
  fetchData();
  fetchOrders();
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

  // Fetch all user requirements and split by order_completed
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await dashboardDataService.db.getAllDocuments('user_requirements');
      if (result.error || !result.data) {
        setPendingOrders([]);
        setCompletedOrders([]);
        return;
      }
      const pending = result.data.filter(req => req.order_completed === false);
      const completed = result.data.filter(req => req.order_completed === true);
      setPendingOrders(pending);
      setCompletedOrders(completed);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setPendingOrders([]);
      setCompletedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Create staff handled on separate page now

  // Assign users handled on dedicated page

  const handleViewUserDashboard = (user) => {
    try {
      const stableUserId = user.id || user.uid;
      navigate(`/admin-dashboard/user/${stableUserId}`, { state: { user } });
    } catch (err) {
      console.error('[AdminDashboard] Navigate failed:', err);
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
        <button
          className={`tab-btn ${activeTab === 'pendingOrders' ? 'active' : ''}`}
          onClick={() => setActiveTab('pendingOrders')}
        >
          Pending Orders ({pendingOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'completedOrders' ? 'active' : ''}`}
          onClick={() => setActiveTab('completedOrders')}
        >
          Completed Orders ({completedOrders.length})
        </button>
      </div>

  {activeTab === 'users' && (
        <div className="users-section">
          <div className="section-header">
            <h2>User Management</h2>
          </div>
          
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id || user.uid || user.email} className="user-card">
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
                    type="button"
                    className="view-btn"
                    onClick={() => handleViewUserDashboard(user)}
                  >
                    View Dashboard
                  </button>
                  <button 
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user.id || user.uid)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  )}

  {activeTab === 'pendingOrders' && (
    <div className="orders-section">
      <div className="section-header">
        <h2>Pending Orders</h2>
      </div>
      <div className="orders-grid">
        {pendingOrders.length === 0 && <p>No pending orders.</p>}
        {pendingOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-info">
              <h3>User ID: {order.user_id}</h3>
              <p>Business Type: {order.business_type}</p>
              <p>Created: {order.created_at && order.created_at.seconds ? new Date(order.created_at.seconds * 1000).toLocaleString() : ''}</p>
              {/* Add more fields as needed */}
            </div>
            <div className="order-actions" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button
                className="view-btn"
                onClick={() => navigate(`/admin-dashboard/user/${order.user_id}`)}
              >
                View Dashboard
              </button>
              <button
                className="assign-btn"
                onClick={() => navigate(`/admin-dashboard/assign-users`, { state: { userId: order.user_id } })}
              >
                Assign to Staff
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {activeTab === 'completedOrders' && (
    <div className="orders-section">
      <div className="section-header">
        <h2>Completed Orders</h2>
      </div>
      <div className="orders-grid">
        {completedOrders.length === 0 && <p>No completed orders.</p>}
        {completedOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-info">
              <h3>User ID: {order.user_id}</h3>
              <p>Business Type: {order.business_type}</p>
              <p>Created: {order.created_at && order.created_at.seconds ? new Date(order.created_at.seconds * 1000).toLocaleString() : ''}</p>
              {/* Add more fields as needed */}
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
          type="button"
          className="create-staff-btn"
          onClick={() => navigate('/admin-dashboard/create-staff')}
        >
          Create Staff
        </button>
      </div>
      <div className="staff-grid">
        {staff.map((staffMember) => (
          <div key={staffMember.id || staffMember.uid || staffMember.email} className="staff-card">
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
                type="button"
                className="assign-btn"
                onClick={() => {
                  const staffId = staffMember.id || staffMember.uid;
                  navigate(`/admin-dashboard/assign-users/${staffId}`, { state: { staff: staffMember } });
                }}
              >
                Assign Users
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteStaff(staffMember.id || staffMember.uid)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

      {/* Create Staff Modal removed - using dedicated page */}

      {/* Assign Users Modal removed - navigates to dedicated page now */}

      {/* User Dashboard Modal removed - navigates to dedicated page now */}
    </div>
  );
};

export default AdminDashboard;
