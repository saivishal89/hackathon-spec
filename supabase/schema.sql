-- SLA AI Platform schema
-- Run this file in the Supabase SQL editor after creating a project.

create type user_role as enum ('ADMIN', 'AGENT', 'CLIENT');
create type request_priority as enum ('P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW');
create type request_status as enum ('SUBMITTED', 'TRIAGED', 'IN_PROGRESS', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');
create type risk_level as enum ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
create type sla_tier as enum ('PLATINUM', 'GOLD', 'SILVER', 'STANDARD');

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  full_name text not null,
  role user_role default 'CLIENT',
  avatar_url text,
  company text,
  department text,
  active_tickets_count int default 0,
  max_capacity int default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.sla_policies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  tier sla_tier not null unique,
  target_uptime numeric(4,2) not null,
  response_time_minutes int not null,
  resolution_time_minutes int not null,
  penalty_rate_per_hour numeric(10,2) not null,
  business_hours_only boolean default false,
  created_at timestamptz default now()
);

create table public.service_requests (
  id uuid default gen_random_uuid() primary key,
  ticket_number text not null unique,
  title text not null,
  description text not null,
  category text not null,
  department text not null,
  priority request_priority default 'P3_MEDIUM',
  status request_status default 'SUBMITTED',
  requester_id uuid references public.profiles(id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  requester_company text,
  assignee_id uuid references public.profiles(id) on delete set null,
  assignee_name text,
  assignee_email text,
  sla_tier sla_tier default 'GOLD',
  response_due_at timestamptz not null,
  responded_at timestamptz,
  resolution_due_at timestamptz not null,
  resolved_at timestamptz,
  risk_score int default 10,
  risk_level risk_level default 'LOW',
  risk_trend text default 'stable',
  risk_explanation text,
  complexity_score int default 5,
  sentiment_urgency text default 'moderate',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.request_timeline_events (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references public.service_requests(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text not null,
  actor_role text not null,
  is_ai boolean default false,
  event_type text not null,
  title text not null,
  description text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.sla_policies enable row level security;
alter table public.service_requests enable row level security;
alter table public.request_timeline_events enable row level security;

create policy "Authenticated users can read profiles" on public.profiles for select to authenticated using (true);
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "Everyone can read SLA policies" on public.sla_policies for select using (true);
create policy "Clients see own requests" on public.service_requests for select to authenticated using (
  requester_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN', 'AGENT'))
);
create policy "Clients can create requests" on public.service_requests for insert to authenticated with check (auth.uid() = requester_id);
create policy "Operators can update requests" on public.service_requests for update to authenticated using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN', 'AGENT'))
);
create policy "Users can read timeline events" on public.request_timeline_events for select to authenticated using (true);
create policy "Users can add timeline events" on public.request_timeline_events for insert to authenticated with check (true);