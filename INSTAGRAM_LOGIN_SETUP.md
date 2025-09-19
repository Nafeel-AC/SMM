# Instagram Login API - Frontend-Only Setup

## Overview

We're using **Instagram Login API** with **implicit flow** for frontend-only authentication. This is the simplest approach that works without a backend server.

## How It Works

1. **Implicit Flow**: Uses `response_type=token` instead of `response_type=code`
2. **Direct Token**: Access token is returned directly in the URL hash
3. **No Backend**: All authentication happens in the frontend
4. **Instagram API**: Uses official Instagram Graph API

## Setup Steps

### 1. Configure Instagram Login API

1. **Go to your Meta App Dashboard**: https://developers.facebook.com/apps/31610354805244877/
2. **Navigate to "Instagram"** in the left sidebar
3. **Click "API setup with Instagram login"**
4. **Configure the following**:
   - **Valid OAuth Redirect URIs**: 
     - `http://localhost:5173/instagram/callback` (development)
     - `https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram/callback` (production)
     - `https://yourdomain.com/instagram/callback` (production)
   - **Deauthorize Callback URL**: Optional
   - **Data Deletion Request URL**: Optional

### 2. Get Instagram Client ID

1. **In the Instagram Login setup**, you'll see your **Instagram App ID**
2. **Copy this ID** and add it to your `.env` file:
   ```bash
   VITE_IG_CLIENT_ID=1095837746065727
   ```

### 3. **Required Permissions/Scopes**

The app requests these Instagram permissions:
- `instagram_business_basic` - Basic account information
- `instagram_business_content_publish` - Publish content
- `instagram_business_manage_comments` - Manage comments
- `instagram_business_manage_messages` - Manage messages

### 4. Add Instagram Testers

1. **Go to "Roles"** tab in your app
2. **Add Instagram Testers** - add your Instagram account
3. **Accept the invitation** in your Instagram account

### 5. Environment Variables

Update your `.env` file:
```bash
VITE_IG_CLIENT_ID=1095837746065727
# For development:
VITE_IG_REDIRECT_URI=http://localhost:5173/instagram/callback

# For production (Vercel):
VITE_IG_REDIRECT_URI=https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram/callback
```

## How the Flow Works

### 1. **Authentication Flow**
```
User clicks "Connect Instagram"
→ Redirects to Instagram OAuth with response_type=token
→ User authorizes app
→ Redirects back to /instagram/callback with access_token in URL hash
→ Frontend extracts token and fetches Instagram data
→ Saves account + insights to Firestore
```

### 2. **Data Collection**
- **Real Data**: Instagram profile info, media list, basic account details
- **Mock Data**: Detailed insights (follower count, engagement rates, etc.)
- **Fallback**: If API calls fail, uses calculated mock data

### 3. **Limitations**
- ⚠️ **Limited Insights**: Instagram Login doesn't provide detailed analytics
- ⚠️ **Mock Data**: Dashboard shows calculated/estimated metrics
- ⚠️ **Basic Access**: Only profile and media data available

## Testing the Integration

1. **Start your app**: `npm run dev`
2. **Go to**: 
   - Development: `http://localhost:5173/instagram-connect`
   - Production: `https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram-connect`
3. **Click**: "Connect Instagram Account"
4. **Complete**: Instagram OAuth flow
5. **Check**: Dashboard shows connected account with basic metrics

## **Important Notes:**

- ⚠️ **Instagram Login requires backend** - Authorization code flow needs server to exchange code for token
- ⚠️ **Frontend-only limitation** - Cannot exchange authorization code without app secret
- ✅ **Demo mode available** - Uses mock data when backend is not available
- ⚠️ **Cannot access ads or tagging** - Instagram Login API limitations
- ✅ **Uses new scope values** - Updated to comply with Meta's requirements (deprecation Jan 27, 2025)

## **Backend Requirement:**

Instagram Login uses **authorization code flow** which requires:
1. **Backend server** to exchange authorization code for access token
2. **App secret** (must be kept secure on server)
3. **Token exchange endpoint** to handle the OAuth flow

### **For Frontend-Only Demo:**
- ✅ **Authorization flow works** - User can authorize the app
- ✅ **Mock data displayed** - Dashboard shows calculated metrics
- ✅ **Perfect for testing** - Shows complete user experience

## Code Structure

### New Files:
- `src/lib/instagram-login-client.js` - Frontend-only Instagram Login client
- Updated `src/pages/InstagramCallbackPage.jsx` - Handles implicit flow
- Updated `src/pages/InstagramConnectPage/InstagramConnectPage.jsx` - Uses Instagram Login

### Key Functions:
```javascript
// Build OAuth URL with implicit flow
buildInstagramLoginUrl({ scopes: ['instagram_business_basic', 'instagram_business_content_publish', 'instagram_business_manage_comments', 'instagram_business_manage_messages'] })

// Parse token from URL hash
parseInstagramCallback()

// Get Instagram profile
getInstagramProfile(accessToken)

// Get Instagram media
getInstagramMedia(accessToken, limit)

// Get basic insights (limited data)
getBasicInsights(accessToken)

// Calculate insights from available data
calculateInstagramInsights(profileData, insightsData, mediaData)
```

## Production Deployment

1. **Update redirect URI** in Instagram Login settings
2. **Set production environment variables**:
   ```bash
   VITE_IG_CLIENT_ID=your_production_app_id
   VITE_IG_REDIRECT_URI=https://yourdomain.com/instagram/callback
   ```
3. **Deploy** your frontend

## Troubleshooting

### Common Issues:

1. **"Missing VITE_IG_CLIENT_ID"**
   - Check your `.env` file
   - Ensure Instagram Login is configured in Meta App Dashboard

2. **"Invalid redirect_uri"**
   - Verify redirect URI matches exactly in Instagram Login settings
   - Check for trailing slashes or http vs https

3. **"No access token received"**
   - Check Instagram Login app configuration
   - Ensure testers are added and accepted

4. **"Failed to fetch Instagram profile"**
   - Token might be expired
   - Check Instagram account permissions

## What You'll See in Dashboard

The dashboard will display:
- **Real metrics**: Instagram username, media count, account type
- **Mock metrics**: Follower count, engagement rates, reach, impressions
- **All UI components**: Same dashboard layout as before

## Next Steps

1. **Configure Instagram Login API** in Meta App Dashboard
2. **Get your Instagram App ID** and add to `.env`
3. **Add Instagram testers**
4. **Test the integration** with your Instagram account
5. **Deploy to production** with proper redirect URIs

This approach is perfect for MVP/demo purposes and works entirely in the frontend!
