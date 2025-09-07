import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import Navbar from '../../components/Navbar';
import '../AuthForms/AuthForms.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Debug loading state changes
  useEffect(() => {
    console.log('🔄 LoginPage: Loading state changed to:', loading);
  }, [loading]);

  // Mobile-specific optimizations
  useEffect(() => {
    // Prevent zoom on input focus for iOS
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    // Cleanup on unmount
    return () => {
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0';
      }
    };
  }, []);
  const [error, setError] = useState('');
  const { signInWithEmail, user, profile } = useFirebaseAuth();
  const navigate = useNavigate();
  
  // Note: Redirect logic is handled by FirebaseAuthContext auth state listener
  // No need to redirect here to avoid conflicts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Login form submitted');
    setLoading(true);
    setError('');

    try {
      console.log('📧 Attempting to sign in with email:', formData.email);
      const { data, error } = await signInWithEmail(formData.email, formData.password);
      
      console.log('🔍 Sign in response:', { data, error });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        setError(error.message || 'Failed to login. Please check your credentials.');
        setLoading(false);
      } else {
        console.log('✅ Sign in successful, data:', data);
        // Success - the useEffect will handle role-based redirection
        console.log('🚀 Login successful, waiting for role-based redirect...');
        setLoading(false);
      }
    } catch (error) {
      console.error('💥 Sign in exception:', error);
      setError('Failed to login. Please check your credentials.');
      setLoading(false);
    }
  };



  return (
    <>
      <Navbar />
      <div className="login-page">
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
              <h2>Welcome back</h2>
              <p>Sign in to access your account and campaign insights.</p>
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
              <h1>Sign in</h1>
              <p className="muted">Enter your credentials to continue</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-grid">
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="email">Email</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="you@company.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>

                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="password">Password</label>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Your password"
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
            </form>



            <div className="alt-actions">
              <p>Don't have an account? <Link to="/register">Create account</Link></p>
              <p><Link to="/forgot-password">Forgot password?</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
