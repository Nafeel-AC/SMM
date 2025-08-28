import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardCards.css';

const LatestTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchLatestTransactions();
    }
  }, [user]);

  const fetchLatestTransactions = async () => {
    try {
      setLoading(true);
      
      // Fetch the 10 most recent transactions
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          status,
          created_at,
          description,
          reference_id,
          to_user:receiver_id(id, email, first_name, last_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching latest transactions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get appropriate status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  // Get appropriate icon class based on transaction type
  const getTypeIcon = (type) => {
    switch(type) {
      case 'deposit':
        return 'fas fa-arrow-down text-success';
      case 'withdrawal':
        return 'fas fa-arrow-up text-danger';
      case 'transaction':
        return 'fas fa-exchange-alt text-primary';
      case 'received':
        return 'fas fa-gift text-info';
      default:
        return 'fas fa-circle';
    }
  };

  return (
    <div className="latest-transactions card">
      <div className="card-header">
        <h5>Latest Transactions</h5>
        <button 
          className="btn btn-sm btn-primary" 
          onClick={fetchLatestTransactions}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="card-body">
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted">No transaction history found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <i className={getTypeIcon(transaction.type)}></i>
                      <span className="ms-2">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
                    </td>
                    <td>
                      {transaction.description || 
                        (transaction.type === 'transaction' && transaction.to_user 
                          ? `Payment to ${transaction.to_user.first_name || transaction.to_user.email}` 
                          : 'No description')
                      }
                    </td>
                    <td className={transaction.type === 'deposit' || transaction.type === 'received' ? 'text-success' : 'text-danger'}>
                      {transaction.type === 'deposit' || transaction.type === 'received' 
                        ? `+$${parseFloat(transaction.amount).toFixed(2)}` 
                        : `-$${parseFloat(transaction.amount).toFixed(2)}`
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(transaction.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="card-footer text-center">
        <a href="/transactions" className="btn btn-link">View All Transactions</a>
      </div>
    </div>
  );
};

export default LatestTransactions;
