# Instagram Business Account Setup Guide

## ⚠️ Important: Instagram Graph API Requirements

Our SMM platform uses **Instagram Graph API** to provide comprehensive business insights. This requires specific account setup that differs from personal Instagram usage.

## Prerequisites for Users

### 🏢 What You Need:
1. **Instagram Business Account** (not personal account)
2. **Facebook Page** (business page on Facebook)
3. **Connected accounts** (Instagram Business account linked to Facebook Page)
4. **Admin permissions** on both accounts

### 📊 What You Get:
- Complete follower analytics
- Engagement rate calculations
- Post performance metrics
- Audience demographics
- Growth tracking

## Step-by-Step User Setup

### Step 1: Convert to Instagram Business Account

**If you have a Personal Instagram Account:**
1. Open Instagram mobile app
2. Go to **Profile** → **☰ Menu** → **Settings**
3. Tap **Account** → **Switch to Professional Account**
4. Choose **Business** (not Creator)
5. Connect to your Facebook Page (next step)
6. Complete business information

**If you already have a Business Account:**
✅ Skip to Step 2

### Step 2: Create/Use Facebook Page

**If you don't have a Facebook Page:**
1. Go to [facebook.com/pages/create](https://facebook.com/pages/create)
2. Choose **Business or Brand**
3. Enter your business/brand name
4. Add category and basic info
5. Click **Create Page**

**If you have a Facebook Page:**
✅ Ensure you have **Admin** access

### Step 3: Connect Instagram to Facebook Page

**Method 1: Through Instagram App**
1. Instagram app → **Profile** → **☰ Menu** → **Settings**
2. **Account** → **Linked Accounts** → **Facebook**
3. Log in and select your Facebook Page
4. Grant permissions

**Method 2: Through Facebook Page**
1. Go to your Facebook Page
2. **Settings** → **Instagram** (left sidebar)
3. **Connect Account**
4. Enter Instagram credentials
5. Complete connection

### Step 4: Verify Setup

**Check on Instagram:**
- Go to **Settings** → **Account** → **Linked Accounts**
- Facebook should show your Page name

**Check on Facebook:**
- Page **Settings** → **Instagram**
- Should show "Connected" with your Instagram username

## Step 5: Connect to Our Platform

1. Visit our SMM platform
2. Navigate to **Instagram Connect** page
3. Click **Connect Instagram Account**
4. **Important**: You'll be redirected to Facebook (not Instagram)
5. Log in with the Facebook account that owns your Page
6. Grant permissions for:
   - ✅ Your Facebook Page
   - ✅ Connected Instagram Business account
   - ✅ Basic profile info
   - ✅ Instagram insights and media

## Common Issues & Solutions

### ❌ "Invalid platform app"
**Cause**: Using personal Instagram account or not properly connected to Facebook Page
**Solution**: Complete Steps 1-3 above

### ❌ "No Facebook Pages found"
**Cause**: No Facebook Page or not admin of the page
**Solution**: Create a Facebook Page and ensure you're admin

### ❌ "No Instagram Business account connected"
**Cause**: Instagram account not linked to Facebook Page
**Solution**: Complete Step 3 above

### ❌ "Access denied during connection"
**Cause**: Not granting all required permissions
**Solution**: During Facebook OAuth, accept all permissions

## Why These Requirements?

Instagram Graph API (used by businesses) has different requirements than personal Instagram usage:

1. **Business Focus**: Designed for business analytics and management
2. **Facebook Integration**: Instagram is owned by Meta (Facebook)
3. **Page Connection**: Ensures business legitimacy and proper access controls
4. **Comprehensive Data**: Provides detailed insights not available to personal accounts

## What Data We Access

With proper setup, our platform can provide:

### 📈 Growth Metrics
- Follower count and growth rate
- Following count
- Media count

### 💬 Engagement Analytics
- Average likes per post
- Average comments per post
- Engagement rate calculation

### 📊 Content Performance
- Individual post metrics
- Best performing content
- Posting frequency analysis

### 👥 Advanced Insights (if available)
- Audience demographics
- Reach and impressions
- Profile interactions

## Need Help?

**Instagram Business Account Setup:**
- [Instagram Business Account Guide](https://help.instagram.com/502981923235522)

**Facebook Page Creation:**
- [Facebook Page Help](https://www.facebook.com/help/104002523024878)

**Connecting Accounts:**
- [Link Instagram to Facebook Page](https://www.facebook.com/help/instagram/176235849218188)

**Platform Issues:**
- Contact our support team
- Check our troubleshooting guide
   - Valid OAuth Redirect URIs: `http://localhost:5173/instagram/callback` (for development)
   - For production: `https://yourdomain.com/instagram/callback`
   - Deauthorize Callback URL: `https://yourdomain.com/instagram/deauthorize`
   - Data Deletion Request URL: `https://yourdomain.com/instagram/data-deletion`

2. **Instagram App Settings**:
   - App ID: Copy this value
   - App Secret: Copy this value (click "Show" to reveal)

## Step 4: Update Environment Variables

Update your `.env` file with the Instagram app credentials:

```env
# Instagram Basic Display API
VITE_INSTAGRAM_APP_ID=your_actual_app_id_here
VITE_INSTAGRAM_APP_SECRET=your_actual_app_secret_here
VITE_INSTAGRAM_REDIRECT_URI=http://localhost:5173/instagram/callback
```

**Important**: Replace `your_actual_app_id_here` and `your_actual_app_secret_here` with your real Instagram app credentials.

## Step 5: Update Database Schema

Run the updated SQL script in your Supabase SQL editor:

```sql
-- Add the Instagram insights table
CREATE TABLE IF NOT EXISTS public.instagram_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    media_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    avg_likes INTEGER DEFAULT 0,
    avg_comments INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    email_contacts INTEGER DEFAULT 0,
    phone_contacts INTEGER DEFAULT 0,
    get_directions INTEGER DEFAULT 0,
    text_message INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_instagram_insights_user_id ON public.instagram_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_insights_last_updated ON public.instagram_insights(last_updated);

-- Enable RLS
ALTER TABLE public.instagram_insights ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view own Instagram insights" ON public.instagram_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Instagram insights" ON public.instagram_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Instagram insights" ON public.instagram_insights
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned user Instagram insights" ON public.instagram_insights
    FOR SELECT USING (is_assigned_to_user(user_id));

CREATE POLICY "Admins can view all Instagram insights" ON public.instagram_insights
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all Instagram insights" ON public.instagram_insights
    FOR ALL USING (is_admin());
```

## Step 6: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the flow**:
   - Register/Login to your app
   - Go to `/instagram-connect`
   - Click "Connect Instagram Account"
   - You should be redirected to Instagram's OAuth page
   - After authorization, you'll be redirected back to your app
   - Check your database to see if the Instagram account and insights are saved

## Step 7: Production Setup

For production deployment:

1. **Update redirect URIs** in your Instagram app settings to use your production domain
2. **Update environment variables** with production URLs
3. **Ensure HTTPS** is enabled (required by Instagram)
4. **Test thoroughly** with real Instagram Business accounts

## Important Notes

### Instagram API Limitations

1. **Business Accounts Only**: Instagram insights are only available for Business or Creator accounts
2. **Rate Limits**: Instagram has rate limits on API calls
3. **Token Expiration**: Access tokens expire and need to be refreshed
4. **Permissions**: Users must explicitly grant permissions

### Data Privacy

1. **Secure Storage**: Access tokens are stored securely in your database
2. **User Consent**: Users must explicitly connect their Instagram account
3. **Data Retention**: Consider implementing data retention policies
4. **GDPR Compliance**: Ensure compliance with data protection regulations

### Error Handling

The implementation includes comprehensive error handling for:
- Network failures
- Invalid tokens
- Rate limit exceeded
- User permissions denied
- API changes

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Check that your redirect URI matches exactly in Instagram app settings
2. **"App not approved"**: Instagram apps need approval for production use
3. **"Insufficient permissions"**: Ensure you're requesting the correct scopes
4. **"Token expired"**: Implement token refresh logic

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG_INSTAGRAM=true
```

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Instagram app settings
3. Ensure your database schema is up to date
4. Test with a fresh Instagram Business account

## Next Steps

After successful setup:

1. **Monitor API usage** to stay within rate limits
2. **Implement token refresh** for long-term usage
3. **Add more Instagram features** like story insights, hashtag tracking
4. **Consider Instagram Graph API** for more advanced features
5. **Add analytics** to track user engagement with Instagram features

---

**Remember**: Always test thoroughly in development before deploying to production!
