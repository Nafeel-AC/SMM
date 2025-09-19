# Frontend-Only Instagram Integration Setup

## Overview

This setup uses **Instagram Basic Display API** which allows frontend-only authentication without requiring a backend server for token exchange. This is perfect for static sites or when you want to avoid backend complexity.

## Important Limitations

⚠️ **Instagram Basic Display API has limitations:**
- **No detailed insights**: Cannot access follower count, engagement rates, reach, impressions, etc.
- **Limited to personal accounts**: Cannot access business account insights
- **Basic metrics only**: Only provides media count and basic profile info
- **Mock data required**: For dashboard metrics, we use calculated/mock data

## Setup Steps

### 1. Configure Instagram Basic Display API

1. Go to your Meta App Dashboard: https://developers.facebook.com/apps/31610354805244877/
2. Navigate to **Instagram Basic Display** in the left sidebar
3. Click **Create New App** if not already created
4. Fill in:
   - **App Name**: SMM-IG-Basic
   - **App Contact Email**: your-email@example.com
   - **Privacy Policy URL**: https://yourdomain.com/privacy
   - **Terms of Service URL**: https://yourdomain.com/terms

### 2. Get Instagram Client ID

1. In Instagram Basic Display settings, copy your **Instagram App ID**
2. Add it to your `.env` file:
   ```bash
   VITE_IG_CLIENT_ID=your_instagram_app_id_here
   ```

### 3. Configure OAuth Redirect URI

1. In Instagram Basic Display settings, add your redirect URI:
   - **Development**: `http://localhost:5173/instagram/callback`
   - **Production**: `https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram/callback`
   - **Production**: `https://yourdomain.com/instagram/callback`

### 4. Add Instagram Testers

1. Go to **Roles** tab in your Meta App Dashboard
2. Add Instagram accounts as **Instagram Testers**
3. Accept the invitation in your Instagram account

### 5. Update Environment Variables

Update your `.env` file with the Instagram Basic Display configuration:

```bash
# Instagram Basic Display API (Frontend-Only)
VITE_IG_CLIENT_ID=your_instagram_app_id_here
# For development:
VITE_IG_REDIRECT_URI=http://localhost:5173/instagram/callback

# For production (Vercel):
VITE_IG_REDIRECT_URI=https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram/callback

# For production:
# VITE_IG_REDIRECT_URI=https://yourdomain.com/instagram/callback
```

## How It Works

### 1. **Authentication Flow**
```javascript
// User clicks "Connect Instagram"
// → Redirects to Instagram OAuth
// → User authorizes app
// → Redirects back to /instagram/callback with code
// → Frontend exchanges code for access token (no backend needed)
// → Saves account + basic insights to Firestore
```

### 2. **Data Collection**
- **Real Data**: Instagram profile info, media list, basic account details
- **Mock Data**: Follower count, engagement rates, reach, impressions (calculated)

### 3. **Dashboard Display**
The dashboard shows:
- **Real metrics**: Media count, username, account type
- **Calculated metrics**: Engagement rates, follower estimates, reach estimates
- **Mock data**: Detailed insights (since Basic Display API doesn't provide them)

## Code Structure

### New Files Created:
- `src/lib/instagram-basic-display.js` - Frontend-only Instagram API client
- `src/pages/InstagramCallbackPage.jsx` - Handles OAuth callback
- Updated `src/pages/InstagramConnectPage/InstagramConnectPage.jsx` - Uses Basic Display API

### Key Functions:
```javascript
// Build OAuth URL
buildBasicDisplayLoginUrl({ scopes: ['user_profile', 'user_media'] })

// Exchange code for token (frontend-only)
exchangeCodeForToken(code)

// Get user profile
getUserProfile(accessToken)

// Get user media
getUserMedia(accessToken, limit)

// Calculate basic metrics (with mock data for insights)
calculateBasicMetrics(mediaData)
```

## Testing the Integration

1. **Start the app**: `npm run dev`
2. **Go to**: 
   - Development: `http://localhost:5173/instagram-connect`
   - Production: `https://smm-git-instagram-integration-nafeelmannan-gmailcoms-projects.vercel.app/instagram-connect`
3. **Click**: "Connect Instagram Account"
4. **Complete**: Instagram OAuth flow
5. **Check**: Dashboard shows connected account with basic metrics

## Production Deployment

1. **Update redirect URI** in Instagram Basic Display settings
2. **Set production environment variables**:
   ```bash
   VITE_IG_CLIENT_ID=your_production_app_id
   VITE_IG_REDIRECT_URI=https://yourdomain.com/instagram/callback
   ```
3. **Deploy** your frontend to your hosting platform

## Limitations & Workarounds

### What's Missing:
- Real follower count
- Real engagement rates
- Real reach/impressions data
- Business account insights
- Detailed analytics

### Workarounds:
- Use **mock data** for dashboard display
- Calculate **estimated metrics** from available data
- Show **"Demo Mode"** indicators
- Implement **sample data** for testing

## Alternative: Upgrade to Business API

If you need real insights data, you'll need to:

1. **Switch to Instagram Business API** (requires backend)
2. **Use Facebook Login** instead of Instagram Basic Display
3. **Implement backend token exchange** (secure server required)
4. **Get App Review** for production use

## Troubleshooting

### Common Issues:

1. **"Missing VITE_IG_CLIENT_ID"**
   - Check your `.env` file
   - Ensure Instagram Basic Display app is created

2. **"Invalid redirect_uri"**
   - Verify redirect URI matches exactly in Instagram Basic Display settings
   - Check for trailing slashes or http vs https

3. **"No access token received"**
   - Check Instagram Basic Display app configuration
   - Ensure testers are added and accepted

4. **"Failed to fetch user profile"**
   - Token might be expired
   - Check Instagram account permissions

## Next Steps

1. **Set up Instagram Basic Display API** in Meta App Dashboard
2. **Configure environment variables** in `.env`
3. **Test the integration** with your Instagram account
4. **Deploy to production** with proper redirect URIs
5. **Consider upgrading** to Business API if you need real insights data

This frontend-only approach is perfect for MVP/demo purposes, but for production with real business insights, you'll need the Instagram Business API with a backend server.


