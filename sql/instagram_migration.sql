-- Migration to add missing tables and columns for Instagram integration
-- Run this in your Supabase SQL Editor

-- Add instagram_connected column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'instagram_connected'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN instagram_connected BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Create instagram_insights table if it doesn't exist
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

-- Enable Row Level Security (RLS) for the new table
ALTER TABLE public.instagram_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for instagram_insights table
CREATE POLICY "Users can view their own Instagram insights" ON public.instagram_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Instagram insights" ON public.instagram_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Instagram insights" ON public.instagram_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Instagram insights" ON public.instagram_insights
    FOR DELETE USING (auth.uid() = user_id);

-- Staff and admins can view all Instagram insights
CREATE POLICY "Staff can view all Instagram insights" ON public.instagram_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('staff', 'admin')
        )
    );

-- Update RLS policies for instagram_accounts table if they don't exist
DO $$
BEGIN
    -- Check if RLS is enabled on instagram_accounts
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'instagram_accounts'
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies for instagram_accounts if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'instagram_accounts' 
        AND policyname = 'Users can view their own Instagram accounts'
    ) THEN
        CREATE POLICY "Users can view their own Instagram accounts" ON public.instagram_accounts
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'instagram_accounts' 
        AND policyname = 'Users can insert their own Instagram accounts'
    ) THEN
        CREATE POLICY "Users can insert their own Instagram accounts" ON public.instagram_accounts
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'instagram_accounts' 
        AND policyname = 'Users can update their own Instagram accounts'
    ) THEN
        CREATE POLICY "Users can update their own Instagram accounts" ON public.instagram_accounts
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'instagram_accounts' 
        AND policyname = 'Users can delete their own Instagram accounts'
    ) THEN
        CREATE POLICY "Users can delete their own Instagram accounts" ON public.instagram_accounts
            FOR DELETE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'instagram_accounts' 
        AND policyname = 'Staff can view all Instagram accounts'
    ) THEN
        CREATE POLICY "Staff can view all Instagram accounts" ON public.instagram_accounts
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() 
                    AND role IN ('staff', 'admin')
                )
            );
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON public.instagram_insights TO authenticated;
GRANT ALL ON public.instagram_accounts TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_instagram_insights_user_id ON public.instagram_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON public.instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_instagram_user_id ON public.instagram_accounts(instagram_user_id);
