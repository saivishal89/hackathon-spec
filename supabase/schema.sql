-- =========================================================================
-- SLA AI Platform — Master Database Schema & Row Level Security (RLS)
-- Run this entire script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- =========================================================================

-- 1. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  organization_id UUID,
  avatar_url TEXT,
  company TEXT,
  department TEXT,
  active_tickets_count INTEGER DEFAULT 0,
  max_capacity INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  plan_tier TEXT DEFAULT 'ENTERPRISE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SLA Policies Table
CREATE TABLE IF NOT EXISTS public.sla_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW')),
  response_time_minutes INTEGER NOT NULL,
  resolution_time_minutes INTEGER NOT NULL,
  warning_threshold_percentage INTEGER NOT NULL DEFAULT 70,
  penalty_rate_per_hour NUMERIC(10,2) DEFAULT 150.00,
  business_hours_only BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Service Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sla_policy_id UUID REFERENCES public.sla_policies(id) ON DELETE SET NULL,
  ticket_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'P3_MEDIUM' CHECK (priority IN ('P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed', 'breached')),
  category TEXT DEFAULT 'Infrastructure',
  department TEXT DEFAULT 'Core Engineering',
  sla_deadline TIMESTAMPTZ NOT NULL,
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  current_risk_percentage INTEGER DEFAULT 10,
  current_risk_level TEXT DEFAULT 'LOW' CHECK (current_risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  prediction_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Risk Predictions Table
CREATE TABLE IF NOT EXISTS public.risk_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  risk_percentage NUMERIC(5,2) NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  prediction_reason TEXT NOT NULL,
  features JSONB DEFAULT '{}'::jsonb,
  model_version TEXT DEFAULT 'v2.0-deterministic',
  predicted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Request Timeline Events Table
CREATE TABLE IF NOT EXISTS public.request_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'WARNING', 'CRITICAL', 'SUCCESS')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Organizations Policies
CREATE POLICY "Authenticated users can read organizations" ON public.organizations FOR SELECT TO authenticated USING (true);

-- SLA Policies
CREATE POLICY "Everyone can read SLA policies" ON public.sla_policies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage SLA policies" ON public.sla_policies FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Requests Policies
CREATE POLICY "Clients can view own requests" ON public.requests FOR SELECT TO authenticated USING (
  client_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Clients can create requests" ON public.requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Admins can update requests" ON public.requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Risk Predictions Policies
CREATE POLICY "Users view risk for accessible requests" ON public.risk_predictions FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.requests
    WHERE requests.id = risk_predictions.request_id AND (
      requests.client_id = auth.uid() OR
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    )
  )
);
CREATE POLICY "Insert risk predictions" ON public.risk_predictions FOR INSERT TO authenticated WITH CHECK (true);

-- Request Events Policies
CREATE POLICY "View request events" ON public.request_events FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.requests
    WHERE requests.id = request_events.request_id AND (
      requests.client_id = auth.uid() OR
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    )
  )
);
CREATE POLICY "Insert request events" ON public.request_events FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications Policies
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Audit Logs Policies
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- =========================================================================
-- TRIGGERS & SEED DATA
-- =========================================================================

-- Trigger to auto-create profile on Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed Default SLA Policies
INSERT INTO public.sla_policies (id, name, description, priority, response_time_minutes, resolution_time_minutes, warning_threshold_percentage, penalty_rate_per_hour)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'P1 Platinum Mission-Critical SLA', 'Mission critical outage with immediate dedicated SRE response', 'P1_CRITICAL', 15, 120, 60, 250.00),
  ('22222222-2222-2222-2222-222222222222', 'P2 High Priority Service SLA', 'Major feature degradation affecting multiple customer accounts', 'P2_HIGH', 30, 240, 70, 150.00),
  ('33333333-3333-3333-3333-333333333333', 'P3 Medium Standard SLA', 'Minor component defect or non-blocking performance degradation', 'P3_MEDIUM', 60, 480, 75, 75.00),
  ('44444444-4444-4444-4444-444444444444', 'P4 Low General Request SLA', 'Routine inquiry, documentation question, or minor UI feedback', 'P4_LOW', 120, 1440, 80, 25.00)
ON CONFLICT (id) DO NOTHING;