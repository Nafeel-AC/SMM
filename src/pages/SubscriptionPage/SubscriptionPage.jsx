import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  const pricingData = {
    monthly: {
      basic: { price: 59, period: '/month' },
      pro: { price: 89, period: '/month' },
      enterprise: { price: 189, period: '/month' }
    },
    yearly: {
      basic: { price: 590, period: '/year', monthlyEquivalent: 24.17 },
      pro: { price: 790, period: '/year', monthlyEquivalent: 49.17 },
      enterprise: { price: 1690, period: '/year', monthlyEquivalent: 157.50 }
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Starter',
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
      name: 'Premium',
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
      name: 'Ultimate',
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
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      const currentPricing = pricingData[billingCycle][selectedPlan];
      
      // Create Stripe checkout session
      const apiUrl = import.meta.env.VITE_API_URL || 'https://your-functions-project.vercel.app';
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          price: currentPricing.price,
          billingCycle,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert(`Failed to start checkout process: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Choose Your Plan</h1>
          <p>Select the perfect plan for your Instagram growth needs</p>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <div className="toggle-container">
            <span className={`toggle-label ${billingCycle === 'monthly' ? 'active' : ''}`}>
              Monthly
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={billingCycle === 'yearly'}
                onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              />
              <span className="slider"></span>
            </label>
            <span className={`toggle-label ${billingCycle === 'yearly' ? 'active' : ''}`}>
              Yearly
              <span className="discount-badge">Save 30%</span>
            </span>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => {
            const currentPricing = pricingData[billingCycle][plan.id];
            return (
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
                    <span className="price">${currentPricing.price}</span>
                    <span className="period">{currentPricing.period}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="monthly-equivalent">
                      (${currentPricing.monthlyEquivalent}/month)
                    </div>
                  )}
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
            );
          })}
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
