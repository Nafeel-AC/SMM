import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardCards.css';

const DashboardHeader = ({ user }) => {
  // Format the current date
  const formatDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString(undefined, options);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user's first name or email prefix
  const getUserName = () => {
    if (user) {
      // If user has metadata with a name, use that
      if (user.user_metadata && user.user_metadata.first_name) {
        return user.user_metadata.first_name;
      }
      
      // Otherwise, extract name from email (before @)
      if (user.email) {
        return user.email.split('@')[0];
      }
    }
    
    return 'User'; // Fallback
  };

  return (
    <div className="dashboard-header">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Dashboard
          </li>
        </ol>
      </nav>
      
      <div className="welcome-message">
        {getGreeting()}, {getUserName()}!
      </div>
      
      <div className="date-display">
        {formatDate()}
      </div>
    </div>
  );
};

export default DashboardHeader;
