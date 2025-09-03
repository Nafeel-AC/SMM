# Firebase Setup Guide

This project has been migrated from Supabase to Firebase. Follow these steps to set up Firebase for your project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "smm-marketing")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable other providers like Google, Facebook, etc.

## 3. Create Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## 4. Set up Security Rules (CRITICAL - Required)

In Firestore, go to "Rules" tab and replace the default rules with the comprehensive rules from `firestore.rules` file:

**Copy the entire content from `firestore.rules` file in your project root and paste it into the Firestore Rules editor.**

These rules provide:
- ✅ **Role-based access control** (user/staff/admin)
- ✅ **Staff assignment system** 
- ✅ **Payment management**
- ✅ **Support chat system**
- ✅ **Dashboard targets**
- ✅ **Complete security** matching your Supabase RLS policies

**Important**: Without these rules, your app will not work properly with role-based features!

## 5. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Enter an app nickname (e.g., "smm-marketing-web")
5. Click "Register app"
6. Copy the Firebase configuration object

## 6. Firebase Configuration

The Firebase configuration is already set up in `src/lib/firebase.js` with your project credentials:

- **Project ID**: smmv-6fb7c
- **Auth Domain**: smmv-6fb7c.firebaseapp.com
- **Storage Bucket**: smmv-6fb7c.firebasestorage.app

If you need to use environment variables instead, you can modify `src/lib/firebase.js` to use:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

## 7. Install Dependencies

The Firebase SDK is already installed. If you need to reinstall:

```bash
npm install firebase
```

## 8. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to register a new account
3. Check the Firebase Console to see if the user appears in Authentication
4. Check Firestore to see if a profile document is created

## 9. Data Migration (If Needed)

If you have existing data in Supabase that you want to migrate:

1. Export your data from Supabase
2. Use the Firebase Admin SDK or Firebase CLI to import the data
3. Update the data structure to match Firestore's document-based format

## 10. Production Setup

For production:

1. Update Firestore security rules to be more restrictive
2. Set up Firebase Hosting (optional)
3. Configure custom domain (optional)
4. Set up monitoring and alerts
5. Enable Firebase App Check for additional security

## Troubleshooting

### Common Issues:

1. **Authentication not working**: Check that Email/Password is enabled in Firebase Console
2. **Database permission denied**: Check your Firestore security rules
3. **Environment variables not loading**: Make sure your `.env` file is in the project root and variables start with `VITE_`
4. **CORS errors**: Firebase handles CORS automatically, but check your domain configuration

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## Migration Notes

This project was migrated from Supabase to Firebase. The main changes include:

- Authentication: Supabase Auth → Firebase Auth
- Database: Supabase PostgreSQL → Firestore
- Real-time: Supabase Realtime → Firestore real-time listeners
- Storage: Supabase Storage → Firebase Storage (if needed)

All the core functionality remains the same, but the underlying services have been changed to Firebase.
