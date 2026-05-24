-- Production RLS hardening for Gridaan profiles and articles.
-- Run this in Supabase SQL editor or with `supabase db push`.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('user', 'admin'))
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;

drop policy if exists "Profiles can read own profile" on public.profiles;
create policy "Profiles can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() and role = 'user');

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles"
on public.profiles
for delete
to authenticated
using (public.is_admin());

alter table public.articles
  add column if not exists status text not null default 'published';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'articles_status_check'
      and conrelid = 'public.articles'::regclass
  ) then
    alter table public.articles
      add constraint articles_status_check
      check (status in ('draft', 'published', 'scheduled'));
  end if;
end;
$$;

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
on public.articles
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can read all articles" on public.articles;
create policy "Admins can read all articles"
on public.articles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can create articles" on public.articles;
create policy "Admins can create articles"
on public.articles
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update articles" on public.articles;
create policy "Admins can update articles"
on public.articles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete articles" on public.articles;
create policy "Admins can delete articles"
on public.articles
for delete
to authenticated
using (public.is_admin());
