import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../LoginPage/LoginPage.css'; // We're reusing the login page styles

// Import icons
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Background image
  const bgImage = '/src/assets/hero-image.jpg'; // Update this path to your actual image

  // Handle form submission for email/password registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Form validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    const { data, error } = await signUpWithEmail(email, password);
    
    if (error) {
      setError(error.message || 'Failed to register. Please try again.');
      setLoading(false);
      return;
    }
    
    // If auto-confirm is enabled (development mode), redirect to dashboard
    if (data && data.user && !data.user.identities[0].identity_data.email_verified) {
      // Show success message for email verification workflow
      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      setLoading(false);
    } else {
      // Auto-confirmed or already verified, redirect to dashboard
      navigate('/dashboard');
    }
  };

  // Handle Google authentication
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    const { error } = await signInWithOAuth('google');
    
    if (error) {
      setError('Failed to sign up with Google. Please try again.');
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
              <h3>CREATE ACCOUNT</h3>
              <div className="description">
                Sign up to get started with SMM Matrix
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
                Sign up with Google
              </button>
            </div>
            
            <div className="divider">OR SIGN UP WITH EMAIL</div>
            
            {/* Error message */}
            {error && <div className="error-message">{error}</div>}
            
            {/* Success message */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {/* Registration form */}
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
                    placeholder="Create a password"
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
                <small className="form-text text-muted">
                  Password must be at least 8 characters long.
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirm-password"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
              
              <div className="signup-link">
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
