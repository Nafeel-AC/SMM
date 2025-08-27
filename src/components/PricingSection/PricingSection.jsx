import React, { useState } from 'react';
import './PricingSection-new.css';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 1,
      name: 'KICKOFF PLAN',
      price: billingCycle === 'monthly' ? 49 : 490,
      dailyPrice: billingCycle === 'monthly' ? 1.63 : 1.36,
      description: 'Put your Instagram growth on autopilot. Perfect for personal accounts.',
      features: [
        '600 - 800+ Real followers',
        'Growth pods network',
        'Guaranteed results',
        'Real-time growth analytics',
        '24/7 Live support'
      ],
      headerColor: '#667eea',
      popular: false
    },
    {
      id: 2,
      name: 'GROWTH PLAN',
      price: billingCycle === 'monthly' ? 69 : 690,
      dailyPrice: billingCycle === 'monthly' ? 2.30 : 1.89,
      description: 'Organic Instagram growth designed to connect you with your ideal audience.',
      features: [
        '800 - 1,200+ Real & Organic followers',
        'Growth pods network',
        'Targeted AI growth',
        'Account and hashtag targeting',
        'Guaranteed results',
        'Real-time growth analytics',
        '24/7 Live support'
      ],
      headerColor: '#28a745',
      popular: true
    },
    {
      id: 3,
      name: 'ADVANCED PLAN',
      price: billingCycle === 'monthly' ? 129 : 1290,
      dailyPrice: billingCycle === 'monthly' ? 4.30 : 3.53,
      description: 'Advanced tools to drive conversion rates. Ideal for influencers and businesses.',
      features: [
        '1,200 - 1,600+ Real & Organic followers',
        'Growth pods network',
        'Targeted AI growth',
        'Account and hashtag targeting',
        '10x your engagement',
        'Turn followers into conversions',
        'Guaranteed results'
      ],
      headerColor: '#ffc107',
      popular: false
    }
  ];

  const handleGetStarted = (planName) => {
    // Handle plan selection - can be connected to payment gateway
    console.log(`Selected plan: ${planName}`);
    // You can add payment integration here
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="section-header text-center">
          <h6 className="section-subtitle">PRICING PLANS</h6>
          <h2 className="section-title">Choose Your Growth Strategy</h2>
          <p className="section-description">
            Select the perfect plan that aligns with your social media growth goals
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle text-center mb-5">
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
              <span className="discount-badge">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && (
                <div className="popular-flame">
                  <i className="fas fa-fire"></i>
                </div>
              )}
              
              <div className="card-header" style={{ backgroundColor: plan.headerColor }}>
                <h3 className="plan-name">{plan.name}</h3>
              </div>
              
              <div className="card-body">
                <p className="plan-description">{plan.description}</p>
                
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/mo</span>
                </div>
                
                <div className="daily-price">
                  (only ${plan.dailyPrice}/day)
                </div>
                
                <button
                  className="get-started-btn"
                  onClick={() => handleGetStarted(plan.name)}
                >
                  Get Started Today
                  <span className="arrow-icon">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </button>
                
                <div className="features-list">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="checkmark">
                        <i className="fas fa-check"></i>
                      </span>
                      <span className="feature-name">{feature}</span>
                      <span className="info-icon">
                        <i className="fas fa-question-circle"></i>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
