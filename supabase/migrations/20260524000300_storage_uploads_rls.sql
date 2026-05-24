-- Storage hardening for image/upload buckets used by the CMS.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('article-images', 'article-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('uploads', 'uploads', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read CMS uploads" on storage.objects;
create policy "Public can read CMS uploads"
on storage.objects
for select
to anon, authenticated
using (bucket_id in ('article-images', 'uploads'));

drop policy if exists "Admins can upload CMS files" on storage.objects;
create policy "Admins can upload CMS files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('article-images', 'uploads')
  and public.is_admin()
);

drop policy if exists "Admins can update CMS files" on storage.objects;
create policy "Admins can update CMS files"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('article-images', 'uploads')
  and public.is_admin()
)
with check (
  bucket_id in ('article-images', 'uploads')
  and public.is_admin()
);

drop policy if exists "Admins can delete CMS files" on storage.objects;
create policy "Admins can delete CMS files"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('article-images', 'uploads')
  and public.is_admin()
);