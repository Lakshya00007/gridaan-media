-- Comments system for Gridaan articles

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_article_id_idx on public.comments (article_id);
create index if not exists comments_parent_id_idx on public.comments (parent_id);

drop trigger if exists comments_touch_updated_at on public.comments;
create trigger comments_touch_updated_at
before update on public.comments
for each row execute function public.touch_updated_at();

alter table public.comments enable row level security;

drop policy if exists "Anyone can read comments" on public.comments;
create policy "Anyone can read comments"
on public.comments
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can create comments" on public.comments;
create policy "Authenticated users can create comments"
on public.comments
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update own comments" on public.comments;
create policy "Users can update own comments"
on public.comments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete own comments" on public.comments;
create policy "Users can delete own comments"
on public.comments
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can delete any comment" on public.comments;
create policy "Admins can delete any comment"
on public.comments
for delete
to authenticated
using (public.is_admin());
