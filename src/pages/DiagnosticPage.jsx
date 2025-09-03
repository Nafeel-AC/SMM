import React, { useState } from 'react';
import { FirebaseDiagnostic } from '../lib/firebase-diagnostic';
import { createDefaultUsers } from '../lib/create-admin-user';
import { addDashboardSampleData } from '../lib/add-dashboard-sample-data';
import './DiagnosticPage.css';

const DiagnosticPage = () => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message }]);
  };

  const runDiagnostic = async () => {
    setRunning(true);
    setResults(null);
    setLogs([]);
    
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      addLog('❌ ' + args.join(' '));
      originalError(...args);
    };
    
    try {
      addLog('🔍 Starting Firebase diagnostic...');
      const diagnosticResults = await FirebaseDiagnostic.runFullDiagnostic();
      setResults(diagnosticResults);
      addLog('✅ Diagnostic completed');
    } catch (error) {
      addLog('❌ Diagnostic failed: ' + error.message);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setRunning(false);
    }
  };

  const runQuickTest = async () => {
    setRunning(true);
    setResults(null);
    setLogs([]);
    
    const originalLog = console.log;
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };
    
    try {
      addLog('⚡ Running quick test...');
      const quickResults = await FirebaseDiagnostic.quickTest();
      setResults(quickResults);
      addLog('✅ Quick test completed');
    } catch (error) {
      addLog('❌ Quick test failed: ' + error.message);
    } finally {
      console.log = originalLog;
      setRunning(false);
    }
  };

  const createDefaultAdminAndStaff = async () => {
    setRunning(true);
    setResults(null);
    setLogs([]);
    
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      addLog('❌ ' + args.join(' '));
      originalError(...args);
    };
    
    try {
      addLog('🔐 Creating default admin and staff users...');
      const result = await createDefaultUsers();
      
      if (result.admin.success && result.staff.success) {
        addLog('✅ Admin and staff users created successfully!');
        addLog('👑 Admin: admin@example.com / admin123');
        addLog('👥 Staff: staff@example.com / staff123');
        setResults({
          success: true,
          message: 'Default users created successfully',
          admin: result.admin.credentials,
          staff: result.staff.credentials
        });
      } else {
        addLog('❌ Error creating users');
        setResults({
          success: false,
          message: 'Error creating users',
          errors: result
        });
      }
    } catch (error) {
      addLog('❌ Error creating users: ' + error.message);
      setResults({
        success: false,
        message: 'Error creating users',
        error: error.message
      });
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setRunning(false);
    }
  };

  const addSampleData = async () => {
    setRunning(true);
    setResults(null);
    setLogs([]);
    
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      addLog('❌ ' + args.join(' '));
      originalError(...args);
    };
    
    try {
      addLog('📊 Adding sample data to database...');
      const result = await addDashboardSampleData();
      
      if (result.success) {
        addLog('✅ Sample data added successfully!');
        setResults({
          success: true,
          message: 'Sample data added successfully'
        });
      } else {
        addLog('❌ Error adding sample data');
        setResults({
          success: false,
          message: 'Error adding sample data',
          error: result.error
        });
      }
    } catch (error) {
      addLog('❌ Error adding sample data: ' + error.message);
      setResults({
        success: false,
        message: 'Error adding sample data',
        error: error.message
      });
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setRunning(false);
    }
  };

  const checkAdminProfile = async () => {
    setRunning(true);
    setResults(null);
    setLogs([]);
    
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      addLog('❌ ' + args.join(' '));
      originalError(...args);
    };
    
    try {
      addLog('🔍 Checking admin profile...');
      
      // Import Firebase functions
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const { getApp } = await import('firebase/app');
      
      // Use existing Firebase app instead of creating new one
      const app = getApp();
      const auth = getAuth(app);
      const db = getFirestore(app);
      
      addLog('🔐 Signing in as admin...');
      const userCredential = await signInWithEmailAndPassword(auth, 'admin@example.com', 'admin123');
      const user = userCredential.user;
      addLog('✅ Signed in as: ' + user.email + ' UID: ' + user.uid);
      
      addLog('📋 Fetching profile...');
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const profile = profileSnap.data();
        addLog('✅ Profile found:');
        addLog('  Role: ' + profile.role);
        addLog('  Email: ' + profile.email);
        addLog('  Display Name: ' + profile.display_name);
        addLog('  Full Profile: ' + JSON.stringify(profile, null, 2));
        
        setResults({
          success: true,
          message: 'Admin profile found',
          profile: profile
        });
      } else {
        addLog('❌ No profile found for user');
        setResults({
          success: false,
          message: 'No profile found for admin user'
        });
      }
    } catch (error) {
      addLog('❌ Error checking admin profile: ' + error.message);
      setResults({
        success: false,
        message: 'Error checking admin profile',
        error: error.message
      });
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setRunning(false);
    }
  };

  return (
    <div className="diagnostic-page">
      <div className="diagnostic-container">
        <h1>🔍 Firebase Diagnostic Tool</h1>
        <p>This tool will help identify the root cause of your Firebase connection issues.</p>
        
        <div className="diagnostic-actions">
          <button 
            className="diagnostic-btn primary"
            onClick={runDiagnostic}
            disabled={running}
          >
            {running ? 'Running...' : 'Run Full Diagnostic'}
          </button>
          
          <button 
            className="diagnostic-btn secondary"
            onClick={runQuickTest}
            disabled={running}
          >
            {running ? 'Running...' : 'Quick Test'}
          </button>

          <button 
            className="diagnostic-btn admin"
            onClick={createDefaultAdminAndStaff}
            disabled={running}
          >
            {running ? 'Creating...' : 'Create Admin & Staff'}
          </button>

          <button 
            className="diagnostic-btn data"
            onClick={addSampleData}
            disabled={running}
          >
            {running ? 'Adding...' : 'Add Sample Data'}
          </button>

          <button 
            className="diagnostic-btn profile"
            onClick={checkAdminProfile}
            disabled={running}
          >
            {running ? 'Checking...' : 'Check Admin Profile'}
          </button>
        </div>
        
        {logs.length > 0 && (
          <div className="diagnostic-logs">
            <h3>📋 Diagnostic Logs:</h3>
            <div className="logs-container">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-time">[{log.timestamp}]</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results && (
          <div className="diagnostic-results">
            <h3>📊 Results:</h3>
            <pre className="results-json">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="diagnostic-help">
          <h3>💡 Common Issues & Solutions:</h3>
          <ul>
            <li><strong>Config Error:</strong> Check your .env file for Firebase configuration</li>
            <li><strong>Connection Error:</strong> Check internet connection and Firebase service status</li>
            <li><strong>Collections Missing:</strong> Check Firestore collections and security rules</li>
            <li><strong>Auth Issues:</strong> Check Firebase Authentication configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
