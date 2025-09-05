import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dashboardDataService } from '../../lib/dashboard-data-service';

const AssignUsers = () => {
  const [assignedStaff, setAssignedStaff] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffAndAssignment = async () => {
      try {
        // Get all staff
        const staffResult = await dashboardDataService.getAllStaff();
        if (staffResult.error) throw staffResult.error;
        setStaffList(staffResult.data);
        setFilteredStaff(staffResult.data);

        // Check if user is already assigned
        const assignmentsResult = await dashboardDataService.db.getDocumentsByField('staff_assignments', 'user_id', userId);
        if (assignmentsResult.data && assignmentsResult.data.length > 0) {
          // Get staff info for the assigned staff
          const staffId = assignmentsResult.data[0].staff_id;
          const staffInfo = staffResult.data.find(s => (s.id || s.uid) === staffId);
          setAssignedStaff(staffInfo || { id: staffId });
        } else {
          setAssignedStaff(null);
        }
      } catch (err) {
        setError('Failed to load staff list.');
      }
    };
    fetchStaffAndAssignment();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredStaff(staffList);
    } else {
      setFilteredStaff(
        staffList.filter(staff =>
          (staff.display_name || staff.email || '').toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, staffList]);

  const handleAssign = async (staffId) => {
    setAssigning(true);
    setError(null);
    try {
      await dashboardDataService.db.createStaffAssignment({ staff_id: staffId, user_id: userId, assigned_at: new Date().toISOString() });
      alert('User assigned to staff successfully!');
      navigate(-1);
    } catch (err) {
      setError('Failed to assign user to staff.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="assign-users-page" style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>Assign User to Staff</h2>
      {assignedStaff ? (
        <div style={{ margin: '32px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#22c55e', marginBottom: 8 }}>Task Assigned</div>
          <div style={{ fontSize: 16, marginBottom: 4 }}>
            Assigned Staff: <strong>{assignedStaff.display_name || assignedStaff.email || assignedStaff.id}</strong>
          </div>
          {assignedStaff.email && <div style={{ color: '#6b7280', fontSize: 14 }}>{assignedStaff.email}</div>}
          <button onClick={() => navigate(-1)} style={{ marginTop: 24, background: '#e5e7eb', color: '#111', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>Back</button>
        </div>
      ) : (
        <>
          <div style={{ margin: '16px 0' }}>
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <div style={{ maxHeight: 350, overflowY: 'auto' }}>
            {filteredStaff.length === 0 ? (
              <p>No staff found.</p>
            ) : (
              filteredStaff.map(staff => (
                <div key={staff.id || staff.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <strong>{staff.display_name || staff.email}</strong>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{staff.email}</div>
                  </div>
                  <button
                    disabled={assigning}
                    style={{ padding: '8px 16px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleAssign(staff.id || staff.uid)}
                  >
                    Assign
                  </button>
                </div>
              ))
            )}
          </div>
          <button onClick={() => navigate(-1)} style={{ marginTop: 24, background: '#e5e7eb', color: '#111', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default AssignUsers;
