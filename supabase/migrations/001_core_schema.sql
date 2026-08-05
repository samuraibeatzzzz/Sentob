-- ============================================================
-- SENTOB TOURISM PLATFORM — DATABASE SCHEMA (Milestone 2)
-- ============================================================
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
do $$ begin
  create type app_role as enum ('admin', 'manager', 'user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- PROFILES  (extends auth.users — 1:1, role lives here)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- GUEST HOUSES
-- ------------------------------------------------------------
create table if not exists public.guest_houses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_ru text,
  name_en text,
  description text not null,
  description_ru text,
  description_en text,
  address text,
  latitude double precision,
  longitude double precision,
  price_per_night numeric(12, 2) not null check (price_per_night >= 0),
  max_guests integer not null default 2 check (max_guests > 0),
  rooms integer not null default 1 check (rooms > 0),
  amenities text[] not null default '{}',
  cover_image text,
  images text[] not null default '{}',
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0,
  is_active boolean not null default true,
  owner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guest_houses_slug_idx on public.guest_houses (slug);
create index if not exists guest_houses_active_idx on public.guest_houses (is_active);

-- ------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  guest_house_id uuid not null references public.guest_houses (id) on delete restrict,
  user_id uuid references public.profiles (id) on delete set null,

  guest_name text not null,
  guest_phone text not null,
  guest_email text,

  check_in date not null,
  check_out date not null,
  guests integer not null check (guests > 0),
  rooms integer not null default 1 check (rooms > 0),

  nights integer generated always as (check_out - check_in) stored,
  price_per_night numeric(12, 2) not null,
  total_price numeric(12, 2) not null,

  status booking_status not null default 'pending',
  idempotency_key text not null unique,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint check_out_after_check_in check (check_out > check_in)
);

create index if not exists bookings_guest_house_idx on public.bookings (guest_house_id);
create index if not exists bookings_dates_idx on public.bookings (guest_house_id, check_in, check_out);
create index if not exists bookings_status_idx on public.bookings (status);

-- Prevent double-booking: no two active bookings for the same guest house
-- may have overlapping date ranges.
create extension if not exists btree_gist;

alter table public.bookings
  add column if not exists date_range daterange
  generated always as (daterange(check_in, check_out, '[)')) stored;

do $$ begin
  alter table public.bookings
    add constraint bookings_no_overlap
    exclude using gist (
      guest_house_id with =,
      date_range with &&
    ) where (status in ('pending', 'confirmed'));
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- updated_at trigger helper
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.guest_houses;
create trigger set_updated_at before update on public.guest_houses
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.bookings;
create trigger set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Auto-create profile row when a new auth user signs up
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.guest_houses enable row level security;
alter table public.bookings enable row level security;

-- profiles: a user can read/update only their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- guest_houses: publicly readable when active; writes via service role only
drop policy if exists "guest_houses_public_read" on public.guest_houses;
create policy "guest_houses_public_read" on public.guest_houses
  for select using (is_active = true);

-- bookings: a user can see their own bookings; inserts happen via
-- the server (service role) after price recalculation, so no public
-- insert policy is defined here.
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings
  for select using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- SEED DATA (matches the homepage preview cards)
-- ------------------------------------------------------------
insert into public.guest_houses
  (slug, name, name_ru, name_en, description, description_ru, description_en,
   address, latitude, longitude, price_per_night, max_guests, rooms,
   amenities, cover_image, images, rating, review_count)
values  (
    'sentob-family-guest-house',
    'Sentob Family Guest House', 'Sentob Family Guest House', 'Sentob Family Guest House',
    'Tog' || chr(39) || ' manzarali, oilaviy mehmon uyi. Milliy taomlar va issiq mehmondo' || chr(39) || 'stlik.',
    'Семейный гостевой дом с видом на горы. Национальная кухня и тёплое гостеприимство.',
    'A family-run guest house with mountain views. Traditional meals and warm hospitality.',
    'Sentob qishlog'' i, Nurota tumani', 40.6510, 66.8490, 250000, 6, 3,
    array['Wi-Fi', 'Nonushta', 'Bepul parkovka', 'Tog'' manzarasi'],
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop',
    array[
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop'
    ],
    4.9, 120
  ),
  (
    'mountain-view-guest-house',
    'Mountain View Guest House', 'Mountain View Guest House', 'Mountain View Guest House',
    'Nurota tizmasiga qaragan tinch hovlili mehmon uyi.',
    'Гостевой дом с тихим двориком и видом на хребет Нуратау.',
    'A quiet courtyard guest house facing the Nuratau range.',
    'Sentob qishlog''i, Nurota tumani', 40.6522, 66.8471, 220000, 4, 2,
    array['Wi-Fi', 'Nonushta', 'Hovli'],
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
    array['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'],
    4.8, 98
  ),
  (
    'nuratau-eco-house',
    'Nuratau Eco House', 'Nuratau Eco House', 'Nuratau Eco House',
    'Ekologik toza materiallardan qurilgan, tabiat qo''ynidagi uy.',
    'Дом, построенный из экологичных материалов, в окружении природы.',
    'Built with eco-friendly materials, surrounded by nature.',
    'Sentob qishlog''i, Nurota tumani', 40.6499, 66.8512, 270000, 5, 2,
    array['Wi-Fi', 'Nonushta', 'Bog''', 'Eko mahsulotlar'],
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop',
    array['https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop'],
    4.9, 75
  ),
  (
    'stone-village-house',
    'Stone Village House', 'Stone Village House', 'Stone Village House',
    'An''anaviy tosh devorlar bilan qurilgan, tarixiy ruhdagi uy.',
    'Дом в историческом стиле с традиционными каменными стенами.',
    'A historic-style house built with traditional stone walls.',
    'Sentob qishlog''i, Nurota tumani', 40.6533, 66.8455, 200000, 4, 2,
    array['Wi-Fi', 'Nonushta'],
    'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=1200&auto=format&fit=crop',
    array['https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=1200&auto=format&fit=crop'],
    4.7, 56
  )
on conflict (slug) do nothing;
