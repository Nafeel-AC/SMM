# Instagram Integration Fix Guide

## Issue

You're getting errors when trying to connect Instagram accounts:
1. "Invalid platform app" error 
2. "No authorization code received from Instagram"
3. API permission issues

## Root Cause

The issues were caused by:
1. **App Configuration Mismatch**: App was configured for Basic Display but code was trying to use Graph API
2. **Missing Business Account Setup**: Instagram Graph API requires Instagram Business account connected to Facebook Page
3. **Wrong OAuth Flow**: Need to use Facebook OAuth for Instagram Graph API access

## Current Setup: Instagram Graph API

### ✅ What We're Using Now
- **Instagram Graph API** (not Basic Display API)
- **Facebook OAuth flow** for authentication
- **Business account access** through Facebook Pages
- **Full insights and metrics** available

### ⚠️ Requirements for Instagram Graph API
1. **Facebook App** with Instagram Graph API product enabled
2. **Instagram Business Account** (not personal account)
3. **Facebook Page** connected to the Instagram Business account
4. **Proper permissions**: `instagram_basic`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`

## Solution Steps

### Step 1: Verify Facebook App Configuration
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Navigate to your app (App ID: 1489254978768389)
3. Under **Products**, ensure you have:
   - ✅ **Instagram Graph API** (not Basic Display)
   - ✅ **Facebook Login**
4. Under **Instagram Graph API** → **Settings**:
   - **Valid OAuth Redirect URIs**: `https://smm-marketing.vercel.app/instagram/callback`

### Step 2: Instagram Business Account Setup
⚠️ **Critical**: Users must have:
1. **Instagram Business Account** (not personal)
2. **Facebook Page** created and connected to Instagram Business account
3. **Admin access** to both the Facebook Page and Instagram Business account

### Step 3: Run Database Migration
1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `jjbbpjteedaidhgxftqg`
3. Go to **SQL Editor**
4. Copy and paste the contents of `sql/instagram_migration.sql`
5. Click **Run** to execute the migration

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
