import React from 'react';

const ServicesPage = () => {
  // BASIC TEST - This should definitely work
  console.log('🚀 BASIC TEST - SERVICES PAGE LOADED');
  
  // Test alert to see if component is working at all
  alert('Services Page is loading! Check console for logs.');
  
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>🧪 TEST PAGE</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>
        If you see this, the component is working!
      </p>
      <button 
        onClick={() => {
          console.log('🔍 BUTTON CLICKED');
          alert('Button clicked! Check console.');
        }}
        style={{
          padding: '20px 40px',
          fontSize: '20px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        🔍 Test Button
      </button>
      
      <div style={{ marginTop: '50px', padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
        <h3>Debug Information:</h3>
        <p>Component rendered at: {new Date().toLocaleTimeString()}</p>
        <p>User Agent: {navigator.userAgent}</p>
        <p>Window Width: {window.innerWidth}px</p>
        <p>Window Height: {window.innerHeight}px</p>
      </div>
    </div>
  );
};

export default ServicesPage;
