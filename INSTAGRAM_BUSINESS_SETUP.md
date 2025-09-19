# Instagram Business API - Frontend-Only Setup

## Overview

Since Instagram Basic Display API has been removed by Meta, we're using the **Instagram Business API** with **implicit flow** (frontend-only authentication). This approach works without a backend server.

## How It Works

1. **Implicit Flow**: Uses `response_type=token` instead of `response_type=code`
2. **Direct Token**: Access token is returned directly in the URL hash
3. **No Backend**: All authentication happens in the frontend
4. **Business Account Required**: User must have Instagram Business account connected to Facebook Page

## Prerequisites

- ✅ **Facebook App**: Already configured (App ID: 31610354805244877)
- ✅ **Instagram Business Account**: User must have Instagram Business account
- ✅ **Facebook Page**: Instagram Business account must be connected to a Facebook Page

## Setup Steps

### 1. Configure Facebook App OAuth Settings

1. **Go to your Facebook App**: https://developers.facebook.com/apps/31610354805244877/
2. **Navigate to "Facebook Login"** in the left sidebar
3. **Go to "Settings"** tab
4. **Add Valid OAuth Redirect URIs**:
   - `http://localhost:5173/instagram/callback` (development)
   - `https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram/callback` (production)
   - `https://yourdomain.com/instagram/callback` (production)

### 2. Configure Instagram Business API

1. **Go to "Instagram Business"** in the left sidebar
2. **Add Instagram Business** if not already added
3. **Configure permissions**:
   - `instagram_business_basic`
   - `instagram_business_manage_insights`

### 3. Add Instagram Testers

1. **Go to "Roles"** tab
2. **Add Instagram Testers** - add your Instagram Business account
3. **Accept the invitation** in your Instagram account

### 4. Environment Variables

Your `.env` file should have:
```bash
VITE_FB_APP_ID=31610354805244877
# For development:
VITE_FB_REDIRECT_URI=http://localhost:5173/instagram/callback

# For production (Vercel):
VITE_FB_REDIRECT_URI=https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram/callback
```

## User Requirements

For this to work, users must have:

1. **Instagram Business Account** (not personal account)
2. **Facebook Page** connected to their Instagram Business account
3. **Admin access** to the Facebook Page

## How the Flow Works

### 1. **Authentication Flow**
```
User clicks "Connect Instagram"
→ Redirects to Facebook OAuth with response_type=token
→ User authorizes app
→ Redirects back to /instagram/callback with access_token in URL hash
→ Frontend extracts token and finds Instagram Business account
→ Saves account + insights to Firestore
```

### 2. **Data Collection**
- **Real Data**: Instagram Business account ID, basic insights (if available)
- **Mock Data**: Detailed metrics (follower count, engagement rates, etc.)
- **Fallback**: If insights fail, uses calculated mock data

### 3. **Limitations**
- ⚠️ **Requires Business Account**: Personal Instagram accounts won't work
- ⚠️ **Limited Insights**: Some metrics may not be available
- ⚠️ **Mock Data**: Detailed analytics use calculated/mock data
- ⚠️ **Page Connection**: Instagram must be connected to Facebook Page

## Testing the Integration

1. **Start your app**: `npm run dev`
2. **Go to**: 
   - Development: `http://localhost:5173/instagram-connect`
   - Production: `https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram-connect`
3. **Click**: "Connect Instagram Account"
4. **Complete**: Facebook OAuth flow
5. **Check**: Dashboard shows connected account

## Troubleshooting

### Common Issues:

1. **"No Instagram Business account found"**
   - User needs Instagram Business account
   - Instagram must be connected to Facebook Page
   - User must be admin of the Facebook Page

2. **"No Facebook pages found"**
   - User needs to create a Facebook Page
   - Instagram Business account must be connected to the Page

3. **"Instagram insights not available"**
   - Some insights require app review
   - App falls back to mock data
   - This is normal for development

4. **"Invalid redirect_uri"**
   - Check OAuth redirect URIs in Facebook App settings
   - Ensure URL matches exactly (including http vs https)

## Production Deployment

1. **Update redirect URI** in Facebook App settings
2. **Set production environment variables**:
   ```bash
   VITE_FB_APP_ID=31610354805244877
   VITE_FB_REDIRECT_URI=https://yourdomain.com/instagram/callback
   ```
3. **Deploy** your frontend

## App Review (Optional)

For production with external users:
1. **Submit for App Review** to get advanced permissions
2. **Required for**: Serving users you don't own
3. **Skip if**: Only building for your own Instagram accounts

## Code Structure

### New Files:
- `src/lib/instagram-business-client.js` - Frontend-only Business API client
- Updated `src/pages/InstagramCallbackPage.jsx` - Handles implicit flow
- Updated `src/pages/InstagramConnectPage/InstagramConnectPage.jsx` - Uses Business API

### Key Functions:
```javascript
// Build OAuth URL with implicit flow
buildBusinessLoginUrl({ scopes: ['instagram_business_basic', 'instagram_business_manage_insights'] })

// Parse token from URL hash
parseBusinessCallback()

// Get Instagram Business account from Facebook Page
getInstagramBusinessAccount(accessToken)

// Get account insights (with fallback to mock data)
getAccountInsights(instagramAccountId, accessToken)

// Calculate insights from available data
calculateInsights(accountData, insightsData, mediaData)
```

## Next Steps

1. **Configure Facebook App OAuth settings**
2. **Add Instagram Business API product**
3. **Add Instagram testers**
4. **Test with your Instagram Business account**
5. **Deploy to production**

This approach works entirely in the frontend and doesn't require a backend server!


