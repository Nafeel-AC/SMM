import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import '../LoginPage/LoginPage.css'; // We're reusing the login page styles

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Background image
  const bgImage = '/src/assets/hero-image.jpg'; // Update this path to your actual image

  // Handle form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message || 'Failed to reset password. Please try again.');
      setLoading(false);
      return;
    }
    
    setSuccessMessage('Password reset link has been sent to your email address. Please check your inbox.');
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <section className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="container">
        <div className="login-form-container">
          <div className="login-form">
            <div className="section-header">
              <h3>RESET PASSWORD</h3>
              <div className="description">
                Enter your email address and we'll send you a link to reset your password
              </div>
            </div>
            
            {/* Error message */}
            {error && <div className="error-message">{error}</div>}
            
            {/* Success message */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {/* Reset password form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
              
              <div className="signup-link">
                <Link to="/login">Back to login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ForgotPasswordPage;
