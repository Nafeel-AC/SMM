import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../AuthForms/AuthForms.css';
import heroImage from '../../assets/hero-image.jpg';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
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
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-left" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden>
            <div className="left-overlay">
              <h2>Welcome back</h2>
              <p>Sign in to access your dashboard and campaign insights.</p>
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
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="you@company.com" />
                </div>

                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required placeholder="Your password" />
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
  );
};

export default LoginPage;
