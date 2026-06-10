-- =============================================
-- FIX: RLS Policies for StreamBro
-- Run this AFTER the initial schema if /admin gives errors
-- =============================================

-- Drop existing problematic policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;

-- Fix: Simple policies without circular reference
-- Users can always read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Service role (server-side) has full access automatically (bypasses RLS)
-- So admin panel uses service_role key to bypass RLS

-- For admin queries via anon key, use a function-based check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin can read ALL profiles
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Admin can update ALL profiles
CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Admin can insert profiles (for manual creation)
CREATE POLICY "Admin can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = id);

-- =============================================
-- Fix subscriptions policies
-- =============================================
DROP POLICY IF EXISTS "Users view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admin full access subscriptions" ON public.subscriptions;

CREATE POLICY "Users view own subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin full access subscriptions" ON public.subscriptions
  FOR ALL USING (public.is_admin());

-- =============================================
-- Fix api_tokens policies  
-- =============================================
DROP POLICY IF EXISTS "Admin only api_tokens" ON public.api_tokens;

CREATE POLICY "Admin full access api_tokens" ON public.api_tokens
  FOR ALL USING (public.is_admin());

-- =============================================
-- Fix site_settings policies
-- =============================================
DROP POLICY IF EXISTS "Admin full access settings" ON public.site_settings;

-- Anyone can read settings (needed for maintenance mode etc)
CREATE POLICY "Anyone can read settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can modify settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- =============================================
-- Fix subscription_plans policies
-- =============================================
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admin full access plans" ON public.subscription_plans;

-- Anyone can read active plans
CREATE POLICY "Anyone can view plans" ON public.subscription_plans
  FOR SELECT USING (true);

CREATE POLICY "Admin full access plans" ON public.subscription_plans
  FOR ALL USING (public.is_admin());
