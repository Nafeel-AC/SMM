import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../AuthForms/AuthForms.css';
import heroImage from '../../assets/hero-image.jpg';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUpWithEmail } = useAuth();
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
      await signUpWithEmail(formData.email, formData.password, formData.name);
      navigate('/login');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-left" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden>
            <div className="left-overlay">
              <h2>SMM Matrix</h2>
              <p>Grow smarter. Faster. Together.</p>
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
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Your full name" />
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
  );
};

export default RegisterPage;
