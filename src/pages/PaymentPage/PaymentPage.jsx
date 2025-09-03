import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedPlan = location.state?.plan || 'basic';
  
  const planDetails = {
    basic: { name: 'Basic Plan', price: 29 },
    pro: { name: 'Pro Plan', price: 59 },
    enterprise: { name: 'Enterprise Plan', price: 99 }
  };

  const currentPlan = planDetails[selectedPlan];

  const handleInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful payment
    console.log('Payment successful!');
    
    // Navigate to Instagram connect page
    navigate('/instagram-connect');
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
