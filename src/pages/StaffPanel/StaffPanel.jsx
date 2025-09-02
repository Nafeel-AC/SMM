import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import UserList from './UserList';
import UserDashboard from './UserDashboard';
import './StaffPanel.css';

const StaffPanel = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, profile } = useAuth();

  useEffect(() => {
    if (profile?.role === 'staff') {
      fetchAssignedUsers();
    }
  }, [profile]);

  const fetchAssignedUsers = async () => {
    try {
      setLoading(true);
      
      // Get users assigned to this staff member
      const { data: assignments, error: assignmentError } = await supabase
        .from('staff_assignments')
        .select(`
          user_id,
          profiles!staff_assignments_user_id_fkey (
            id,
            full_name,
            created_at
          )
        `)
        .eq('staff_id', user.id);

      if (assignmentError) throw assignmentError;

      // Get additional user data
      const userIds = assignments.map(a => a.user_id);
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          created_at,
          user_requirements (*),
          payments (*),
          instagram_accounts (*)
        `)
        .in('id', userIds);

      if (userError) throw userError;

      setUsers(userData || []);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching assigned users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  if (profile?.role !== 'staff') {
    return (
      <div className="staff-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the staff panel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="staff-panel">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading assigned users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-panel">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchAssignedUsers}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-panel">
      <div className="staff-header">
        <h1>Staff Panel</h1>
        <p>Welcome, {profile?.full_name || user?.email}</p>
      </div>

      {selectedUser ? (
        <UserDashboard 
          user={selectedUser} 
          onBack={handleBackToList}
          staffId={user.id}
        />
      ) : (
        <UserList 
          users={users} 
          onUserSelect={handleUserSelect}
        />
      )}
    </div>
  );
};

export default StaffPanel;
