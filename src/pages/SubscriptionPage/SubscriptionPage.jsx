import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$29',
      period: '/month',
      features: [
        'Instagram Growth Management',
        'Basic Analytics Dashboard',
        'Email Support',
        'Up to 1 Instagram Account'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$59',
      period: '/month',
      features: [
        'Advanced Growth Strategies',
        'Detailed Analytics & Insights',
        'Priority Support',
        'Up to 3 Instagram Accounts',
        'Custom Hashtag Research',
        'Competitor Analysis'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '$99',
      period: '/month',
      features: [
        'White-label Growth Service',
        'Advanced Analytics & Reporting',
        'Dedicated Account Manager',
        'Unlimited Instagram Accounts',
        'Custom Strategy Development',
        '24/7 Phone Support'
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handleContinue = async () => {
    setLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to payment page
    navigate('/payment', { state: { plan: selectedPlan } });
  };

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Choose Your Plan</h1>
          <p>Select the perfect plan for your Instagram growth needs</p>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="plan-select">
                <div className={`select-indicator ${selectedPlan === plan.id ? 'active' : ''}`}>
                  {selectedPlan === plan.id && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="subscription-actions">
          <button 
            className="continue-btn"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </button>
        </div>

        <div className="subscription-footer">
          <p>All plans include a 7-day free trial. Cancel anytime.</p>
          <div className="security-badges">
            <span>🔒 Secure Payment</span>
            <span>💳 All Major Cards</span>
            <span>🔄 Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
