-- ==============================================
-- SMM SYSTEM SAFE DATABASE SETUP
-- ==============================================
-- This script safely recreates the database schema
-- Run this in your Supabase SQL editor

-- ==============================================
-- STEP 1: SAFE CLEANUP
-- ==============================================

-- Drop triggers first (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_requirements_updated_at') THEN
        DROP TRIGGER IF EXISTS update_user_requirements_updated_at ON public.user_requirements CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_dashboard_targets_updated_at') THEN
        DROP TRIGGER IF EXISTS update_dashboard_targets_updated_at ON public.dashboard_targets CASCADE;
    END IF;
END $$;

-- Drop functions (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        DROP FUNCTION IF EXISTS is_admin() CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_staff') THEN
        DROP FUNCTION IF EXISTS is_staff() CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_assigned_to_user') THEN
        DROP FUNCTION IF EXISTS is_assigned_to_user(UUID) CASCADE;
    END IF;
END $$;

-- Drop tables in reverse dependency order (if they exist)
DO $$ 
BEGIN
    -- Drop tables only if they exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'support_chats') THEN
        DROP TABLE public.support_chats CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dashboard_targets') THEN
        DROP TABLE public.dashboard_targets CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'staff_assignments') THEN
        DROP TABLE public.staff_assignments CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
        DROP TABLE public.payments CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'instagram_accounts') THEN
        DROP TABLE public.instagram_accounts CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_requirements') THEN
        DROP TABLE public.user_requirements CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        DROP TABLE public.profiles CASCADE;
    END IF;
END $$;

-- ==============================================
-- STEP 2: CREATE TABLES
-- ==============================================

-- PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'staff', 'admin')),
    requirements_completed BOOLEAN DEFAULT FALSE,
    instagram_connected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USER_REQUIREMENTS TABLE
CREATE TABLE public.user_requirements (
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

-- INSTAGRAM_ACCOUNTS TABLE
CREATE TABLE public.instagram_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    instagram_user_id TEXT NOT NULL,
    username TEXT,
    access_token TEXT,
    refresh_token TEXT,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENTS TABLE
CREATE TABLE public.payments (
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

-- STAFF_ASSIGNMENTS TABLE
CREATE TABLE public.staff_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(staff_id, user_id)
);

-- DASHBOARD_TARGETS TABLE
CREATE TABLE public.dashboard_targets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    target_followers INTEGER,
    target_engagement_rate DECIMAL(5,2),
    target_posts_per_day INTEGER,
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUPPORT_CHATS TABLE
CREATE TABLE public.support_chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    sent_by TEXT NOT NULL CHECK (sent_by IN ('user', 'staff', 'admin')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
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
-- STEP 4: CREATE HELPER FUNCTIONS
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'staff'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is assigned to a specific user
CREATE OR REPLACE FUNCTION is_assigned_to_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.staff_assignments 
        WHERE staff_id = auth.uid() AND user_id = target_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STEP 5: CREATE TRIGGERS
-- ==============================================

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

-- ==============================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 7: CREATE RLS POLICIES
-- ==============================================

-- PROFILES TABLE POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = 'user');

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Staff can view assigned user profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.staff_assignments 
            WHERE staff_id = auth.uid() AND user_id = profiles.id
        )
    );

CREATE POLICY "Staff can update assigned user profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.staff_assignments 
            WHERE staff_id = auth.uid() AND user_id = profiles.id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.staff_assignments 
            WHERE staff_id = auth.uid() AND user_id = profiles.id
        ) AND role = 'user'
    );

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (is_admin());

-- USER_REQUIREMENTS TABLE POLICIES
CREATE POLICY "Users can view own requirements" ON public.user_requirements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requirements" ON public.user_requirements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requirements" ON public.user_requirements
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned user requirements" ON public.user_requirements
    FOR SELECT USING (is_assigned_to_user(user_id));

CREATE POLICY "Staff can update assigned user requirements" ON public.user_requirements
    FOR UPDATE USING (is_assigned_to_user(user_id))
    WITH CHECK (is_assigned_to_user(user_id));

CREATE POLICY "Admins can view all user requirements" ON public.user_requirements
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all user requirements" ON public.user_requirements
    FOR UPDATE USING (is_admin());

