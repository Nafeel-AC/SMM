import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { roleAuthService } from '../lib/role-auth-service';
import { firebaseDb } from '../lib/firebase-db';
import './AdminDashboard/AdminDashboard.css';

const AdminAssignUsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { staffId } = useParams();
  const staff = location.state?.staff || null;

  const [users, setUsers] = React.useState([]);
  const [selected, setSelected] = React.useState(new Set());
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const allUsers = await firebaseDb.getAllUsers();
      const onlyUsers = (allUsers.data || []).filter(u => u.role === 'user' || !u.role);
      setUsers(onlyUsers);
      // preload assigned users
      const staffProfile = await firebaseDb.getProfile(staffId);
      const assigned = new Set(staffProfile.data?.assigned_users || []);
      setSelected(assigned);
    };
    load();
  }, [staffId]);

  const toggle = (userId) => {
    const next = new Set(selected);
    if (next.has(userId)) next.delete(userId); else next.add(userId);
    setSelected(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const ids = Array.from(selected);
      const result = await roleAuthService.assignUsersToStaff(staffId, ids);
      if (result.success) {
        navigate('/admin-dashboard');
        alert('Users assigned successfully!');
      } else {
        alert('Error assigning users: ' + result.error);
      }
    } catch (err) {
      alert('Error assigning users: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const staffName = useMemo(() => staff?.display_name || staff?.email || 'Staff', [staff]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Assign Users to {staffName}</h1>
        <button className="logout-btn" onClick={() => navigate(-1)}>Back</button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Select Users to Assign:</label>
          <div className="checkbox-list">
            {users.map((u) => (
              <label key={u.id || u.uid || u.email} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selected.has(u.id || u.uid)}
                  onChange={() => toggle(u.id || u.uid)}
                />
                {u.display_name || u.full_name || u.email}
              </label>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={() => navigate(-1)} disabled={submitting}>Cancel</button>
          <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Assign Users'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminAssignUsersPage;


