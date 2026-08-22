-- Migration 003: SLA Policies Table
-- Stores SLA targets, resolution windows, and warning thresholds

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

ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read SLA policies"
  ON public.sla_policies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage SLA policies"
  ON public.sla_policies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed default standard enterprise SLA policies
INSERT INTO public.sla_policies (id, name, description, priority, response_time_minutes, resolution_time_minutes, warning_threshold_percentage, penalty_rate_per_hour)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'P1 Platinum Mission-Critical SLA', 'Mission critical outage with immediate dedicated SRE response', 'P1_CRITICAL', 15, 120, 60, 250.00),
  ('22222222-2222-2222-2222-222222222222', 'P2 High Priority Service SLA', 'Major feature degradation affecting multiple customer accounts', 'P2_HIGH', 30, 240, 70, 150.00),
  ('33333333-3333-3333-3333-333333333333', 'P3 Medium Standard SLA', 'Minor component defect or non-blocking performance degradation', 'P3_MEDIUM', 60, 480, 75, 75.00),
  ('44444444-4444-4444-4444-444444444444', 'P4 Low General Request SLA', 'Routine inquiry, documentation question, or minor UI feedback', 'P4_LOW', 120, 1440, 80, 25.00)
ON CONFLICT (id) DO NOTHING;
