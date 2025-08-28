import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';
import DashboardHeader from '../../components/DashboardHeader';
import BalanceCard from '../../components/Dashboard/BalanceCard';
import DepositsCard from '../../components/Dashboard/DepositsCard';
import OrdersCard from '../../components/Dashboard/OrdersCard';
import DepositStats from '../../components/Dashboard/DepositStats';
import TransactionStats from '../../components/Dashboard/TransactionStats';
import SupportTickets from '../../components/Dashboard/SupportTickets';
import LatestTransactions from '../../components/Dashboard/LatestTransactions';
import NotificationBanner from '../../components/Dashboard/NotificationBanner';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-wrapper">
      <div className="container custom-container">
        <DashboardHeader title="dashboard" />
        
        <NotificationBanner />

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="row g-4">
              <div className="col-xl-4 col-sm-6">
                <BalanceCard />
              </div>
              <div className="col-xl-4 col-sm-6">
                <DepositsCard />
              </div>
              <div className="col-xl-4 col-sm-6">
                <OrdersCard />
              </div>
            </div>

            <div className="mt-30">
              <div className="row g-4">
                <div className="col-xl-12">
                  <h4 className="mb-20">Deposit Statistics</h4>
                  <DepositStats />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row g-4">
              <div className="col-12">
                <h4 className="mb-20">Transaction Statistics</h4>
                <TransactionStats />
              </div>
              <div className="col-md-12">
                <SupportTickets />
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-30">
          <div className="card-header d-flex justify-content-between align-items-center border-0">
            <h4 className="mb-0">Latest Transaction</h4>
          </div>
          <div className="card-body">
            <LatestTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
