-- Persistent bookmark table and RLS policies.

create extension if not exists pgcrypto;

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint bookmarks_user_article_unique unique (user_id, article_id)
);

create index if not exists bookmarks_user_id_created_at_idx
  on public.bookmarks (user_id, created_at desc);

create index if not exists bookmarks_article_id_idx
  on public.bookmarks (article_id);

alter table public.bookmarks enable row level security;

drop policy if exists "Users can read own bookmarks" on public.bookmarks;
create policy "Users can read own bookmarks"
on public.bookmarks
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create own bookmarks" on public.bookmarks;
create policy "Users can create own bookmarks"
on public.bookmarks
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.articles
    where articles.id = bookmarks.article_id
      and articles.status = 'published'
  )
);

drop policy if exists "Users can delete own bookmarks" on public.bookmarks;
create policy "Users can delete own bookmarks"
on public.bookmarks
for delete
to authenticated
using (user_id = auth.uid());
