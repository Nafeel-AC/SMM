import React from 'react';
import UserDashboard from '../AdminDashboard/UserDashboard';

// This wrapper ensures staff see the exact same dashboard as admin for a user
const StaffUserDashboardPage = () => {
  // Get the userId param from the route and pass it to UserDashboard
  const { userId } = useParams();
  return <UserDashboard userId={userId} />;
};

export default StaffUserDashboardPage;
