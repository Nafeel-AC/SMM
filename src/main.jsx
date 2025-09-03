import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'
import './lib/console-diagnostic.js'
import './lib/test-instagram-connection.js'
import { addSampleData } from './lib/add-sample-data.js'
import { firebaseDb } from './lib/firebase-db.js'
import App from './App.jsx'

// Make debugging functions available globally
if (typeof window !== 'undefined') {
  window.checkUserData = async (userId) => {
    console.log('🔍 Checking data for user:', userId);
    
    try {
      const insights = await firebaseDb.getInstagramInsights(userId);
      const account = await firebaseDb.getInstagramAccount(userId);
      const profile = await firebaseDb.getProfile(userId);
      
      console.log('📊 Instagram Insights:', insights);
      console.log('📱 Instagram Account:', account);
      console.log('👤 User Profile:', profile);
      
      return { insights, account, profile };
    } catch (error) {
      console.error('❌ Error checking user data:', error);
      return { error };
    }
  };
  
  window.checkCompletionStatus = () => {
    console.log('🔍 Checking user completion status...');
    // This will be available after the auth context is loaded
    if (window.getUserCompletionStatus) {
      const status = window.getUserCompletionStatus();
      console.log('📋 Completion Status:', status);
      return status;
    } else {
      console.log('⚠️ Auth context not loaded yet. Try again in a moment.');
      return null;
    }
  };
  
  window.markPaymentCompleted = async (userId) => {
    console.log('💳 Manually marking payment as completed for user:', userId);
    try {
      const result = await firebaseDb.updateProfile(userId, {
        payment_completed: true,
        updated_at: new Date().toISOString()
      });
      console.log('✅ Payment marked as completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Error marking payment as completed:', error);
      return { error };
    }
  };
  
  window.firebaseDb = firebaseDb;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
