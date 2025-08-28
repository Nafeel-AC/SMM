import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar/Navbar';
import { DashboardPage } from '../components/Dashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = 'Dashboard - SMM Panel';
  }, []);

  return (
    <div className="dashboard-page">
      <Navbar />
      <DashboardPage />
    </div>
  );
};

export default Dashboard;
