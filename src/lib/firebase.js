import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeyOmKCTJEc6eNAfEtQBSE3k_ZTCpNVJQ",
  authDomain: "smmv-6fb7c.firebaseapp.com",
  projectId: "smmv-6fb7c",
  storageBucket: "smmv-6fb7c.firebasestorage.app",
  messagingSenderId: "991669430866",
  appId: "1:991669430866:web:c2dada61a44790e306cd8b"
};

console.log('🔧 Firebase config loaded for project:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Make Firebase services available globally for console diagnostics
if (typeof window !== 'undefined') {
  window.firebase = { auth, db, storage, analytics };
}

console.log('✅ Firebase initialized successfully');

export default app;
