import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import './StaffPanel.css';

const StaffPanel = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useFirebaseAuth();

  useEffect(() => {
  fetchUsers();
  fetchAssignedOrders();
  // Fetch orders assigned to this staff
  const fetchAssignedOrders = async () => {
    setOrdersLoading(true);
    setOrderError(null);
    try {
      // Get all assignments for this staff
      const assignmentsSnap = await getDocs(query(collection(db, 'staff_assignments'), where('staff_id', '==', user.uid)));
      const userIds = assignmentsSnap.docs.map(doc => doc.data().user_id);
      if (userIds.length === 0) {
        setPendingOrders([]);
        setCompletedOrders([]);
        setOrdersLoading(false);
        return;
      }
      // Get all requirements for these users
      const requirementsSnap = await getDocs(collection(db, 'user_requirements'));
      const orders = requirementsSnap.docs
        .filter(doc => userIds.includes(doc.data().user_id))
        .map(doc => ({ id: doc.id, ...doc.data() }));
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
      await db.collection('user_requirements').doc(orderId).update({ order_completed: completed });
      fetchAssignedOrders();
    } catch (err) {
      alert('Failed to update order state.');
    }
  };
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
                    <button style={{ marginTop: 8 }} onClick={() => handleOrderStateChange(order.id, true)}>Mark as Completed</button>
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
