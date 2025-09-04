import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../lib/role-auth-service';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import './AdminDashboard/AdminDashboard.css';

const AdminCreateStaffPage = () => {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await roleAuthService.createStaff(
        form.email,
        form.password,
        {
          displayName: form.displayName,
          createdBy: user?.uid || 'admin'
        }
      );
      if (result.success) {
        navigate('/admin-dashboard');
        alert('Staff created successfully!');
      } else {
        alert('Error creating staff: ' + result.error);
      }
    } catch (error) {
      alert('Error creating staff: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Create Staff</h1>
        <button className="logout-btn" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="section-header">
        <h2>New Staff Member</h2>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="staff-email">Email:</label>
          <input
            id="staff-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="staff-password">Password:</label>
          <input
            id="staff-password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="staff-display-name">Display Name:</label>
          <input
            id="staff-display-name"
            type="text"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            required
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={() => navigate(-1)} disabled={submitting}>Cancel</button>
          <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Staff'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateStaffPage;


