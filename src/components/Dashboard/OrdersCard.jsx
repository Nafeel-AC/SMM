import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardCards.css';

const OrdersCard = () => {
  const { user } = useAuth();
  const [processingOrders, setProcessingOrders] = useState(0);
  const [confirmedOrders, setConfirmedOrders] = useState(0);
  const [canceledOrders, setCanceledOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch processing orders
      const { data: processingData, error: processingError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'processing');

      if (processingError) throw processingError;
      
      // Fetch confirmed orders
      const { data: confirmedData, error: confirmedError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'confirmed');

      if (confirmedError) throw confirmedError;
      
      // Fetch canceled orders
      const { data: canceledData, error: canceledError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'canceled');

      if (canceledError) throw canceledError;
      
      setProcessingOrders(processingData.length);
      setConfirmedOrders(confirmedData.length);
      setCanceledOrders(canceledData.length);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box-card strong-orange-card moduleRecord">
      <div className="top">
        <div className="icon-box">
          <i className="fa-light fa-cart-shopping"></i>
        </div>
        <div className="text-box">
          <h5 className="title">Orders</h5>
        </div>
      </div>
      <div className="bottom fw-semibold">
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Processing Order"
        >
          <i className="fa-regular fa-spinner"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error</span>
          ) : (
            <span>{processingOrders}</span>
          )}
        </div>
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Confirmed Order"
        >
          <i className="fa-regular fa-box-check"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error</span>
          ) : (
            <span>{confirmedOrders}</span>
          )}
        </div>
        <div 
          className="item" 
          data-bs-toggle="tooltip" 
          data-bs-placement="top" 
          data-bs-original-title="Cancel Order"
        >
          <i className="fa-regular fa-rectangle-xmark"></i>
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-danger">Error</span>
          ) : (
            <span>{canceledOrders}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
