import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminPanel.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    email: '',
    password: '',
    full_name: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_requirements (*),
          payments (*),
          instagram_accounts (*),
          staff_assignments (*)
        `)
        .eq('role', 'user')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async () => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newStaffData.email,
        password: newStaffData.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: newStaffData.full_name,
            role: 'staff'
          }
        ]);

      if (profileError) throw profileError;

      setShowCreateStaff(false);
      setNewStaffData({ email: '', password: '', full_name: '' });
      alert('Staff member created successfully!');
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Error creating staff member: ' + error.message);
    }
  };

  const handleAssignStaff = async (userId, staffId) => {
    try {
      const { error } = await supabase
        .from('staff_assignments')
        .insert([
          {
            user_id: userId,
            staff_id: staffId
          }
        ]);

      if (error) throw error;
      await fetchUsers(); // Refresh data
      alert('User assigned to staff successfully!');
    } catch (error) {
      console.error('Error assigning staff:', error);
      alert('Error assigning staff: ' + error.message);
    }
  };

  const getStatusColor = (user) => {
    if (user.payments?.length > 0 && user.payments[0].status === 'completed') {
      return 'green';
    }
    return 'red';
  };

  const getStatusText = (user) => {
    if (user.payments?.length > 0 && user.payments[0].status === 'completed') {
      return 'Active';
    }
    return 'New User';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <button 
          className="create-staff-btn"
          onClick={() => setShowCreateStaff(true)}
        >
          Create Staff Member
        </button>
      </div>

      {showCreateStaff && (
        <div className="create-staff-modal">
          <div className="modal-content">
            <h3>Create New Staff Member</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={newStaffData.full_name}
                onChange={(e) => setNewStaffData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Staff member's full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newStaffData.email}
                onChange={(e) => setNewStaffData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="staff@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={newStaffData.password}
                onChange={(e) => setNewStaffData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Temporary password"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowCreateStaff(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={handleCreateStaff}>
                Create Staff
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className={`user-card ${getStatusColor(user)}`}>
            <div className="user-card-header">
              <div className="user-avatar">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <h3>{user.full_name || 'Unnamed User'}</h3>
                <p className="user-email">{user.id}</p>
              </div>
              <div className={`status-badge ${getStatusColor(user)}`}>
                {getStatusText(user)}
              </div>
            </div>

            <div className="user-card-details">
              <div className="detail-item">
                <span className="label">Joined:</span>
                <span className="value">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="label">Requirements:</span>
                <span className="value">
                  {user.user_requirements?.length > 0 ? 'Completed' : 'Pending'}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Instagram:</span>
                <span className="value">
                  {user.instagram_accounts?.length > 0 ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Payment:</span>
                <span className="value">
                  {user.payments?.length > 0 ? user.payments[0].status : 'No Payment'}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Assigned Staff:</span>
                <span className="value">
                  {user.staff_assignments?.length > 0 ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="user-card-actions">
              <button 
                className="assign-staff-btn"
                onClick={() => setSelectedUser(user)}
              >
                Assign Staff
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="assign-staff-modal">
          <div className="modal-content">
            <h3>Assign Staff to {selectedUser.full_name || 'User'}</h3>
            <p>Select a staff member to assign to this user:</p>
            <StaffSelector 
              onAssign={(staffId) => {
                handleAssignStaff(selectedUser.id, staffId);
                setSelectedUser(null);
              }}
              onCancel={() => setSelectedUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const StaffSelector = ({ onAssign, onCancel }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading staff...</div>;
  }

  return (
    <div className="staff-selector">
      {staff.map((staffMember) => (
        <div key={staffMember.id} className="staff-option">
          <div className="staff-info">
            <h4>{staffMember.full_name || 'Unnamed Staff'}</h4>
            <p>{staffMember.id}</p>
          </div>
          <button 
            className="assign-btn"
            onClick={() => onAssign(staffMember.id)}
          >
            Assign
          </button>
        </div>
      ))}
      <div className="modal-actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
