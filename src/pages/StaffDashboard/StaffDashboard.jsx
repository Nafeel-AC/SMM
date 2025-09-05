import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../../lib/role-auth-service';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [assignedUsers, setAssignedUsers] = useState([]);
  // Modals removed; we'll navigate to dedicated pages
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();

  // Fetch orders assigned to this staff
  const fetchAssignedOrders = async () => {
    setOrdersLoading(true);
    setOrderError(null);
    try {
      // Get all assignments for this staff
      const assignmentsSnap = await dashboardDataService.db.getDocumentsByField('staff_assignments', 'staff_id', user.uid);
      const userIds = assignmentsSnap.data ? assignmentsSnap.data.map(a => a.user_id) : [];
      if (userIds.length === 0) {
        setPendingOrders([]);
        setCompletedOrders([]);
        setOrdersLoading(false);
        return;
      }
      // Get all requirements for these users
      const requirementsSnap = await dashboardDataService.db.getAllDocuments('user_requirements');
      const orders = requirementsSnap.data
        .filter(o => userIds.includes(o.user_id))
        .map(o => ({ id: o.id, ...o }));
      setPendingOrders(orders.filter(o => o.order_completed === false));
      setCompletedOrders(orders.filter(o => o.order_completed === true));
    } catch (err) {
      setOrderError('Failed to load assigned orders.');
      setPendingOrders([]);
      setCompletedOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Update order state
  const handleOrderStateChange = async (orderId, completed) => {
    try {
      const result = await dashboardDataService.db.updateDocument('user_requirements', orderId, { order_completed: completed });
      if (result.error) {
        console.error('Firestore update error:', result.error);
        alert('Failed to update order state: ' + (result.error.message || result.error));
      } else {
        fetchAssignedOrders();
      }
    } catch (err) {
      console.error('Unexpected error updating order:', err);
      alert('Failed to update order state: ' + (err.message || err));
    }
  };

  useEffect(() => {
    fetchAssignedUsers();
    fetchAssignedOrders();
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

      <div className="staff-tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({assignedUsers.length})
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
      )}

      {activeTab === 'pendingOrders' && (
        <div className="orders-section">
          <h2>Pending Orders</h2>
          {ordersLoading ? <p>Loading...</p> : orderError ? <p style={{ color: 'red' }}>{orderError}</p> : (
            <div className="orders-grid">
              {pendingOrders.length === 0 ? <p>No pending orders.</p> : pendingOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div><strong>User ID:</strong> {order.user_id}</div>
                  <div><strong>Business Type:</strong> {order.business_type}</div>
                  <div><strong>Created:</strong> {order.created_at && order.created_at.seconds ? new Date(order.created_at.seconds * 1000).toLocaleString() : ''}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: 8 }}>
                    <button onClick={() => handleOrderStateChange(order.id, true)}>Mark as Completed</button>
                    <button onClick={() => navigate(`/staff-dashboard/edit-user/${order.user_id}`)}>View Dashboard</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'completedOrders' && (
        <div className="orders-section">
          <h2>Completed Orders</h2>
          {ordersLoading ? <p>Loading...</p> : orderError ? <p style={{ color: 'red' }}>{orderError}</p> : (
            <div className="orders-grid">
              {completedOrders.length === 0 ? <p>No completed orders.</p> : completedOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div><strong>User ID:</strong> {order.user_id}</div>
                  <div><strong>Business Type:</strong> {order.business_type}</div>
                  <div><strong>Created:</strong> {order.created_at && order.created_at.seconds ? new Date(order.created_at.seconds * 1000).toLocaleString() : ''}</div>
                  <button style={{ marginTop: 8 }} onClick={() => handleOrderStateChange(order.id, false)}>Mark as Pending</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
