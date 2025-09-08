import React, { useState, useEffect } from 'react';
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
  const { signUpWithEmail, signInWithGoogle, user, profile, getNextUserFlowStep } = useFirebaseAuth();
  const navigate = useNavigate();

  // Redirect user after successful Google signup with updated context
  useEffect(() => {
    if (user && profile) {
      console.log('🚀 Google signup successful, redirecting to dashboard with updated context');
      const dashboardUrl = getNextUserFlowStep();
      console.log('📍 Redirecting to:', dashboardUrl);
      navigate(dashboardUrl, { replace: true });
    }
  }, [user, profile, navigate, getNextUserFlowStep]);

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

  const handleGoogleSignUp = async () => {
    console.log('🔐 Google sign up initiated');
    setLoading(true);
    setError('');

    try {
      console.log('📧 Attempting to sign up with Google');
      const { data, error } = await signInWithGoogle();
      
      console.log('🔍 Google sign up response:', { data, error });
      
      if (error) {
        console.error('❌ Google sign up error:', error);
        setError(error.message || 'Failed to create account with Google. Please try again.');
        setLoading(false);
      } else {
        console.log('✅ Google sign up successful, data:', data);
        // Success - useEffect will handle redirection with updated context
        console.log('🚀 Google signup successful, waiting for profile update and redirection...');
        // Keep loading state true until redirection happens
      }
    } catch (error) {
      console.error('💥 Google sign up exception:', error);
      setError('Failed to create account with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-container">
          {/* Form Section */}
          <div className="register-form-section">
            <div className="form-container">
              <div className="brand">
                <h1>Create account</h1>
                <p className="muted">Start your free trial — no credit card required</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="input-grid">
                  <div className="input-group">
                    <label htmlFor="firstName">First name</label>
                    <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} required placeholder="Your first name" />
                  </div>

                  <div className="input-group">
                    <label htmlFor="lastName">Last name</label>
                    <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} required placeholder="Your last name" />
                  </div>

                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="you@company.com" />
                  </div>

                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required placeholder="Create a password" />
                  </div>

                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required placeholder="Repeat password" />
                  </div>
                </div>

                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="divider">
                <span>or</span>
              </div>

              <button 
                type="button" 
                className="google-btn" 
                onClick={handleGoogleSignUp}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{marginRight: '12px'}}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Creating account...' : 'Continue with Google'}
              </button>

              <div className="alt-actions">
                <p>Already have an account? <Link to="/login">Sign in</Link></p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="register-image-section">
            <div className="image-background">
              <img src="/assets/team-image.jpg" alt="Marketing Team" className="background-image" />
              <div className="image-overlay"></div>
            </div>
            <div className="image-overlay">
              <div className="overlay-content">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