-- INSTAGRAM_ACCOUNTS TABLE POLICIES
CREATE POLICY "Users can view own Instagram accounts" ON public.instagram_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Instagram accounts" ON public.instagram_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Instagram accounts" ON public.instagram_accounts
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned user Instagram accounts" ON public.instagram_accounts
    FOR SELECT USING (is_assigned_to_user(user_id));

CREATE POLICY "Admins can view all Instagram accounts" ON public.instagram_accounts
    FOR SELECT USING (is_admin());

-- PAYMENTS TABLE POLICIES
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned user payments" ON public.payments
    FOR SELECT USING (is_assigned_to_user(user_id));

CREATE POLICY "Staff can update assigned user payments" ON public.payments
    FOR UPDATE USING (is_assigned_to_user(user_id))
    WITH CHECK (is_assigned_to_user(user_id));

CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all payments" ON public.payments
    FOR ALL USING (is_admin());

-- STAFF_ASSIGNMENTS TABLE POLICIES
CREATE POLICY "Staff can view own assignments" ON public.staff_assignments
    FOR SELECT USING (auth.uid() = staff_id);

CREATE POLICY "Admins can view all staff assignments" ON public.staff_assignments
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can create staff assignments" ON public.staff_assignments
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update staff assignments" ON public.staff_assignments
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete staff assignments" ON public.staff_assignments
    FOR DELETE USING (is_admin());

-- DASHBOARD_TARGETS TABLE POLICIES
CREATE POLICY "Users can view own dashboard targets" ON public.dashboard_targets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Staff can view assigned user dashboard targets" ON public.dashboard_targets
    FOR SELECT USING (is_assigned_to_user(user_id));

CREATE POLICY "Staff can insert dashboard targets for assigned users" ON public.dashboard_targets
    FOR INSERT WITH CHECK (is_assigned_to_user(user_id));

CREATE POLICY "Staff can update dashboard targets for assigned users" ON public.dashboard_targets
    FOR UPDATE USING (is_assigned_to_user(user_id))
    WITH CHECK (is_assigned_to_user(user_id));

CREATE POLICY "Admins can view all dashboard targets" ON public.dashboard_targets
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all dashboard targets" ON public.dashboard_targets
    FOR ALL USING (is_admin());

-- SUPPORT_CHATS TABLE POLICIES
CREATE POLICY "Users can view own support chats" ON public.support_chats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own support chats" ON public.support_chats
    FOR INSERT WITH CHECK (auth.uid() = user_id AND sent_by = 'user');

CREATE POLICY "Staff can view assigned user support chats" ON public.support_chats
    FOR SELECT USING (
        auth.uid() = staff_id OR is_assigned_to_user(user_id)
    );

CREATE POLICY "Staff can insert support chats for assigned users" ON public.support_chats
    FOR INSERT WITH CHECK (
        auth.uid() = staff_id AND sent_by = 'staff' AND is_assigned_to_user(user_id)
    );

CREATE POLICY "Admins can view all support chats" ON public.support_chats
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert support chats" ON public.support_chats
    FOR INSERT WITH CHECK (is_admin() AND sent_by = 'admin');

-- ==============================================
-- STEP 8: CREATE TRIGGER FOR AUTO-PROFILE CREATION
-- ==============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.email,
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- STEP 9: VERIFICATION QUERIES
-- ==============================================

-- Check if all tables exist
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'profiles',
        'user_requirements', 
        'instagram_accounts',
        'payments',
        'staff_assignments',
        'dashboard_targets',
        'support_chats'
    )
ORDER BY tablename;

-- Check if RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'profiles',
        'user_requirements', 
        'instagram_accounts',
        'payments',
        'staff_assignments',
        'dashboard_targets',
        'support_chats'
    )
ORDER BY tablename;

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==============================================
-- SETUP COMPLETE!
-- ==============================================
-- Your database is now ready with:
-- ✅ All tables created with proper foreign keys and cascades
-- ✅ Row Level Security enabled on all tables
-- ✅ Comprehensive RLS policies for all user roles
-- ✅ Auto-profile creation trigger for new users
-- ✅ Performance indexes
-- ✅ Helper functions for role checking
-- ✅ Updated_at triggers

-- Next steps:
-- 1. Test user registration - profile should be created automatically
-- 2. Test requirements form submission
-- 3. Create admin user manually if needed
