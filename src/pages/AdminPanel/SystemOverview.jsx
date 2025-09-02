import React from 'react';
import './AdminPanel.css';

const SystemOverview = ({ stats }) => {
  return (
    <div className="system-overview">
      <h2>System Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <p className="stat-label">Registered users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-content">
            <h3>Staff Members</h3>
            <p className="stat-number">{stats.totalStaff}</p>
            <p className="stat-label">Active staff</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Payments</h3>
            <p className="stat-number">{stats.totalPayments}</p>
            <p className="stat-label">All transactions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers}</p>
            <p className="stat-label">Paid subscribers</p>
          </div>
        </div>
      </div>

      <div className="overview-sections">
        <div className="overview-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-content">
                <p><strong>New user registered</strong></p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💳</span>
              <div className="activity-content">
                <p><strong>Payment completed</strong></p>
                <p className="activity-time">4 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📱</span>
              <div className="activity-content">
                <p><strong>Instagram account connected</strong></p>
                <p className="activity-time">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-section">
          <h3>System Health</h3>
          <div className="health-metrics">
            <div className="health-item">
              <span className="health-label">Database</span>
              <span className="health-status good">Healthy</span>
            </div>
            <div className="health-item">
              <span className="health-label">Instagram API</span>
              <span className="health-status good">Connected</span>
            </div>
            <div className="health-item">
              <span className="health-label">Payment System</span>
              <span className="health-status good">Active</span>
            </div>
            <div className="health-item">
              <span className="health-label">Email Service</span>
              <span className="health-status good">Running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
