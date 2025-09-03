# Instagram Integration Fix Guide

## Issue

You're getting a 404 NOT_FOUND error when trying to connect Instagram accounts in production.

## Root Cause

The issue is likely caused by:

1. Missing database tables (`instagram_insights`)
2. Missing database column (`instagram_connected` in profiles table)
3. Row Level Security (RLS) policies not properly configured

## Solution Steps

### Step 1: Run Database Migration

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `jjbbpjteedaidhgxftqg`
3. Go to **SQL Editor**
4. Copy and paste the contents of `sql/instagram_migration.sql`
5. Click **Run** to execute the migration

### Step 2: Verify Tables Exist

After running the migration, verify these tables exist:

- `public.profiles` (should now have `instagram_connected` column)
- `public.instagram_accounts`
- `public.instagram_insights` (newly created)

### Step 3: Check RLS Policies

Ensure Row Level Security policies are enabled for:

- `instagram_accounts`
- `instagram_insights`

### Step 4: Verify Instagram App Configuration

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Navigate to your Instagram app (App ID: 1489254978768389)
3. Under **Instagram Basic Display** → **Basic Display Settings**
4. Verify these settings:
   - **Valid OAuth Redirect URIs**: `https://smm-marketing.vercel.app/instagram/callback`
   - **Deauthorize Callback URL**: `https://smm-marketing.vercel.app/instagram/deauth`
   - **Data Deletion Request URL**: `https://smm-marketing.vercel.app/instagram/delete`

### Step 5: Test the Integration

1. Deploy your latest changes to Vercel
2. Try connecting an Instagram account
3. Check browser network tab for any API errors
4. Check Supabase logs for database errors

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

1. Open browser dev tools and check the Console for errors
2. Check the Network tab to see which API calls are failing
3. Look at Supabase logs in the dashboard for database errors
4. Test the OAuth flow step by step:
   - Click "Connect Instagram" → Should redirect to Instagram
   - Complete Instagram auth → Should redirect to your callback URL
   - Callback should process and save data to database

## Common Issues

- **CORS errors**: Check that your domain is whitelisted in Supabase
- **RLS policy errors**: Ensure policies allow authenticated users to access their own data
- **Instagram app review**: If you need access to business features, your app may need to be reviewed by Meta

## Test in Development

Before testing in production, you can test locally:

1. Update `VITE_INSTAGRAM_REDIRECT_URI` to `http://localhost:5173/instagram/callback`
2. Add this URL to your Instagram app's Valid OAuth Redirect URIs
3. Test the full flow locally
