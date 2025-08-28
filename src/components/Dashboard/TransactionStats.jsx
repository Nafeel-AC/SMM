import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardCards.css';

const TransactionStats = () => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState({
    deposits: Array(12).fill(0),
    transactions: Array(12).fill(0),
    received: Array(12).fill(0)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartElement, setChartElement] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMonthlyTransactionData();
    }
  }, [user]);

  // Initialize ApexCharts when data is available and component is mounted
  useEffect(() => {
    if (!loading && document.getElementById('columnChart')) {
      initializeChart();
    }
    
    return () => {
      // Cleanup function to destroy chart when component unmounts
      if (chartElement) {
        chartElement.destroy();
      }
    };
  }, [loading, monthlyData]);

  const fetchMonthlyTransactionData = async () => {
    try {
      setLoading(true);
      
      // Get current year
      const currentYear = new Date().getFullYear();
      
      // Fetch all transactions for the current year
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      if (error) throw error;
      
      // Initialize arrays for each transaction type
      let deposits = Array(12).fill(0);
      let transactions = Array(12).fill(0);
      let received = Array(12).fill(0);
      
      // Process data to get monthly totals by type
      if (data && data.length > 0) {
        data.forEach(item => {
          const date = new Date(item.created_at);
          const month = date.getMonth(); // 0-indexed (0 = January)
          const amount = parseFloat(item.amount);
          
          switch(item.type) {
            case 'deposit':
              deposits[month] += amount;
              break;
            case 'transaction':
              transactions[month] += amount;
              break;
            case 'received':
              received[month] += amount;
              break;
            default:
              break;
          }
        });
      }
      
      setMonthlyData({
        deposits,
        transactions,
        received
      });
      
    } catch (error) {
      console.error('Error fetching monthly transaction data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeChart = () => {
    if (typeof ApexCharts === 'undefined') {
      console.error('ApexCharts is not defined. Make sure the script is loaded.');
      return;
    }

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const options = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      xaxis: {
        categories: months,
      },
      legend: {
        position: 'bottom',
        offsetY: 5
      },
      fill: {
        opacity: 1
      },
      colors: ['#ffc107', '#706fc7', '#3e3e3e']
    };

    const series = [
      {
        name: 'Total Deposit',
        data: monthlyData.deposits
      },
      {
        name: 'Total Transactions',
        data: monthlyData.transactions
      },
      {
        name: 'Total Received',
        data: monthlyData.received
      }
    ];

    const chart = new ApexCharts(
      document.getElementById("columnChart"),
      { ...options, series }
    );
    
    chart.render();
    setChartElement(chart);
  };

  return (
    <div id="columnChart" style={{ minHeight: '365px' }}>
      {loading && <div className="chart-loading">Loading chart data...</div>}
      {error && <div className="chart-error">Failed to load chart data: {error}</div>}
      {!loading && !error && 
        (monthlyData.deposits.every(v => v === 0) && 
         monthlyData.transactions.every(v => v === 0) && 
         monthlyData.received.every(v => v === 0)) && 
        <div className="chart-empty">No transaction data available for this year</div>
      }
    </div>
  );
};

export default TransactionStats;
