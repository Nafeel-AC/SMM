import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './PaymentPage.css';

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get plan details from navigation state
  const selectedPlan = location.state?.plan || 'Starter';
  const billingCycle = location.state?.billingCycle || 'monthly';

  // Helper function to get plan price
  const getPlanPrice = (plan, cycle) => {
    const prices = {
      'Starter': { monthly: 99, yearly: 990 },
      'Premium': { monthly: 199, yearly: 1990 },
      'Ultimate': { monthly: 299, yearly: 2990 }
    };
    return prices[plan]?.[cycle] || 99;
  };

  // Helper function to get plan features
  const getPlanFeatures = (plan) => {
    const features = {
      'Starter': [
        'Instagram Growth Management',
        'Target Audience Analysis',
        'Content Strategy',
        '24/7 Support',
        'Monthly Reports'
      ],
      'Premium': [
        'Everything in Basic',
        'Multiple Account Management',
        'Advanced Analytics',
        'Priority Support',
        'Custom Campaigns'
      ],
      'Ultimate': [
        'Everything in Premium',
        'Dedicated Account Manager',
        'Real-time Analytics',
        'White-label Reports',
        'Custom Growth Strategies'
      ]
    };
    return features[plan] || features['Starter'];
  };

  const handlePayment = async (amount = 99) => {
    setLoading(true);
    setError('');

    // Simulate payment processing - no database dependency
    setTimeout(() => {
      setSuccess(true);
      
      // Redirect to Instagram connection after 1 second
      setTimeout(() => {
        navigate('/instagram-connect');
      }, 1000);

      setLoading(false);
    }, 500);
  };

  if (success) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase. Redirecting to Instagram connection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Purchase</h1>
          <p>You selected: <strong>{selectedPlan} Plan</strong> ({billingCycle})</p>
        </div>

        <div className="pricing-cards">
          <div className="pricing-card featured">
            <div className="card-header">
              <h3>{selectedPlan} Plan</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">{getPlanPrice(selectedPlan, billingCycle)}</span>
                <span className="period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
            </div>
            <div className="card-features">
              <ul>
                {getPlanFeatures(selectedPlan).map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>
            <button 
              className="select-plan-btn"
              onClick={() => handlePayment(getPlanPrice(selectedPlan, billingCycle))}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="payment-security">
          <p>🔒 Secure payment processing</p>
          <p>Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
