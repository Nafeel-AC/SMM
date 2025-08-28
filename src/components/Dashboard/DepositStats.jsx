import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardCards.css';

const DepositStats = () => {
  const { user } = useAuth();
  const [monthlyDeposits, setMonthlyDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartElement, setChartElement] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMonthlyDeposits();
    }
  }, [user]);

  // Initialize ApexCharts when data is available and component is mounted
  useEffect(() => {
    if (monthlyDeposits.length > 0 && document.getElementById('lineChart')) {
      initializeChart();
    }
    
    return () => {
      // Cleanup function to destroy chart when component unmounts
      if (chartElement) {
        chartElement.destroy();
      }
    };
  }, [monthlyDeposits]);

  const fetchMonthlyDeposits = async () => {
    try {
      setLoading(true);
      
      // Get current year
      const currentYear = new Date().getFullYear();
      
      // Create an array for all months with default values
      let deposits = Array(12).fill(0);
      
      // Fetch deposits for the current year
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('user_id', user.id)
        .eq('type', 'deposit')
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      if (error) throw error;
      
      // Process data to get monthly totals
      if (data && data.length > 0) {
        data.forEach(transaction => {
          const date = new Date(transaction.created_at);
          const month = date.getMonth(); // 0-indexed (0 = January)
          deposits[month] += parseFloat(transaction.amount);
        });
      }
      
      setMonthlyDeposits(deposits);
      
    } catch (error) {
      console.error('Error fetching monthly deposits:', error);
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
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ['rgba(4, 0, 245, 0.6)'],
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          foreColor: '#fff',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#fff',
          opacity: 0.9
        },
        formatter: function(val) {
          return '$' + val;
        },
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ["#fff"]
        }
      },
      stroke: {
        curve: 'smooth',
        width: 5
      },
      title: {
        text: '',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: months,
        title: {
          text: ''
        }
      },
      yaxis: {
        title: {
          text: ''
        },
        labels: {
          formatter: function(val) {
            return val.toFixed(2);
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

    const series = [{
      name: "Deposit",
      data: monthlyDeposits
    }];

    const chart = new ApexCharts(
      document.getElementById("lineChart"),
      { ...options, series }
    );
    
    chart.render();
    setChartElement(chart);
  };

  return (
    <div id="lineChart" style={{ minHeight: '365px' }}>
      {loading && <div className="chart-loading">Loading chart data...</div>}
      {error && <div className="chart-error">Failed to load chart data: {error}</div>}
      {!loading && !error && monthlyDeposits.length === 0 && 
        <div className="chart-empty">No deposit data available for this year</div>
      }
    </div>
  );
};

export default DepositStats;
