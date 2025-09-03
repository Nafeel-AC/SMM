// Script to create admin user in Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase config (from src/lib/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyBvQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q",
  authDomain: "smmv-6fb7c.firebaseapp.com",
  projectId: "smmv-6fb7c",
  storageBucket: "smmv-6fb7c.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@example.com', 
      'admin123'
    );
    
    const user = userCredential.user;
    console.log('✅ Auth user created:', user.uid);
    
    // Create admin profile in Firestore
    const adminProfile = {
      uid: user.uid,
      email: 'admin@example.com',
      role: 'admin',
      display_name: 'System Admin',
      created_at: new Date().toISOString(),
      permissions: ['manage_users', 'manage_staff', 'view_all_data', 'create_staff']
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'profiles', user.uid), adminProfile);
    
    console.log('✅ Admin profile created in Firestore');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('🎯 Role: Admin');
    console.log('🆔 UID:', user.uid);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

// Run the function
createAdminUser();
