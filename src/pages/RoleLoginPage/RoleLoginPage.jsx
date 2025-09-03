import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAuthService } from '../../lib/role-auth-service';
import './RoleLoginPage.css';

const RoleLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await roleAuthService.loginWithRole(email, password);
      
      if (result.success) {
        const user = result.user;
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user.role === 'staff') {
          navigate('/staff-dashboard');
        } else {
          // Regular user - redirect to normal dashboard
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Login</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
          <div className="role-info">
            <h3>Login as:</h3>
            <div className="role-cards">
              <div className="role-card admin">
                <h4>Admin</h4>
                <p>Manage users and staff</p>
                <small>Full system access</small>
              </div>
              <div className="role-card staff">
                <h4>Staff</h4>
                <p>Manage assigned users</p>
                <small>Limited access</small>
              </div>
              <div className="role-card user">
                <h4>User</h4>
                <p>View your dashboard</p>
                <small>Personal access</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLoginPage;
