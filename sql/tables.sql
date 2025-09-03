-- SMM System Database Tables
-- This file contains all table creation statements for the SMM system

-- ==============================================
-- PROFILES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'staff', 'admin')),
    requirements_completed BOOLEAN DEFAULT FALSE,
    instagram_connected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- USER_REQUIREMENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.user_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    niche TEXT,
    location TEXT,
    comments TEXT,
    dms TEXT,
    max_following INTEGER,
    hashtags TEXT,
    account_targets TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INSTAGRAM_ACCOUNTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.instagram_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    instagram_user_id TEXT NOT NULL,
    username TEXT,
    access_token TEXT,
    refresh_token TEXT,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PAYMENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================
-- STAFF_ASSIGNMENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.staff_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES public.profiles(id),
    UNIQUE(staff_id, user_id)
);

-- ==============================================
-- DASHBOARD_TARGETS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.dashboard_targets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    target_followers INTEGER,
    target_engagement_rate DECIMAL(5,2),
    target_posts_per_day INTEGER,
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- SUPPORT_CHATS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.support_chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    sent_by TEXT NOT NULL CHECK (sent_by IN ('user', 'staff', 'admin')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INSTAGRAM_INSIGHTS TABLE
-- ==============================================
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

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- User requirements indexes
CREATE INDEX IF NOT EXISTS idx_user_requirements_user_id ON public.user_requirements(user_id);

-- Instagram accounts indexes
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON public.instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_instagram_user_id ON public.instagram_accounts(instagram_user_id);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

-- Staff assignments indexes
CREATE INDEX IF NOT EXISTS idx_staff_assignments_staff_id ON public.staff_assignments(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_user_id ON public.staff_assignments(user_id);

-- Dashboard targets indexes
CREATE INDEX IF NOT EXISTS idx_dashboard_targets_user_id ON public.dashboard_targets(user_id);

-- Support chats indexes
CREATE INDEX IF NOT EXISTS idx_support_chats_user_id ON public.support_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_support_chats_staff_id ON public.support_chats(staff_id);
CREATE INDEX IF NOT EXISTS idx_support_chats_created_at ON public.support_chats(created_at);

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_requirements_updated_at 
    BEFORE UPDATE ON public.user_requirements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_targets_updated_at 
    BEFORE UPDATE ON public.dashboard_targets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
