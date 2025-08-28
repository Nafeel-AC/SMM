import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar/Navbar';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import BalanceCard from '../components/Dashboard/BalanceCard';
import DepositsCard from '../components/Dashboard/DepositsCard';
import OrdersCard from '../components/Dashboard/OrdersCard';
import SupportTickets from '../components/Dashboard/SupportTickets';
import NotificationBanner from '../components/Dashboard/NotificationBanner';
import DepositStats from '../components/Dashboard/DepositStats';
import TransactionStats from '../components/Dashboard/TransactionStats';
import LatestTransactions from '../components/Dashboard/LatestTransactions';
import '../components/Dashboard/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Load ApexCharts from CDN
    if (!document.getElementById('apexcharts-script')) {
      const script = document.createElement('script');
      script.id = 'apexcharts-script';
      script.src = 'https://cdn.jsdelivr.net/npm/apexcharts';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Load Font Awesome from CDN
    if (!document.getElementById('fontawesome-script')) {
      const script = document.createElement('script');
      script.id = 'fontawesome-script';
      script.src = 'https://kit.fontawesome.com/a076d05399.js';
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
    
    return () => {
      // Cleanup scripts on component unmount if needed
      // Note: In most cases, leaving scripts in the DOM is fine
    };
  }, []);

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="container py-4">
          <DashboardHeader user={user} />
          
          <NotificationBanner
            title="Enable Browser Notifications"
            description="Get real-time updates about your transactions and orders."
            actionLabel="Enable"
            icon="bell"
          />
          
          <div className="row">
            <div className="col-md-4">
              <BalanceCard />
            </div>
            <div className="col-md-4">
              <DepositsCard />
            </div>
            <div className="col-md-4">
              <OrdersCard />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Monthly Deposit Stats</h5>
                </div>
                <div className="card-body">
                  <DepositStats />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Transaction Overview</h5>
                </div>
                <div className="card-body">
                  <TransactionStats />
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-8">
              <LatestTransactions />
            </div>
            <div className="col-md-4">
              <SupportTickets />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
