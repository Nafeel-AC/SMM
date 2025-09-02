import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PricingSection from '../../components/PricingSection/PricingSection';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (planName) => {
    console.log('Selected plan:', planName);
    setSelectedPlan(planName);
    // Navigate to payment page with selected plan
    navigate('/payment', { state: { plan: planName, billingCycle } });
  };

  const handleGetStarted = (planName) => {
    handlePlanSelect(planName);
  };

  return (
    <div className="subscription-page">
      <div className="container">
        <div className="subscription-header">
          <h1>Choose Your Growth Plan</h1>
          <p>Welcome back, {user?.email}! Select a plan to continue your Instagram growth journey.</p>
        </div>

        {/* Custom Pricing Section for Subscription Flow */}
        <div className="subscription-pricing">
          <PricingSection onPlanSelect={handleGetStarted} />
        </div>

        <div className="subscription-footer">
          <p>All plans include a 7-day free trial. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

