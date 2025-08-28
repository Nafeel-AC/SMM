import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardCards.css';

const DepositsCard = () => {
  const { user } = useAuth();
  const [recentDeposits, setRecentDeposits] = useState('0.00');
  const [totalDeposits, setTotalDeposits] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDeposits();
    }
  }, [user]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      
      // Get current date
      const today = new Date();
      
      // Get date from 7 days ago
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      // Format dates for Supabase query
      const todayStr = today.toISOString();
      const sevenDaysAgoStr = sevenDaysAgo.toISOString();
      
      // Fetch recent deposits (last 7 days)
      const { data: recentData, error: recentError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'deposit')
        .gte('created_at', sevenDaysAgoStr)
        .lte('created_at', todayStr);

      if (recentError) throw recentError;
      
      // Fetch total deposits
      const { data: totalData, error: totalError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'deposit');

      if (totalError) throw totalError;
      
      // Calculate sums
      const recentSum = recentData.reduce((acc, item) => acc + item.amount, 0);
      const totalSum = totalData.reduce((acc, item) => acc + item.amount, 0);
      
      setRecentDeposits(recentSum.toFixed(2));
      setTotalDeposits(totalSum.toFixed(2));
      
    } catch (error) {
      console.error('Error fetching deposits:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box-card strong-olive-card moduleRecord">
      <div className="top">
        <div className="icon-box">
          <i className="fa-regular fa-money-check-dollar"></i>
        </div>
        <div className="text-box">
          <h5 className="title">Deposits</h5>
        </div>
      </div>
      <div className="bottom fw-semibold">
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Last 7 Days"
        >
          <i className="fa-regular fa-money-check-dollar"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error loading</span>
          ) : (
            <span>{recentDeposits} USD</span>
          )}
        </div>
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Total"
        >
          <i className="fa-regular fa-money-check-dollar"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error loading</span>
          ) : (
            <span>{totalDeposits} USD</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositsCard;
