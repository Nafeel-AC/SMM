// Firebase diagnostic utilities
// This file provides diagnostic functionality for Firebase services

import { auth, db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { 
  signInAnonymously, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

export const FirebaseDiagnostic = {
  // Run a full diagnostic test
  async runFullDiagnostic() {
    const results = {
      timestamp: new Date().toISOString(),
      tests: {},
      overall: 'unknown'
    };

    try {
      // Test Firebase Auth
      results.tests.auth = await this.testAuth();
      
      // Test Firestore
      results.tests.firestore = await this.testFirestore();
      
      // Test Configuration
      results.tests.config = await this.testConfiguration();
      
      // Determine overall status
      const allPassed = Object.values(results.tests).every(test => test.status === 'pass');
      results.overall = allPassed ? 'pass' : 'fail';
      
      return results;
    } catch (error) {
      results.overall = 'error';
      results.error = error.message;
      return results;
    }
  },

  // Quick test for basic connectivity
  async quickTest() {
    const results = {
      timestamp: new Date().toISOString(),
      tests: {},
      overall: 'unknown'
    };

    try {
      // Quick auth test
      results.tests.auth = await this.testAuthQuick();
      
      // Quick firestore test
      results.tests.firestore = await this.testFirestoreQuick();
      
      const allPassed = Object.values(results.tests).every(test => test.status === 'pass');
      results.overall = allPassed ? 'pass' : 'fail';
      
      return results;
    } catch (error) {
      results.overall = 'error';
      results.error = error.message;
      return results;
    }
  },

  // Test Firebase Authentication
  async testAuth() {
    try {
      console.log('🔐 Testing Firebase Authentication...');
      
      // Check if auth is initialized
      if (!auth) {
        return { status: 'fail', message: 'Firebase Auth not initialized' };
      }

      // Test anonymous sign in
      const userCredential = await signInAnonymously(auth);
      console.log('✅ Anonymous sign in successful');
      
      // Test sign out
      await signOut(auth);
      console.log('✅ Sign out successful');
      
      return { 
        status: 'pass', 
        message: 'Firebase Auth working correctly',
        details: {
          currentUser: auth.currentUser?.uid || 'none',
          authInitialized: !!auth
        }
      };
    } catch (error) {
      console.error('❌ Auth test failed:', error);
      return { 
        status: 'fail', 
        message: `Auth test failed: ${error.message}`,
        error: error.code || 'unknown'
      };
    }
  },

  // Quick auth test
  async testAuthQuick() {
    try {
      if (!auth) {
        return { status: 'fail', message: 'Firebase Auth not initialized' };
      }
      
      return { 
        status: 'pass', 
        message: 'Firebase Auth initialized',
        details: { authInitialized: !!auth }
      };
    } catch (error) {
      return { 
        status: 'fail', 
        message: `Auth quick test failed: ${error.message}` 
      };
    }
  },

  // Test Firestore
  async testFirestore() {
    try {
      console.log('🗄️ Testing Firestore...');
      
      // Check if db is initialized
      if (!db) {
        return { status: 'fail', message: 'Firestore not initialized' };
      }

      // Test reading from a collection
      const testCollection = collection(db, 'diagnostic_test');
      const testQuery = query(testCollection, limit(1));
      const snapshot = await getDocs(testQuery);
      console.log('✅ Firestore read test successful');

      // Test writing to a collection
      const testDoc = await addDoc(testCollection, {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Firebase diagnostic test'
      });
      console.log('✅ Firestore write test successful');

      // Test updating a document
      await updateDoc(testDoc, {
        updated: true,
        updateTimestamp: new Date().toISOString()
      });
      console.log('✅ Firestore update test successful');

      // Test deleting a document
      await deleteDoc(testDoc);
      console.log('✅ Firestore delete test successful');

      return { 
        status: 'pass', 
        message: 'Firestore working correctly',
        details: {
          dbInitialized: !!db,
          readTest: 'pass',
          writeTest: 'pass',
          updateTest: 'pass',
          deleteTest: 'pass'
        }
      };
    } catch (error) {
      console.error('❌ Firestore test failed:', error);
      return { 
        status: 'fail', 
        message: `Firestore test failed: ${error.message}`,
        error: error.code || 'unknown'
      };
    }
  },

  // Quick Firestore test
  async testFirestoreQuick() {
    try {
      if (!db) {
        return { status: 'fail', message: 'Firestore not initialized' };
      }

      // Just test if we can create a collection reference
      const testCollection = collection(db, 'diagnostic_test');
      
      return { 
        status: 'pass', 
        message: 'Firestore initialized',
        details: { dbInitialized: !!db }
      };
    } catch (error) {
      return { 
        status: 'fail', 
        message: `Firestore quick test failed: ${error.message}` 
      };
    }
  },

  // Test Firebase configuration
  async testConfiguration() {
    try {
      console.log('⚙️ Testing Firebase configuration...');
      
      const config = {
        auth: !!auth,
        firestore: !!db,
        projectId: db?.app?.options?.projectId || 'unknown',
        apiKey: db?.app?.options?.apiKey ? 'present' : 'missing'
      };

      const hasRequiredConfig = config.auth && config.firestore && config.projectId !== 'unknown';
      
      if (hasRequiredConfig) {
        return { 
          status: 'pass', 
          message: 'Firebase configuration looks good',
          details: config
        };
      } else {
        return { 
          status: 'fail', 
          message: 'Firebase configuration incomplete',
          details: config
        };
      }
    } catch (error) {
      console.error('❌ Configuration test failed:', error);
      return { 
        status: 'fail', 
        message: `Configuration test failed: ${error.message}` 
      };
    }
  }
};

// Auto-run basic diagnostic in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Firebase diagnostic module loaded');
}
