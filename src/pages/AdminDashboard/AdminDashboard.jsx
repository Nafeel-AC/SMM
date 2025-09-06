import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../../lib/role-auth-service';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    pendingTickets: 0,
    pendingKYC: 0,
    thisMonthTransactions: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });
  const [chartData, setChartData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('thisMonth');
  
  // Orders History filtering state
  const [orderFilter, setOrderFilter] = useState({
    status: 'all', // 'all', 'pending', 'completed', 'cancelled'
    category: 'all', // 'all', 'social_media', 'marketing', 'content'
    dateRange: 'all' // 'all', 'today', 'week', 'month'
  });
  const [filteredOrders, setFilteredOrders] = useState([]);
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

      // Calculate dashboard statistics
      const totalUsers = usersResult.success ? usersResult.users.length : 0;
      const totalStaff = staffResult.success ? staffResult.staff.length : 0;
      
      setDashboardStats(prev => ({
        ...prev,
        totalUsers: totalUsers,
        pendingTickets: Math.floor(Math.random() * 10) + 1, // Mock data
        pendingKYC: Math.floor(Math.random() * 8) + 1, // Mock data
        thisMonthTransactions: Math.floor(Math.random() * 20) + 5, // Mock data
        totalOrders: pendingOrders.length + completedOrders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        cancelledOrders: Math.floor(Math.random() * 5) + 1 // Mock data
      }));

      // Generate mock chart data for the last 30 days
      generateChartData();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock chart data for the selected timeframe
  const generateChartData = (timeframe = 'thisMonth') => {
    const data = [];
    const days = 30;
    
    for (let i = 1; i <= days; i++) {
      let value;
      
      if (timeframe === 'thisMonth') {
        // This month data with peaks
        value = Math.floor(Math.random() * 20) + 5;
        if (i === 17) value = Math.floor(Math.random() * 40) + 60; // Peak around day 17
        if (i === 24) value = Math.floor(Math.random() * 30) + 40; // Smaller peak around day 24
      } else {
        // Last month data with different pattern
        value = Math.floor(Math.random() * 15) + 8;
        if (i === 12) value = Math.floor(Math.random() * 35) + 45; // Peak around day 12
        if (i === 28) value = Math.floor(Math.random() * 25) + 35; // Peak around day 28
        // Generally lower values for last month
        value = Math.floor(value * 0.7);
      }
      
      data.push({
        day: `Day ${i.toString().padStart(2, '0')}`,
        value: value
      });
    }
    setChartData(data);
  };

  // Handle timeframe change
  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    generateChartData(timeframe);
  };

  // Fetch all user requirements and split by order_completed
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await dashboardDataService.db.getAllDocuments('user_requirements');
      if (result.error || !result.data) {
        setPendingOrders([]);
        setCompletedOrders([]);
        setAllOrders([]);
        setFilteredOrders([]);
        return;
      }
      
      // Add order status and category to each order
      const ordersWithStatus = result.data.map(order => ({
        ...order,
        order_status: order.order_completed ? 'completed' : 'pending',
        category: order.business_type || 'social_media',
        order_date: order.created_at ? (order.created_at.seconds ? new Date(order.created_at.seconds * 1000) : new Date(order.created_at)) : new Date()
      }));
      
      const pending = ordersWithStatus.filter(req => req.order_completed === false);
      const completed = ordersWithStatus.filter(req => req.order_completed === true);
      
      setPendingOrders(pending);
      setCompletedOrders(completed);
      setAllOrders(ordersWithStatus);
      
      // Apply current filters
      applyOrderFilters(ordersWithStatus);
      
      // Update dashboard stats with real order data
      setDashboardStats(prev => ({
        ...prev,
        totalOrders: ordersWithStatus.length,
        pendingOrders: pending.length,
        completedOrders: completed.length
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setPendingOrders([]);
      setCompletedOrders([]);
      setAllOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply order filters
  const applyOrderFilters = (orders = allOrders) => {
    let filtered = [...orders];

    // Filter by status
    if (orderFilter.status !== 'all') {
      filtered = filtered.filter(order => order.order_status === orderFilter.status);
    }

    // Filter by category
    if (orderFilter.category !== 'all') {
      filtered = filtered.filter(order => order.category === orderFilter.category);
    }

    // Filter by date range
    if (orderFilter.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.order_date);
        
        switch (orderFilter.dateRange) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilter = { ...orderFilter, [filterType]: value };
    setOrderFilter(newFilter);
    applyOrderFilters(allOrders);
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
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
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

      {activeTab === 'overview' && (
        <div className="overview-section">
          {/* Recent Transaction Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h2>Recent Transaction</h2>
              <div className="chart-controls">
                <div className="current-metric">
                  <span className="metric-label">DEPOSIT:</span>
                  <span className="metric-value">
                    {selectedTimeframe === 'thisMonth' ? '150.72 USD' : '98.45 USD'}
                  </span>
                </div>
                <div className="timeframe-tabs">
                  <button 
                    className={`timeframe-btn ${selectedTimeframe === 'thisMonth' ? 'active' : ''}`}
                    onClick={() => handleTimeframeChange('thisMonth')}
                  >
                    This Month
                  </button>
                  <button 
                    className={`timeframe-btn ${selectedTimeframe === 'lastMonth' ? 'active' : ''}`}
                    onClick={() => handleTimeframeChange('lastMonth')}
                  >
                    Last Month
                  </button>
                </div>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot blue"></div>
                <span>Deposit</span>
              </div>
            </div>
            <div className="chart-wrapper">
              <svg className="transaction-chart" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <g className="chart-grid">
                  {[0, 25, 50, 75, 100].map((y, i) => (
                    <line key={i} x1="50" y1={40 + (y * 1.2)} x2="750" y2={40 + (y * 1.2)} stroke="#e5e7eb" strokeWidth="1"/>
                  ))}
                </g>
                <g className="chart-line">
                  <path
                    d={`M 50,${200 - (chartData[0]?.value || 0) * 1.2} ${chartData.map((point, i) => 
                      `L ${50 + (i * 23.3)},${200 - (point.value * 1.2)}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <path
                    d={`M 50,${200 - (chartData[0]?.value || 0) * 1.2} ${chartData.map((point, i) => 
                      `L ${50 + (i * 23.3)},${200 - (point.value * 1.2)}`
                    ).join(' ')} L 750,200 L 50,200 Z`}
                    fill="url(#lineGradient)"
                  />
                </g>
                <g className="chart-points">
                  {chartData.map((point, i) => (
                    <circle
                      key={i}
                      cx={50 + (i * 23.3)}
                      cy={200 - (point.value * 1.2)}
                      r="3"
                      fill="#3b82f6"
                    />
                  ))}
                </g>
                <g className="chart-labels">
                  {chartData.filter((_, i) => i % 5 === 0).map((point, i) => (
                    <text
                      key={i}
                      x={50 + (i * 5 * 23.3)}
                      y="220"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                    >
                      {point.day}
                    </text>
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>Total Users</h3>
                <div className="metric-value">{dashboardStats.totalUsers}</div>
                <div className="metric-change">0% from {dashboardStats.totalUsers}</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>Pending Tickets</h3>
                <div className="metric-value">{dashboardStats.pendingTickets}</div>
                <div className="metric-change">0% from 18</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12H15M9 16H15M9 8H15" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>Pending KYC</h3>
                <div className="metric-value">{dashboardStats.pendingKYC}</div>
                <div className="metric-change">0% from 13</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>This Month Transactions</h3>
                <div className="metric-value">{dashboardStats.thisMonthTransactions}</div>
                <div className="metric-change">0% from 5</div>
                <div className="mini-chart">
                  <svg width="60" height="20" viewBox="0 0 60 20">
                    <path d="M0,15 L15,10 L30,12 L45,8 L60,5" stroke="#ef4444" strokeWidth="1.5" fill="none"/>
                    <path d="M0,15 L15,10 L30,12 L45,8 L60,5 L60,20 L0,20 Z" fill="#ef4444" fillOpacity="0.1"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V19C17 19.6 16.6 20 16 20H8C7.4 20 7 19.6 7 19V13M17 13H7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>Total Orders</h3>
                <div className="metric-value">{dashboardStats.totalOrders}</div>
                <div className="metric-change">0% from {dashboardStats.totalOrders - 1}</div>
                <div className="mini-chart">
                  <svg width="60" height="20" viewBox="0 0 60 20">
                    <path d="M0,15 L15,10 L30,12 L45,8 L60,5" stroke="#ef4444" strokeWidth="1.5" fill="none"/>
                    <path d="M0,15 L15,10 L30,12 L45,8 L60,5 L60,20 L0,20 Z" fill="#ef4444" fillOpacity="0.1"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>Pending Orders</h3>
                <div className="metric-value">{dashboardStats.pendingOrders}</div>
                <div className="metric-change">0% from {dashboardStats.totalOrders}</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>Completed Orders</h3>
                <div className="metric-value">{dashboardStats.completedOrders}</div>
                <div className="metric-change">0% from {dashboardStats.totalOrders}</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="metric-content">
                <h3>Cancel Orders</h3>
                <div className="metric-value">{dashboardStats.cancelledOrders}</div>
                <div className="metric-change">0% from {dashboardStats.totalOrders}</div>
              </div>
            </div>
          </div>

          {/* Orders History Section */}
          <div className="orders-history-section">
            <div className="orders-history-header">
              <h2>Orders History</h2>
              <div className="orders-filters">
                <select 
                  className="category-filter"
                  value={orderFilter.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Category</option>
                  <option value="social_media">Social Media</option>
                  <option value="marketing">Marketing</option>
                  <option value="content">Content</option>
                </select>
                <select 
                  className="date-range-picker"
                  value={orderFilter.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
            <div className="order-status-labels">
              <button 
                className={`status-label ${orderFilter.status === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'all')}
              >
                ALL ORDERS ({allOrders.length})
              </button>
              <button 
                className={`status-label pending ${orderFilter.status === 'pending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'pending')}
              >
                PENDING ({pendingOrders.length})
              </button>
              <button 
                className={`status-label completed ${orderFilter.status === 'completed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'completed')}
              >
                COMPLETED ({completedOrders.length})
              </button>
            </div>
            
            {/* Orders List */}
            <div className="orders-list">
              {filteredOrders.length === 0 ? (
                <div className="no-orders">
                  <p>No orders found matching the current filters.</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-header">
                        <div className="order-id">Order #{order.id.slice(-8)}</div>
                        <div className={`order-status-badge ${order.order_status}`}>
                          {order.order_status.toUpperCase()}
                        </div>
                      </div>
                      <div className="order-details">
                        <div className="order-info">
                          <div className="info-row">
                            <span className="label">User ID:</span>
                            <span className="value">{order.user_id}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Business Type:</span>
                            <span className="value">{order.business_type || 'N/A'}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Category:</span>
                            <span className="value">{order.category.replace('_', ' ').toUpperCase()}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Created:</span>
                            <span className="value">
                              {order.order_date ? order.order_date.toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          {order.niche && (
                            <div className="info-row">
                              <span className="label">Niche:</span>
                              <span className="value">{order.niche}</span>
                            </div>
                          )}
                        </div>
                        <div className="order-actions">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => navigate(`/admin-dashboard/user/${order.user_id}`)}
                          >
                            View User
                          </button>
                          {order.order_status === 'pending' && (
                            <button 
                              className="action-btn complete-btn"
                              onClick={async () => {
                                try {
                                  await dashboardDataService.db.updateDocument('user_requirements', order.id, { order_completed: true });
                                  fetchOrders(); // Refresh orders
                                } catch (error) {
                                  alert('Failed to mark order as completed');
                                }
                              }}
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
