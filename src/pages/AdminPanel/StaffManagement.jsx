import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminPanel.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          staff_assignments (
            user_id,
            profiles!staff_assignments_user_id_fkey (
              id,
              full_name
            )
          )
        `)
        .eq('role', 'staff')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStaff = async (staffId) => {
    if (!confirm('Are you sure you want to remove this staff member?')) {
      return;
    }

    try {
      // Remove staff assignments first
      await supabase
        .from('staff_assignments')
        .delete()
        .eq('staff_id', staffId);

      // Remove profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', staffId);

      // Note: In production, you might want to deactivate instead of delete
      // and handle the auth user separately

      await fetchStaff(); // Refresh data
      alert('Staff member removed successfully!');
    } catch (error) {
      console.error('Error removing staff:', error);
      alert('Error removing staff member: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading staff...</p>
      </div>
    );
  }

  return (
    <div className="staff-management">
      <h2>Staff Management</h2>
      
      <div className="staff-grid">
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="staff-card">
            <div className="staff-card-header">
              <div className="staff-avatar">
                {staffMember.full_name ? staffMember.full_name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="staff-info">
                <h3>{staffMember.full_name || 'Unnamed Staff'}</h3>
                <p className="staff-email">{staffMember.id}</p>
              </div>
              <div className="staff-actions">
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveStaff(staffMember.id)}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="staff-card-details">
              <div className="detail-item">
                <span className="label">Joined:</span>
                <span className="value">
                  {new Date(staffMember.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="label">Assigned Users:</span>
                <span className="value">
                  {staffMember.staff_assignments?.length || 0}
                </span>
              </div>
            </div>

            {staffMember.staff_assignments?.length > 0 && (
              <div className="assigned-users">
                <h4>Assigned Users:</h4>
                <div className="user-list">
                  {staffMember.staff_assignments.map((assignment) => (
                    <div key={assignment.user_id} className="assigned-user">
                      <span className="user-name">
                        {assignment.profiles?.full_name || 'Unnamed User'}
                      </span>
                      <span className="user-id">{assignment.user_id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="no-staff">
          <p>No staff members found.</p>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
