-- Run this in your Supabase SQL editor

-- Users table (mirrors auth.users, stores role)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'viewer' check (role in ('viewer', 'author', 'admin')),
  created_at timestamptz default now()
);

-- Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  summary text,
  author_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  comment_text text not null,
  created_at timestamptz default now()
);

-- Supabase Storage bucket for post images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- RLS: users
create policy "Users can view all profiles" on public.users
  for select using (true);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Service role can insert users" on public.users
  for insert with check (auth.uid() = id);

-- RLS: posts
create policy "Anyone can view posts" on public.posts
  for select using (true);

create policy "Authors and admins can insert posts" on public.posts
  for insert with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('author', 'admin')
    )
  );

create policy "Authors can update own posts" on public.posts
  for update using (
    author_id = auth.uid()
    or exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Authors can delete own posts" on public.posts
  for delete using (
    author_id = auth.uid()
    or exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS: comments
create policy "Anyone can view comments" on public.comments
  for select using (true);

create policy "Authenticated users can insert comments" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments" on public.comments
  for delete using (
    user_id = auth.uid()
    or exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Storage RLS: allow public read, authenticated write
create policy "Public read post images" on storage.objects
  for select using (bucket_id = 'post-images');

create policy "Authors can upload post images" on storage.objects
  for insert with check (
    bucket_id = 'post-images' and auth.uid() is not null
  );

create policy "Authors can update own post images" on storage.objects
  for update using (
    bucket_id = 'post-images' and auth.uid() is not null
  );

-- Function: auto-create user row on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'viewer')
  );
  return new;
end;
$$;

-- Trigger: fire after new auth user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
