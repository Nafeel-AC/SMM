# Instagram App Configuration Verification

## Current Issue: "Invalid platform app" Error

This error occurs when trying to use Instagram Basic Display app credentials with Facebook Graph API endpoints.

## Quick Fix Steps:

### 1. Verify Your Instagram App Type
Your App ID `1489254978768389` should be configured as:
- **Instagram Basic Display** (NOT Facebook Login)
- Platform: Web
- Valid OAuth Redirect URIs: `https://smm-marketing.vercel.app/instagram/callback`

### 2. Check Meta Developer Console
Go to: https://developers.facebook.com/apps/1489254978768389
- Navigate to **Products** → **Instagram Basic Display** 
- Under **Basic Display Settings**:
  - ✅ Valid OAuth Redirect URIs: `https://smm-marketing.vercel.app/instagram/callback`
  - ✅ Deauthorize Callback URL: `https://smm-marketing.vercel.app/instagram/deauth`
  - ✅ Data Deletion Request URL: `https://smm-marketing.vercel.app/instagram/delete`

### 3. Verify Environment Variables in Vercel

In your Vercel dashboard → Project Settings → Environment Variables:

```bash
INSTAGRAM_APP_ID=1489254978768389
INSTAGRAM_APP_SECRET=d19c8b2f90e157a67c589c26658981b5
INSTAGRAM_REDIRECT_URI=https://smm-marketing.vercel.app/instagram/callback

# Also add these for client-side access:
VITE_INSTAGRAM_APP_ID=1489254978768389
VITE_INSTAGRAM_APP_SECRET=d19c8b2f90e157a67c589c26658981b5
VITE_INSTAGRAM_REDIRECT_URI=https://smm-marketing.vercel.app/instagram/callback
```

### 4. Test Local Environment Variables

Create a `.env.local` file for testing:
```bash
INSTAGRAM_APP_ID=1489254978768389
INSTAGRAM_APP_SECRET=d19c8b2f90e157a67c589c26658981b5
INSTAGRAM_REDIRECT_URI=http://localhost:5173/instagram/callback
```

### 5. Instagram App Permissions

Make sure your Instagram app has these permissions:
- `user_profile` - To read profile info  
- `user_media` - To read user's media

### 6. Test OAuth Flow

1. Go to: `https://api.instagram.com/oauth/authorize?client_id=1489254978768389&redirect_uri=https://smm-marketing.vercel.app/instagram/callback&scope=user_profile,user_media&response_type=code`

2. You should be redirected to Instagram login
3. After authorization, you should be redirected back to your callback with a `code` parameter

### 7. Common Issues

**"Invalid platform app"** = Wrong API endpoints for your app type
**"Invalid client_id"** = App ID not found or incorrect
**"Invalid redirect_uri"** = Redirect URI not whitelisted in app settings
**"Invalid scope"** = Requesting permissions not available for Basic Display API

## Quick Test Command

Test the OAuth URL directly in browser:
```
https://api.instagram.com/oauth/authorize?client_id=1489254978768389&redirect_uri=https://smm-marketing.vercel.app/instagram/callback&scope=user_profile,user_media&response_type=code&state=test
```

If this doesn't redirect to Instagram login, your app configuration is incorrect.
