import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { FirebaseAuthProvider, useFirebaseAuth } from './contexts/FirebaseAuthContext';
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
import RoleLoginPage from './pages/RoleLoginPage';

import SubscriptionPage from './pages/SubscriptionPage';
import PaymentPage from './pages/PaymentPage';
import InstagramConnectPage from './pages/InstagramConnectPage';
// import InstagramCallbackPage from './pages/InstagramCallbackPage'; // Not needed in test mode
import RequirementsFormPage from './pages/RequirementsFormPage';
import DashboardPage from './pages/DashboardPage';
import StaffPanel from './pages/StaffPanel';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import DiagnosticPage from './pages/DiagnosticPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useFirebaseAuth();
  
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
  const { user, profile, loading } = useFirebaseAuth();
  
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

// Component to expose debugging functions globally
const DebugExposer = () => {
  const { getUserCompletionStatus } = useFirebaseAuth();
  
  useEffect(() => {
    // Expose debugging functions globally
    if (typeof window !== 'undefined') {
      window.getUserCompletionStatus = getUserCompletionStatus;
    }
  }, [getUserCompletionStatus]);
  
  return null; // This component doesn't render anything
};

function App() {
  return (
    <FirebaseAuthProvider>
      <DebugExposer />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/role-login" element={<RoleLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          
          {/* User Flow Routes */}
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/instagram-connect" element={<ProtectedRoute><InstagramConnectPage /></ProtectedRoute>} />
          {/* <Route path="/instagram/callback" element={<InstagramCallbackPage />} /> Not needed in test mode */}
          <Route path="/requirements-form" element={<ProtectedRoute><RequirementsFormPage /></ProtectedRoute>} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          
          {/* Staff Panel */}
          <Route path="/staff" element={<RoleProtectedRoute allowedRoles={['staff', 'admin']}><StaffPanel /></RoleProtectedRoute>} />
          <Route path="/staff-dashboard" element={<RoleProtectedRoute allowedRoles={['staff']}><StaffDashboard /></RoleProtectedRoute>} />
          
          {/* Admin Panel */}
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminPanel /></RoleProtectedRoute>} />
          <Route path="/admin-dashboard" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminDashboard /></RoleProtectedRoute>} />
        </Routes>
        <Footer />
        <SupportChat />
      </Router>
    </FirebaseAuthProvider>
  );
}

export default App;
