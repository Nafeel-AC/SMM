import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import UserManagement from './UserManagement';
import StaffManagement from './StaffManagement';
import SystemOverview from './SystemOverview';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStaff: 0,
    totalPayments: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchSystemStats();
    }
  }, [profile]);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);

      const [usersResult, staffResult, paymentsResult] = await Promise.all([
        supabase.from('profiles').select('id, role').eq('role', 'user'),
        supabase.from('profiles').select('id, role').eq('role', 'staff'),
        supabase.from('payments').select('id, status')
      ]);

      const totalUsers = usersResult.data?.length || 0;
      const totalStaff = staffResult.data?.length || 0;
      const totalPayments = paymentsResult.data?.length || 0;
      const activeUsers = paymentsResult.data?.filter(p => p.status === 'completed').length || 0;

      setStats({
        totalUsers,
        totalStaff,
        totalPayments,
        activeUsers
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'staff', label: 'Staff Management', icon: '👨‍💼' }
  ];

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Welcome, {profile?.full_name || user?.email}</p>
      </div>

      <div className="admin-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading admin data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <SystemOverview stats={stats} />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'staff' && <StaffManagement />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
