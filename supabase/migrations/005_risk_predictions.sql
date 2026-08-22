-- Migration 005: AI Risk Predictions Table
-- Stores historical SLA breach risk calculations and explainability audit logs

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

ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view risk predictions for accessible requests"
  ON public.risk_predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE requests.id = risk_predictions.request_id AND (
        requests.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Admins or System can insert risk predictions"
  ON public.risk_predictions FOR INSERT
  TO authenticated
  WITH CHECK (true);
