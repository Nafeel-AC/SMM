# Instagram Integration Fix Guide

## Issue

You're getting errors when trying to connect Instagram accounts:
1. "No authorization code received from Instagram" 
2. 404 NOT_FOUND errors from Supabase

## Root Cause

The issues were caused by:
1. **Wrong OAuth Flow**: Using Facebook OAuth instead of Instagram Basic Display API
2. **Missing database tables** (`instagram_insights`)
3. **Missing database column** (`instagram_connected` in profiles table)
4. **Incorrect API endpoints** in the serverless function

## Recent Fixes Applied

### ✅ Fixed OAuth Flow
- Updated to use Instagram Basic Display API (`https://api.instagram.com/oauth/authorize`)
- Fixed serverless function to use correct Instagram token exchange endpoint
- Updated scopes to `user_profile,user_media` (Basic Display API)

### ✅ Fixed Database Schema
- Added missing `instagram_insights` table
- Added `instagram_connected` column to profiles table
- Created proper RLS policies for security

### ✅ Updated API Integration
- Switched from Facebook Pages approach to Instagram Basic Display API
- Updated token exchange to use Instagram endpoints
- Improved error handling and logging

## Solution Steps

### Step 1: Run Database Migration
1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `jjbbpjteedaidhgxftqg`
3. Go to **SQL Editor**
4. Copy and paste the contents of `sql/instagram_migration.sql`
5. Click **Run** to execute the migration

### Step 2: Update Instagram App Settings
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Navigate to your Instagram app (App ID: 1489254978768389)
3. Go to **Products** → **Instagram Basic Display**
4. Under **Basic Display Settings**, verify:
   - **Valid OAuth Redirect URIs**: `https://smm-marketing.vercel.app/instagram/callback`
   - **Deauthorize Callback URL**: `https://smm-marketing.vercel.app/instagram/deauth`
   - **Data Deletion Request URL**: `https://smm-marketing.vercel.app/instagram/delete`

### Step 3: Deploy Latest Changes
1. Commit and push the latest changes to your repository
2. Deploy to Vercel (should auto-deploy from main branch)
3. Verify environment variables are set in Vercel

### Step 4: Test the Integration
1. Navigate to your deployed app: https://smm-marketing.vercel.app
2. Try connecting an Instagram account
3. Check browser console for detailed logs
4. Monitor the OAuth flow:
   - Click "Connect Instagram" → Should redirect to Instagram
   - Complete Instagram auth → Should redirect to your callback URL
   - Callback should process and save data to database

## Important Notes

### ⚠️ Instagram Basic Display API Limitations
The current implementation uses Instagram Basic Display API, which has limited data access:
- ✅ **Available**: User profile (ID, username), Media list
- ❌ **Not Available**: Followers count, likes count, comments count, insights metrics

For full business insights (followers, engagement metrics, etc.), you would need:
1. **Instagram Graph API** (requires Business account connected to Facebook Page)
2. **App Review** from Meta for additional permissions

### 🔄 Current Functionality
- ✅ Instagram account connection
- ✅ Basic profile information storage
- ✅ Media list retrieval
- ⚠️ Limited insights (only media count available)

## Environment Variables Check

Make sure these are set in your Vercel environment variables:

```
VITE_SUPABASE_URL=https://jjbbpjteedaidhgxftqg.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_INSTAGRAM_APP_ID=1489254978768389
VITE_INSTAGRAM_APP_SECRET=d19c8b2f90e157a67c589c26658981b5
VITE_INSTAGRAM_REDIRECT_URI=https://smm-marketing.vercel.app/instagram/callback
```

## Debugging Tips

1. Open browser dev tools and check the Console for detailed logs
2. Check the Network tab to see which API calls are failing
3. Look at Supabase logs in the dashboard for database errors
4. The callback page now includes detailed console logging for each step

## Common Issues

- **CORS errors**: Check that your domain is whitelisted in Supabase
- **RLS policy errors**: Ensure policies allow authenticated users to access their own data
- **"No code" errors**: Usually means Instagram OAuth redirect failed - check app settings
- **Token exchange errors**: Verify app secret is correctly set in environment variables

## Test in Development

Before testing in production, you can test locally:

1. Update `VITE_INSTAGRAM_REDIRECT_URI` to `http://localhost:5173/instagram/callback`
2. Add this URL to your Instagram app's Valid OAuth Redirect URIs
3. Test the full flow locally
