-- Profiles table to store additional user data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  last_check_in timestamp with time zone default timezone('utc'::text, now()) not null,
  check_in_frequency_days integer default 30,
  is_emergency_mode boolean default false
);

-- Profiles Policies
alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Trigger for profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Assets table
create table if not exists public.assets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null,
  details text,
  object_name text not null,
  file_name text not null,
  user_id uuid references auth.users not null
);

-- Beneficiaries table
create table if not exists public.beneficiaries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  relation text,
  can_access_photos boolean default false,
  can_access_docs boolean default false,
  can_access_messages boolean default false,
  user_id uuid references auth.users not null
);

-- User Configs table
create table if not exists public.user_configs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  key text not null,
  value text,
  user_id uuid references auth.users not null
);

-- 2. Enable Row Level Security
alter table public.assets enable row level security;
alter table public.beneficiaries enable row level security;
alter table public.user_configs enable row level security;

-- 3. RLS Policies

-- Assets Policies
drop policy if exists "Users can view their own assets" on public.assets;
create policy "Users can view their own assets"
  on public.assets for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own assets" on public.assets;
create policy "Users can insert their own assets"
  on public.assets for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own assets" on public.assets;
create policy "Users can update their own assets"
  on public.assets for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own assets" on public.assets;
create policy "Users can delete their own assets"
  on public.assets for delete
  using ( auth.uid() = user_id );

-- Beneficiaries Policies
drop policy if exists "Users can view their own beneficiaries" on public.beneficiaries;
create policy "Users can view their own beneficiaries"
  on public.beneficiaries for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own beneficiaries" on public.beneficiaries;
create policy "Users can insert their own beneficiaries"
  on public.beneficiaries for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own beneficiaries" on public.beneficiaries;
create policy "Users can update their own beneficiaries"
  on public.beneficiaries for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own beneficiaries" on public.beneficiaries;
create policy "Users can delete their own beneficiaries"
  on public.beneficiaries for delete
  using ( auth.uid() = user_id );

-- 4. Storage Buckets Configuration
-- You will need to manually create a bucket named 'assets' in Supabase Storage
-- and set its visibility to private with policies:
-- (auth.uid() = (storage.foldername(name))[1]::uuid)
