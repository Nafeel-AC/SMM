# Instagram Integration Setup Guide (Updated 2024)

This guide will help you set up real Instagram authentication and data fetching for your SMM marketing application using the current Instagram Graph API.

## Prerequisites

1. **Facebook Developer Account**: You need a Facebook Developer account to create an Instagram app
2. **Instagram Business Account**: The user's Instagram account must be a Business or Creator account to access insights
3. **Facebook Page**: You need a Facebook Page connected to your Instagram Business account
4. **Supabase Database**: Your database should be set up with the updated schema

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type (required for Instagram Graph API)
4. Fill in the app details:
   - App Name: Your SMM App Name
   - App Contact Email: Your email
   - App Purpose: Business

## Step 2: Add Instagram Product

1. In your app dashboard, click "Add Product"
2. Find "Instagram" and click "Set Up"
3. This will set up Instagram Graph API (the current method)

## Step 3: Configure Instagram Basic Display

1. **Basic Display Settings**:
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
