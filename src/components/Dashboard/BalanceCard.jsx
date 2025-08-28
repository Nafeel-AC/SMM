import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardCards.css';

const BalanceCard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select('balance, currency')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setBalance(data.balance.toFixed(2));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box-card grayish-blue-card moduleRecord">
      <div className="top">
        <div className="icon-box">
          <i className="fa-regular fa-wallet"></i>
        </div>
        <div className="text-box">
          <h5 className="title">Balance</h5>
        </div>
      </div>
      <div className="bottom">
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Wallet Balance"
        >
          <i className="fa-regular fa-money-bill"></i>
          {loading ? (
            <span className="fw-semibold">Loading...</span>
          ) : error ? (
            <span className="fw-semibold text-danger">Error loading</span>
          ) : (
            <span className="fw-semibold">{balance} USD</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
