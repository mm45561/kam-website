-- KAM website database
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- People allowed into the admin panel (by login email)
create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

-- Universities, services, scholarships, calendar, articles, FAQs
create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  data jsonb not null default '{}'::jsonb,
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_collection_idx on public.content (collection, sort);

-- Site texts, contacts, prices note... (single row, id = 1)
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Student applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  status text not null default 'new',
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.content enable row level security;
alter table public.settings enable row level security;
alter table public.applications enable row level security;

-- admins: only admins can see the list
drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins for select using (public.is_admin());

-- content: everyone reads published rows, admins do everything
drop policy if exists content_public_read on public.content;
create policy content_public_read on public.content for select using (published or public.is_admin());
drop policy if exists content_admin_write on public.content;
create policy content_admin_write on public.content for all using (public.is_admin()) with check (public.is_admin());

-- settings: everyone reads, admins write
drop policy if exists settings_public_read on public.settings;
create policy settings_public_read on public.settings for select using (true);
drop policy if exists settings_admin_write on public.settings;
create policy settings_admin_write on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- applications: anyone can send one (insert only, status must be "new"); only admins can read/change/delete
drop policy if exists applications_public_insert on public.applications;
create policy applications_public_insert on public.applications for insert to anon, authenticated
  with check (status = 'new' and notes = '' and octet_length(data::text) < 20000);
drop policy if exists applications_admin_read on public.applications;
create policy applications_admin_read on public.applications for select using (public.is_admin());
drop policy if exists applications_admin_update on public.applications;
create policy applications_admin_update on public.applications for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists applications_admin_delete on public.applications;
create policy applications_admin_delete on public.applications for delete using (public.is_admin());

-- Image storage bucket (public read, admin upload)
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;
drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select using (bucket_id = 'media');
drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- LAST STEP: put the admin email here (the same email you create in Authentication -> Users)
-- insert into public.admins (email) values ('your-email@example.com');
