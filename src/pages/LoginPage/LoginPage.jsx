import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

// Import icons
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithOAuth, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Background image
  const bgImage = '/src/assets/hero-image.jpg'; // Update this path to your actual image

  // Handle form submission for email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    
    if (error) {
      setError(error.message || 'Failed to login. Please try again.');
      setLoading(false);
      return;
    }
    
    // User is logged in successfully, redirect to dashboard
    navigate('/dashboard');
    setLoading(false);
  };

  // Handle Google authentication
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    const { error } = await signInWithOAuth('google');
    
    if (error) {
      setError('Failed to login with Google. Please try again.');
      setLoading(false);
    }
    
    // The redirect happens automatically through Supabase
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="container">
        <div className="login-form-container">
          <div className="login-form">
            <div className="section-header">
              <h3>WELCOME BACK!</h3>
              <div className="description">
                Enter your details to sign in to your account
              </div>
            </div>
            
            {/* Social login options */}
            <div className="social-login-buttons">
              <button 
                className="social-btn" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <FcGoogle size={20} />
                Google
              </button>
            </div>
            
            <div className="divider">OR CONTINUE WITH EMAIL</div>
            
            {/* Error message */}
            {error && <div className="error-message">{error}</div>}
            
            {/* Login form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle" 
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-check">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
                
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="login-button"
                disabled={loading || authLoading}
              >
                {(loading || authLoading) ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Log In'
                )}
              </button>
              
              <div className="signup-link">
                Don't have an account? <Link to="/register">Create an account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
