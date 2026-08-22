-- Migration 004: Service Requests Table
-- Core service requests with SLA deadlines and assignment tracking

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

-- Enable RLS
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Clients can only see their own requests
CREATE POLICY "Clients can view own requests"
  ON public.requests FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Clients can insert requests for themselves
CREATE POLICY "Clients can create requests"
  ON public.requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Admins can update any request
CREATE POLICY "Admins can update requests"
  ON public.requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
