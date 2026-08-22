-- Migration 002: Organizations Table
-- Multi-tenant organizational isolation support

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  plan_tier TEXT DEFAULT 'ENTERPRISE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read organizations"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (true);

-- Insert default demo organizations
INSERT INTO public.organizations (id, name, domain, plan_tier)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Enterprise Global Systems', 'enterprise.io', 'PLATINUM'),
  ('00000000-0000-0000-0000-000000000002', 'FinTech Global Corp', 'fintechcorp.com', 'GOLD')
ON CONFLICT (id) DO NOTHING;
