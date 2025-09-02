import React from 'react';
import './StaffPanel.css';

const UserList = ({ users, onUserSelect }) => {
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

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Assigned Users</h2>
        <p>Click on a user to view their dashboard and manage their account</p>
      </div>

      <div className="user-grid">
        {users.length === 0 ? (
          <div className="no-users">
            <p>No users assigned to you yet.</p>
          </div>
        ) : (
          users.map((user) => (
            <div 
              key={user.id} 
              className={`user-card ${getStatusColor(user)}`}
              onClick={() => onUserSelect(user)}
            >
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
              </div>

              <div className="user-card-actions">
                <button className="view-dashboard-btn">
                  View Dashboard
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
