import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { firebaseDb } from '../../lib/firebase-db';
import './PaymentPage.css';

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const { user, fetchUserProfile } = useFirebaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedPlan = location.state?.plan || 'starter';
  
  const planDetails = {
    starter: { 
      name: 'Starter', 
      price: 59,
      features: [
        'Real Instagram Followers',
        'Monthly growth Analytics',
        '24/7 Live Support',
        'Instagram Audit',
        'Cancel Anytime',
        'VPN Login Support',
        'Account Management',
        'Monthly Review'
      ]
    },
    premium: { 
      name: 'Premium', 
      price: 89,
      features: [
        'Real Instagram Followers',
        'Monthly growth Analytics',
        '24/7 Live Support',
        'Instagram Audit',
        'Cancel Anytime',
        'Target by Hashtag',
        'Target by Influencer & competitor',
        'Targeting Optimization',
        'Gender',
        'VPN Login Support',
        'Account Management',
        'Monthly Review'
      ]
    },
    ultimate: { 
      name: 'Ultimate', 
      price: 189,
      features: [
        'Real Instagram Followers',
        'Monthly growth Analytics',
        '24/7 Live Support',
        'Instagram Audit',
        'Cancel Anytime',
        'Target by Hashtag',
        'Target by Influencer & competitor',
        'Targeting Optimization',
        'Gender',
        'Comments',
        'Likes Posts',
        'VPN Login Support',
        'Like After Follow',
        'Tiktok Service',
        'Welcome DM',
        'Account Management',
        'Monthly Review'
      ]
    }
  };

  const currentPlan = planDetails[selectedPlan] || planDetails['starter'];
  
  // Safety check - if currentPlan is still undefined, show error
  if (!currentPlan) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-message">
            <h1>Error</h1>
            <p>Invalid plan selected. Please go back and select a valid plan.</p>
            <button onClick={() => navigate('/subscription')}>Back to Plans</button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      console.log('💳 Processing payment for plan:', currentPlan.name);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save payment record to database
      const paymentData = {
        user_id: user.uid,
        amount: currentPlan.price,
        currency: 'USD',
        status: 'completed',
        payment_method: 'card',
        plan_name: currentPlan.name,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };
      
      console.log('💾 Saving payment record...');
      const paymentResult = await firebaseDb.savePayment(paymentData);
      if (paymentResult.error) {
        console.error('❌ Error saving payment:', paymentResult.error);
        throw paymentResult.error;
      }
      console.log('✅ Payment record saved successfully');
      
      // Update user profile to mark payment as completed
      console.log('👤 Updating user profile...');
      const profileResult = await firebaseDb.updateProfile(user.uid, {
        payment_completed: true,
        selected_plan: currentPlan.name,
        updated_at: new Date().toISOString()
      });
      
      if (profileResult.error) {
        console.error('❌ Error updating profile:', profileResult.error);
        throw profileResult.error;
      }
      console.log('✅ User profile updated successfully');
      
      // Refresh the user profile in the auth context
      console.log('🔄 Refreshing user profile...');
      await fetchUserProfile(user.uid);
      
      console.log('🎉 Payment completed successfully!');
      
      // Navigate to Instagram connect page
      navigate('/instagram-connect');
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <p>Secure payment processing for your {currentPlan.name}</p>
        </div>

        <div className="payment-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="plan-info">
              <div className="plan-name">{currentPlan.name}</div>
              <div className="plan-price">${currentPlan.price}/month</div>
            </div>
            
            <div className="plan-features">
              <h4>What's Included:</h4>
              <ul>
                {currentPlan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="billing-info">
              <div className="billing-item">
                <span>Subtotal</span>
                <span>${currentPlan.price}.00</span>
              </div>
              <div className="billing-item">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="billing-item total">
                <span>Total</span>
                <span>${currentPlan.price}.00</span>
              </div>
            </div>
            <div className="trial-info">
              <p>🎉 7-day free trial included</p>
              <p>Cancel anytime during trial period</p>
            </div>
          </div>

          <div className="payment-form">
            <h3>Payment Information</h3>
            
            <div className="payment-methods">
              <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>💳 Credit/Debit Card</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
                    maxLength="19"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      maxLength="4"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="security-info">
              <div className="security-badges">
                <span>🔒 SSL Encrypted</span>
                <span>🛡️ PCI Compliant</span>
                <span>💳 Secure Payment</span>
              </div>
            </div>

            <button 
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Processing Payment...
                </>
              ) : (
                `Pay $${currentPlan.price}.00`
              )}
            </button>

            <div className="payment-footer">
              <p>By completing this payment, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
