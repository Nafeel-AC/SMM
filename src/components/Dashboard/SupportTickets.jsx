import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardCards.css';

const SupportTickets = () => {
  const { user } = useAuth();
  const [pendingTickets, setPendingTickets] = useState(0);
  const [answeredTickets, setAnsweredTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Fetch pending tickets
      const { data: pendingData, error: pendingError } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;
      
      // Fetch answered tickets
      const { data: answeredData, error: answeredError } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'answered');

      if (answeredError) throw answeredError;
      
      // Fetch closed tickets
      const { data: closedData, error: closedError } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'closed');

      if (closedError) throw closedError;
      
      setPendingTickets(pendingData.length);
      setAnsweredTickets(answeredData.length);
      setClosedTickets(closedData.length);
      
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box-card grayish-green-card moduleRecord">
      <div className="top">
        <div className="icon-box">
          <i className="fa-regular fa-headset"></i>
        </div>
        <div className="text-box">
          <h5 className="title">Support Tickets</h5>
        </div>
      </div>
      <div className="bottom fw-semibold">
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Pending Ticket"
        >
          <i className="fa-regular fa-spinner"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error</span>
          ) : (
            <span>{pendingTickets}</span>
          )}
        </div>
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Answer Ticket"
        >
          <i className="fa-regular fa-box-check"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error</span>
          ) : (
            <span>{answeredTickets}</span>
          )}
        </div>
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Close Ticket"
        >
          <i className="fa-light fa-rectangle-xmark"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error</span>
          ) : (
            <span>{closedTickets}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
