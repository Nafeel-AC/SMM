import React from 'react';
import { 
  BalanceCard, 
  DepositCard, 
  OrdersCard, 
  SupportCard,
  DepositChart,
  TransactionChart,
  LatestTransactions,
  NotificationBanner
} from './DashboardCards';
import './Dashboard.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="container">
        <div className="breadcrumb-area">
          <h2 className="title">Dashboard</h2>
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ul>
        </div>
        
        <NotificationBanner />
        
        <div className="row">
          <div className="col-lg-6 col-xl-3 col-sm-6 mb-4">
            <BalanceCard />
          </div>
          <div className="col-lg-6 col-xl-3 col-sm-6 mb-4">
            <DepositCard />
          </div>
          <div className="col-lg-6 col-xl-3 col-sm-6 mb-4">
            <OrdersCard />
          </div>
          <div className="col-lg-6 col-xl-3 col-sm-6 mb-4">
            <SupportCard />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-7 mb-4">
            <DepositChart />
          </div>
          <div className="col-lg-5 mb-4">
            <TransactionChart />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <LatestTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
