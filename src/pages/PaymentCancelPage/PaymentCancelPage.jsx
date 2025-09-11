import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-cancel">
      <h1>Payment canceled</h1>
      <p>Your payment was canceled. You can try again.</p>
      <button onClick={() => navigate('/subscription')}>Back to Plans</button>
    </div>
  );
};

export default PaymentCancelPage;


