-- Brainstrain '26 — Supabase schema
-- Run this whole file once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  guidelines text[] not null default '{}',
  rules text[] not null default '{}',
  image_url text,
  category text,
  contact_name text,
  contact_phone text,
  prize_pool text,
  is_team_event boolean not null default false,
  min_team_size int not null default 1,
  max_team_size int not null default 1,
  registration_open boolean not null default true,
  registration_deadline timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  team_name text not null,
  leader_name text not null,
  leader_email text not null,
  leader_phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  team_id uuid references public.teams (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  college text not null,
  department text,
  year text,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  college text,
  created_at timestamptz not null default now()
);

create index if not exists registrations_event_id_idx on public.registrations (event_id);
create index if not exists registrations_team_id_idx on public.registrations (team_id);
create index if not exists teams_event_id_idx on public.teams (event_id);
create index if not exists team_members_team_id_idx on public.team_members (team_id);

-- ============================================================
-- HELPERS
-- ============================================================

-- security definer so it can read public.users without recursing through
-- that table's own RLS policies (which call this function).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- auto-create a public.users row (role='user') whenever someone signs up
-- via Supabase Auth. Promote to admin manually afterwards (see README).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email), new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- keep events.updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- PUBLIC REGISTRATION RPC
-- ============================================================
-- The only way anonymous visitors can write registration data. Runs as a
-- single atomic transaction (no orphaned teams/registrations on failure),
-- and re-validates registration_open / deadline / team size server-side
-- even if a client bypasses the UI checks.

create or replace function public.register_for_event(
  p_event_id uuid,
  p_team_name text,
  p_leader jsonb,
  p_members jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  ev public.events%rowtype;
  v_team_id uuid;
  v_registration_id uuid;
  v_team_size int;
  member jsonb;
begin
  select * into ev from public.events where id = p_event_id and is_active = true;

  if ev.id is null then
    raise exception 'Event not found';
  end if;

  if ev.registration_open is false then
    raise exception 'Registration is closed for this event';
  end if;

  if ev.registration_deadline is not null and now() > ev.registration_deadline then
    raise exception 'Registration deadline has passed for this event';
  end if;

  if p_leader ->> 'name' is null or p_leader ->> 'email' is null or p_leader ->> 'phone' is null or p_leader ->> 'college' is null then
    raise exception 'Name, email, phone and college are required';
  end if;

  v_team_size := 1 + coalesce(jsonb_array_length(p_members), 0);

  if ev.is_team_event then
    if p_team_name is null or length(trim(p_team_name)) = 0 then
      raise exception 'Team name is required for this event';
    end if;

    if v_team_size < ev.min_team_size or v_team_size > ev.max_team_size then
      raise exception 'Team size must be between % and % members (got %)', ev.min_team_size, ev.max_team_size, v_team_size;
    end if;

    insert into public.teams (event_id, team_name, leader_name, leader_email, leader_phone)
    values (p_event_id, p_team_name, p_leader ->> 'name', p_leader ->> 'email', p_leader ->> 'phone')
    returning id into v_team_id;
  end if;

  insert into public.registrations (event_id, team_id, name, email, phone, college, department, year)
  values (
    p_event_id, v_team_id,
    p_leader ->> 'name', p_leader ->> 'email', p_leader ->> 'phone',
    p_leader ->> 'college', p_leader ->> 'department', p_leader ->> 'year'
  )
  returning id into v_registration_id;

  if v_team_id is not null and p_members is not null then
    for member in select * from jsonb_array_elements(p_members)
    loop
      insert into public.team_members (team_id, name, email, phone, college)
      values (v_team_id, member ->> 'name', member ->> 'email', member ->> 'phone', member ->> 'college');
    end loop;
  end if;

  return v_registration_id;
end;
$$;

revoke all on function public.register_for_event(uuid, text, jsonb, jsonb) from public;
grant execute on function public.register_for_event(uuid, text, jsonb, jsonb) to anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.teams enable row level security;
alter table public.registrations enable row level security;
alter table public.team_members enable row level security;

-- users -------------------------------------------------------
create policy "users can read own row" on public.users
  for select using (auth.uid() = id or public.is_admin());

create policy "admins manage users" on public.users
  for update using (public.is_admin())
  with check (public.is_admin());

create policy "admins delete users" on public.users
  for delete using (public.is_admin());

-- events --------------------------------------------------------
create policy "anyone can read active events" on public.events
  for select using (is_active = true or public.is_admin());

create policy "admins insert events" on public.events
  for insert with check (public.is_admin());

create policy "admins update events" on public.events
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admins delete events" on public.events
  for delete using (public.is_admin());

-- teams -----------------------------------------------------------
-- No public insert policy: writes only happen through the
-- register_for_event() security-definer RPC above.
create policy "admins insert teams" on public.teams
  for insert with check (public.is_admin());

create policy "admins read teams" on public.teams
  for select using (public.is_admin());

create policy "admins update teams" on public.teams
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admins delete teams" on public.teams
  for delete using (public.is_admin());

-- registrations -----------------------------------------------------
create policy "admins insert registrations" on public.registrations
  for insert with check (public.is_admin());

create policy "admins read registrations" on public.registrations
  for select using (public.is_admin());

create policy "admins update registrations" on public.registrations
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admins delete registrations" on public.registrations
  for delete using (public.is_admin());

-- team_members --------------------------------------------------------
create policy "admins insert team members" on public.team_members
  for insert with check (public.is_admin());

create policy "admins read team members" on public.team_members
  for select using (public.is_admin());

create policy "admins update team members" on public.team_members
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admins delete team members" on public.team_members
  for delete using (public.is_admin());
