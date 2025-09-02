import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import SupportChat from './components/SupportChat';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ServicesPage from './pages/ServicesPage';

import SubscriptionPage from './pages/SubscriptionPage';
import PaymentPage from './pages/PaymentPage';
import InstagramConnectPage from './pages/InstagramConnectPage';
import RequirementsFormPage from './pages/RequirementsFormPage';
import DashboardPage from './pages/DashboardPage';
import StaffPanel from './pages/StaffPanel';
import AdminPanel from './pages/AdminPanel';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Role-based protected route component
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/requirements-form" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* User Flow Routes */}
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/instagram-connect" element={<ProtectedRoute><InstagramConnectPage /></ProtectedRoute>} />
          <Route path="/requirements-form" element={<ProtectedRoute><RequirementsFormPage /></ProtectedRoute>} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          
          {/* Staff Panel */}
          <Route path="/staff" element={<RoleProtectedRoute allowedRoles={['staff', 'admin']}><StaffPanel /></RoleProtectedRoute>} />
          
          {/* Admin Panel */}
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminPanel /></RoleProtectedRoute>} />
        </Routes>
        <Footer />
        <SupportChat />
      </Router>
    </AuthProvider>
  );
}

export default App;
