import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import Navbar from '../../components/Navbar';
import '../AuthForms/AuthForms.css';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUpWithEmail } = useFirebaseAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUpWithEmail(formData.email, formData.password, formData.firstName, formData.lastName);
      navigate('/login');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-left" aria-hidden>
            <div className="animated-background">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
                <div className="shape shape-5"></div>
                <div className="shape shape-6"></div>
              </div>
              <div className="gradient-overlay"></div>
              <div className="pulse-circle"></div>
              <div className="rotating-ring"></div>
            </div>
            <div className="left-overlay">
              <span className="hero-section-subtitle"> &#10024; We're Glowup Agency</span>
              <h2>Glowup Agency</h2>
              <p>Grow smarter. Faster. Together.</p>
              <div className="btn-area">
                <a href="/contact" className="chat-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Chat with us
                </a>
              </div>
            </div>
          </div>

          <div className="signup-right">
            <div className="brand">
              <h1>Create account</h1>
              <p className="muted">Start your free trial — no credit card required</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="firstName">First name</label>
                  <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} required placeholder="Your first name" />
                </div>

                <div className="input-group">
                  <label htmlFor="lastName">Last name</label>
                  <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} required placeholder="Your last name" />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="you@company.com" />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required placeholder="Create a password" />
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required placeholder="Repeat password" />
                </div>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="alt-actions">
              <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;
