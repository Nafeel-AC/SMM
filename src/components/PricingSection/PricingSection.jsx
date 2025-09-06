import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PricingSection-modern.css';
import pricingData from '../../data/pricingData';

const PricingSection = ({ onPlanSelect }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const navigate = useNavigate();

  const { plans, pricing, comparisonCategories } = pricingData;

  const handleGetStarted = (planName) => {
    // Navigate to login page using React Router
    navigate('/login');
  };

  // Helper function to render checkmark or minus
  const renderCheckOrMinus = (isIncluded) => {
    if (isIncluded) {
      return (
        <svg className="h-5 w-5 check-icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5 minus-icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <>
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header text-center">
            <h6 className="section-subtitle">Pricing</h6>
            <h2 className="section-title">Instagram Growth Plans</h2>
            <p className="section-description">
              Get Started Today, with your very own Instagram Marketer. Setup your campaign, you'll be receiving your first followers within hours!
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="billing-toggle text-center">
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

          {/* Pricing Cards */}
          <div className="pricing-cards">
            {plans.map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && (
                  <div className="popular-badge pricing-popular-badge">Most popular</div>
                )}
                
                <div className="card-header" style={{ backgroundColor: plan.id === 'starter' ? '#4b5563' : plan.id === 'premium' ? '#1c64f2' : '#f59e0b' }}>
                  <h3 className="plan-name">{plan.name}</h3>
                </div>
                
                <div className="card-body">
                  <p className="plan-description">{plan.description}</p>
                  
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{pricing[billingCycle][plan.id]}</span>
                    <span className="period">{billingCycle === 'monthly' ? '/mo' : '/yr'}</span>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <div className="daily-price">
                      (${(pricing[billingCycle][plan.id] / 12).toFixed(2)}/month)
                    </div>
                  )}
                  
                  
                  <div className="features-list">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="checkmark">
                          <svg className="h-6 w-6" width="20" height="20" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="feature-name">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="get-started-btn"
                    onClick={() => handleGetStarted(plan.name)}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="comparison-section">
        <div className="container">
          <h3 className="section-title text-center" style={{ color: '#1f2937', marginBottom: '2rem', fontSize: '1.75rem' }}>
            Feature Comparison
          </h3>
          <div className="comparison-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Plans</th>
                  <th scope="col">Starter</th>
                  <th scope="col">Premium</th>
                  <th scope="col">Ultimate</th>
                </tr>
              </thead>
              <tbody>
              {/* Pricing row */}
              <tr>
                <th scope="row">Pricing</th>
                <td className="price-cell">
                  <p className="price-amount">
                    <span className="price-currency">$</span>
                    {pricing[billingCycle].starter}
                  </p>
                  <span className="price-period">/mo</span>
                  <p className="price-description">
                    Perfect for personal accounts seeking steady, organic growth and targeted global followers that align with your interests.
                  </p>
                </td>
                <td className="price-cell">
                  <p className="price-amount">
                    <span className="price-currency">$</span>
                    {pricing[billingCycle].premium}
                  </p>
                  <span className="price-period">/mo</span>
                  <p className="price-description">
                    Ideal for individuals and businesses looking to build a relevant local community with focused, location-based targeting and hands-on support.
                  </p>
                </td>
                <td className="price-cell">
                  <p className="price-amount">
                    <span className="price-currency">$</span>
                    {pricing[billingCycle].ultimate}
                  </p>
                  <span className="price-period">/mo</span>
                  <p className="price-description">
                    Designed for people building their brand with tailored engagement and advanced targeting to reach a specific audience with guidance from our top performers.
                  </p>
                </td>
              </tr>

              {/* Categories and features */}
              {comparisonCategories.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr>
                    <th className="category-header" colSpan="4" scope="colgroup">
                      {category.name}
                    </th>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <th scope="row">{item.name}</th>
                      <td>{renderCheckOrMinus(item.starter)}</td>
                      <td>{renderCheckOrMinus(item.premium)}</td>
                      <td>{renderCheckOrMinus(item.ultimate)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot colSpan={3}>
              <tr>
                {/* <th scope="row" className="sr-only">Choose your plan</th> */}

                {/* <td>
                </td>
                <td>
                  <button 
                    className="table-cta"
                    onClick={() => handleGetStarted('Premium')}
                  >
                    Get Started
                  </button>
                </td> */}
                
                <td>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        </div>
      </section>
    </>
  );
};

export default PricingSection;
