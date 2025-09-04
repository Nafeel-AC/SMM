import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { roleAuthService } from '../lib/role-auth-service';
import './StaffDashboard/StaffDashboard.css';

const StaffEditUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const initialUser = location.state?.user || null;

  const [editData, setEditData] = useState({
    display_name: initialUser?.display_name || '',
    business_type: initialUser?.business_type || '',
    posting_frequency: initialUser?.posting_frequency || '',
    budget_range: initialUser?.budget_range || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const result = await roleAuthService.updateUserProfile(userId, editData);
      if (result.success) {
        navigate(-1);
        alert('User updated successfully!');
      } else {
        alert('Error updating user: ' + result.error);
      }
    } catch (err) {
      alert('Error updating user: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
        <h1>Edit Profile</h1>
        <div className="staff-info">
          <button className="logout-btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="modal-form">
        <div className="form-group">
          <label>Display Name:</label>
          <input
            type="text"
            value={editData.display_name}
            onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Business Type:</label>
          <input
            type="text"
            value={editData.business_type}
            onChange={(e) => setEditData({ ...editData, business_type: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Posting Frequency:</label>
          <select
            value={editData.posting_frequency}
            onChange={(e) => setEditData({ ...editData, posting_frequency: e.target.value })}
          >
            <option value="">Select Frequency</option>
            <option value="Daily">Daily</option>
            <option value="3-4 times per week">3-4 times per week</option>
            <option value="2-3 times per week">2-3 times per week</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
        <div className="form-group">
          <label>Budget Range:</label>
          <select
            value={editData.budget_range}
            onChange={(e) => setEditData({ ...editData, budget_range: e.target.value })}
          >
            <option value="">Select Budget</option>
            <option value="$100-300/month">$100-300/month</option>
            <option value="$300-500/month">$300-500/month</option>
            <option value="$500-1000/month">$500-1000/month</option>
            <option value="$1000+/month">$1000+/month</option>
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={() => navigate(-1)} disabled={saving}>Cancel</button>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};

export default StaffEditUserPage;


