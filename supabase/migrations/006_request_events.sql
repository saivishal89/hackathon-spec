-- Migration 006: Request Timeline Events Table
-- Full audit trail of lifecycle events and SLA status changes

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

ALTER TABLE public.request_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view timeline events of accessible requests"
  ON public.request_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE requests.id = request_events.request_id AND (
        requests.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Authenticated users can create timeline events"
  ON public.request_events FOR INSERT
  TO authenticated
  WITH CHECK (true);
