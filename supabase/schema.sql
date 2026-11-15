-- KAM website database
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- People allowed into the admin panel (by login email)
create table if not exists public.admins (
  email text primary key
);

-- An admin is a logged-in user whose email is in public.admins AND who passed the
-- 6-digit authenticator code step (session level "aal2"). A stolen password alone is not enough.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
     and exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

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
  ip_hash text,
  created_at timestamptz not null default now()
);
alter table public.applications add column if not exists ip_hash text;
create index if not exists applications_ip_idx on public.applications (ip_hash, created_at);

alter table public.admins enable row level security;
alter table public.content enable row level security;
alter table public.settings enable row level security;
alter table public.applications enable row level security;

-- admins: only admins can see the list
drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins for select using (public.is_admin());
revoke insert, update, delete on public.admins from anon, authenticated;
revoke all on public.admins from anon;

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

-- applications: anyone can send one (insert only); only admins can read/change/delete.
-- The public may fill only the "data" column. Every other column is set by the database.
revoke insert, update, delete, select on public.applications from anon, authenticated;
grant insert (data) on public.applications to anon, authenticated;
grant select, update (status, notes), delete on public.applications to authenticated;

drop policy if exists applications_public_insert on public.applications;
create policy applications_public_insert on public.applications for insert to anon, authenticated
  with check (status = 'new' and notes = '' and octet_length(data::text) < 20000);

-- Checks every new application: only known fields, short texts, and at most
-- 5 applications per hour from the same internet address (spam protection).
-- The address is stored only as a salted hash, never in plain form (KVKK).
create table if not exists public.app_secrets (id integer primary key default 1 check (id = 1), salt text not null default encode(gen_random_bytes(32), 'hex'));
insert into public.app_secrets (id) values (1) on conflict (id) do nothing;
alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;

create or replace function public.applications_guard() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare
  allowed text[] := array['name','phone','email','nationality','country','degree','major','gpa','unitype','university','service','message','lang','consent','consent_at'];
  k text;
  maxlen int;
  hdrs json;
  ip text;
  salt text;
begin
  -- Admins editing in the panel are not limited.
  if public.is_admin() then return new; end if;

  if jsonb_typeof(new.data) <> 'object' then raise exception 'invalid application'; end if;
  for k in select jsonb_object_keys(new.data) loop
    if not (k = any(allowed)) then raise exception 'invalid field'; end if;
    if jsonb_typeof(new.data -> k) not in ('string', 'boolean') then raise exception 'invalid field'; end if;
    maxlen := 200;
    if k = 'message' then maxlen := 3000; end if;
    if length(new.data ->> k) > maxlen then raise exception 'field too long'; end if;
  end loop;
  if coalesce(trim(new.data ->> 'name'), '') = '' or coalesce(trim(new.data ->> 'phone'), '') = '' then raise exception 'missing name or phone'; end if;
  if coalesce(new.data ->> 'consent', '') <> 'true' then raise exception 'consent required'; end if;

  new.status := 'new';
  new.notes := '';
  new.created_at := now();

  begin hdrs := current_setting('request.headers', true)::json; exception when others then hdrs := null; end;
  ip := coalesce(hdrs ->> 'cf-connecting-ip', split_part(coalesce(hdrs ->> 'x-forwarded-for', ''), ',', 1), 'unknown');
  select s.salt into salt from public.app_secrets s where s.id = 1;
  new.ip_hash := encode(digest(salt || trim(ip), 'sha256'), 'hex');

  if (select count(*) from public.applications where ip_hash = new.ip_hash and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'too many applications, try again later';
  end if;
  if (select count(*) from public.applications where created_at > now() - interval '1 hour') >= 300 then
    raise exception 'busy, try again later';
  end if;
  return new;
end;
$$;
drop trigger if exists applications_guard on public.applications;
create trigger applications_guard before insert on public.applications for each row execute function public.applications_guard();
drop policy if exists applications_admin_read on public.applications;
create policy applications_admin_read on public.applications for select using (public.is_admin());
drop policy if exists applications_admin_update on public.applications;
create policy applications_admin_update on public.applications for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists applications_admin_delete on public.applications;
create policy applications_admin_delete on public.applications for delete using (public.is_admin());

-- Image storage bucket (public read, admin upload). Images only, at most 3 MB each.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
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
