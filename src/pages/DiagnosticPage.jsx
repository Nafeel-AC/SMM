import React, { useState } from 'react';
import { SupabaseDiagnostic } from '../lib/supabase-diagnostic';
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
      addLog('🔍 Starting Supabase diagnostic...');
      const diagnosticResults = await SupabaseDiagnostic.runFullDiagnostic();
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
      const quickResults = await SupabaseDiagnostic.quickTest();
      setResults(quickResults);
      addLog('✅ Quick test completed');
    } catch (error) {
      addLog('❌ Quick test failed: ' + error.message);
    } finally {
      console.log = originalLog;
      setRunning(false);
    }
  };

  return (
    <div className="diagnostic-page">
      <div className="diagnostic-container">
        <h1>🔍 Supabase Diagnostic Tool</h1>
        <p>This tool will help identify the root cause of your Supabase connection issues.</p>
        
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
            <li><strong>Config Error:</strong> Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
            <li><strong>Connection Error:</strong> Check internet connection and Supabase service status</li>
            <li><strong>Tables Missing:</strong> Run the SQL setup script in your Supabase dashboard</li>
            <li><strong>RLS Issues:</strong> Check Row Level Security policies in Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
