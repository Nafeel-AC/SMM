import React from 'react';
import { FaWallet, FaMoneyBillWave, FaShoppingCart, FaTicketAlt, FaBell, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import dashboardData from '../../data/data.json';
import './DashboardCards.css';

// Import charts
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Balance Card Component
export const BalanceCard = () => {
  const { balance } = dashboardData;
  
  return (
    <div className="box-card grayish-blue-card">
      <div className="top">
        <div className="icon-box">
          <FaWallet />
        </div>
        <div className="text-box">
          <p className="title">Main Balance</p>
        </div>
      </div>
      <div className="bottom">
        <h3>${balance.amount.toFixed(2)}</h3>
        <div className="item">
          <FaArrowUp className="text-success" />
          <span>Last updated: {balance.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

// Deposit Card Component
export const DepositCard = () => {
  const { deposit } = dashboardData;
  
  return (
    <div className="box-card strong-olive-card">
      <div className="top">
        <div className="icon-box">
          <FaMoneyBillWave />
        </div>
        <div className="text-box">
          <p className="title">Total Deposits</p>
        </div>
      </div>
      <div className="bottom">
        <h3>${deposit.total.toFixed(2)}</h3>
        <div className="item">
          <FaArrowUp className="text-success" />
          <span>This week: ${deposit.thisWeek.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Orders Card Component
export const OrdersCard = () => {
  const { orders } = dashboardData;
  
  return (
    <div className="box-card strong-orange-card">
      <div className="top">
        <div className="icon-box">
          <FaShoppingCart />
        </div>
        <div className="text-box">
          <p className="title">Orders</p>
        </div>
      </div>
      <div className="bottom">
        <h3>{orders.total}</h3>
        <div className="item">
          <span>Processing: {orders.processing}</span>
        </div>
        <div className="item">
          <span>Confirmed: {orders.confirmed}</span>
        </div>
        <div className="item">
          <span>Cancelled: {orders.cancelled}</span>
        </div>
      </div>
    </div>
  );
};

// Support Card Component
export const SupportCard = () => {
  const { supportTickets } = dashboardData;
  
  return (
    <div className="box-card grayish-green-card">
      <div className="top">
        <div className="icon-box">
          <FaTicketAlt />
        </div>
        <div className="text-box">
          <p className="title">Support Tickets</p>
        </div>
      </div>
      <div className="bottom">
        <h3>{supportTickets.total}</h3>
        <div className="item">
          <span>Pending: {supportTickets.pending}</span>
        </div>
        <div className="item">
          <span>Answered: {supportTickets.answered}</span>
        </div>
        <div className="item">
          <span>Closed: {supportTickets.closed}</span>
        </div>
      </div>
    </div>
  );
};

// Deposit Chart Component
export const DepositChart = () => {
  const { monthlyDeposits } = dashboardData;
  
  const depositData = {
    labels: monthlyDeposits.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Deposits',
        data: monthlyDeposits.map(item => item.amount),
        fill: false,
        borderColor: 'rgba(13, 110, 253, 0.8)',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Deposit Statistics',
      },
    },
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Deposit Statistics</h4>
      </div>
      <div className="card-body">
        <div id="lineChart">
          <Line data={depositData} options={options} />
        </div>
      </div>
    </div>
  );
};

// Transaction Chart Component
export const TransactionChart = () => {
  const { transactionStats } = dashboardData;
  
  const transactionData = {
    labels: transactionStats.map(item => item.type),
    datasets: [
      {
        label: 'Transaction Count',
        data: transactionStats.map(item => item.count),
        backgroundColor: [
          'rgba(13, 110, 253, 0.7)',
          'rgba(25, 135, 84, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)',
        ],
        borderColor: [
          'rgba(13, 110, 253, 1)',
          'rgba(25, 135, 84, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Statistics',
      },
    },
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Transaction Statistics</h4>
      </div>
      <div className="card-body">
        <div id="columnChart">
          <Bar data={transactionData} options={options} />
        </div>
      </div>
    </div>
  );
};

// Latest Transactions Component
export const LatestTransactions = () => {
  const { latestTransactions } = dashboardData;
  
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Latest Transactions</h4>
      </div>
      <div className="card-body">
        <div className="cmn-table">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>#{transaction.id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>
                    {transaction.type === 'deposit' ? (
                      <span className="text-success">+${transaction.amount.toFixed(2)}</span>
                    ) : (
                      <span className="text-danger">-${transaction.amount.toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge bg-${
                      transaction.status === 'completed' ? 'success' : 
                      transaction.status === 'pending' ? 'warning' : 
                      'danger'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Notification Banner Component
export const NotificationBanner = () => {
  return (
    <div className="notification-banner">
      <div className="banner-icon">
        <FaBell />
      </div>
      <div className="banner-content">
        <h5 className="banner-title">Complete Your Profile</h5>
        <p className="banner-description">Please complete your profile to fully utilize all dashboard features.</p>
      </div>
      <div className="banner-action">
        <button className="cmn-btn">Complete Now</button>
      </div>
    </div>
  );
};
