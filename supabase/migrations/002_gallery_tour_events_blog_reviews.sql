-- ============================================================
-- SENTOB TOURISM PLATFORM — MIGRATION 002 (Milestone 3)
-- Gallery, 360 Tour, Events, Blog, Reviews
-- ============================================================
-- Run after 001_core_schema.sql. Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
do $$ begin
  create type gallery_category as enum ('nature', 'food', 'culture', 'mountains', 'events');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_type as enum ('photo', 'video');
exception when duplicate_object then null; end $$;

do $$ begin
  create type review_source as enum ('google', 'tripadvisor', 'local');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- GALLERY
-- ------------------------------------------------------------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  title_ru text,
  title_en text,
  category gallery_category not null,
  media_type media_type not null default 'photo',
  url text not null,
  thumbnail_url text,
  width integer,
  height integer,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_category_idx on public.gallery_items (category);
create index if not exists gallery_items_published_idx on public.gallery_items (is_published);

-- ------------------------------------------------------------
-- EVENTS (festivals / calendar)
-- ------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ru text,
  title_en text,
  description text not null,
  description_ru text,
  description_en text,
  cover_image text,
  start_date date not null,
  end_date date,
  location text,
  is_recurring_yearly boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_start_date_idx on public.events (start_date);
create index if not exists events_published_idx on public.events (is_published);

drop trigger if exists set_updated_at on public.events;
create trigger set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- BLOG
-- ------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ru text,
  title_en text,
  excerpt text,
  excerpt_ru text,
  excerpt_en text,
  content text not null,
  content_ru text,
  content_en text,
  cover_image text,
  author_id uuid references public.profiles (id) on delete set null,
  author_name text not null default 'Sentob jamoasi',
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);

drop trigger if exists set_updated_at on public.blog_posts;
create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  source review_source not null,
  author_name text not null,
  author_avatar text,
  rating numeric(2, 1) not null check (rating >= 0 and rating <= 5),
  comment text not null,
  comment_ru text,
  comment_en text,
  guest_house_id uuid references public.guest_houses (id) on delete cascade,
  review_date date not null default current_date,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reviews_guest_house_idx on public.reviews (guest_house_id);
create index if not exists reviews_published_idx on public.reviews (is_published);

-- ------------------------------------------------------------
-- 360° VIRTUAL TOUR SCENES
-- ------------------------------------------------------------
create table if not exists public.tour_scenes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ru text,
  title_en text,
  panorama_url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists tour_scenes_published_idx on public.tour_scenes (is_published);

alter table public.tour_scenes enable row level security;

drop policy if exists "tour_scenes_public_read" on public.tour_scenes;
create policy "tour_scenes_public_read" on public.tour_scenes
  for select using (is_published = true);

insert into public.tour_scenes (slug, title, title_ru, title_en, panorama_url, sort_order)
values
  (
    'village-center',
    'Qishloq markazi', 'Центр села', 'Village Center',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2400&auto=format&fit=crop',
    1
  ),
  (
    'mountain-viewpoint',
    'Tog'' ko''rinish nuqtasi', 'Смотровая площадка', 'Mountain Viewpoint',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2400&auto=format&fit=crop',
    2
  ),
  (
    'aydarkul-shore',
    'Aydarko''l sohili', 'Берег Айдаркуля', 'Aydarkul Shore',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2400&auto=format&fit=crop',
    3
  )
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.gallery_items enable row level security;
alter table public.events enable row level security;
alter table public.blog_posts enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "gallery_public_read" on public.gallery_items;
create policy "gallery_public_read" on public.gallery_items
  for select using (is_published = true);

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (is_published = true);

drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts
  for select using (is_published = true);

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (is_published = true);

-- ------------------------------------------------------------
-- SEED DATA
-- ------------------------------------------------------------
insert into public.gallery_items (title, category, media_type, url, sort_order)
values
  ('Nuratau tog''lari', 'mountains', 'photo', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', 1),
  ('Aydarko''l sohili', 'nature', 'photo', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop', 2),
  ('Tandirda non', 'food', 'photo', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop', 3),
  ('Milliy hunarmandchilik', 'culture', 'photo', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop', 4),
  ('Ot minib sayohat', 'mountains', 'photo', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop', 5),
  ('Qishloq ko''chalari', 'culture', 'photo', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop', 6),
  ('Milliy taomlar dasturxoni', 'food', 'photo', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop', 7),
  ('Navruz bayrami', 'events', 'photo', 'https://images.unsplash.com/photo-1604605798069-0cf13d3bbc17?q=80&w=1200&auto=format&fit=crop', 8),
  ('Tog'' sharsharasi', 'nature', 'photo', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop', 9)
on conflict do nothing;

insert into public.events (slug, title, title_ru, title_en, description, description_ru, description_en, start_date, end_date, location, is_recurring_yearly)
values
  (
    'navruz-2027',
    'Navro''z bayrami', 'Праздник Навруз', 'Navruz Festival',
    'Bahorning kelishi va yangi yil boshlanishi sharafiga milliy bayram: milliy o''yinlar, sumalak tayyorlash va konsertlar.',
    'Национальный праздник в честь начала весны и Нового года: народные игры, приготовление сумаляка и концерты.',
    'A national festival celebrating the arrival of spring: traditional games, sumalak cooking, and concerts.',
    '2027-03-21', '2027-03-22', 'Sentob qishlog'' markazi', true
  ),
  (
    'harvest-festival-2026',
    'Hosil bayrami', 'Праздник урожая', 'Harvest Festival',
    'Yilning hosildorligini nishonlash uchun qishloq bo''ylab o''tkaziladigan an''anaviy bayram.',
    'Традиционный праздник в честь урожая года, проходящий по всему селу.',
    'A traditional celebration of the year''s harvest held throughout the village.',
    '2026-09-15', '2026-09-16', 'Sentob qishlog''i', true
  ),
  (
    'traditional-music-night-2026',
    'An''anaviy musiqa kechasi', 'Вечер традиционной музыки', 'Traditional Music Night',
    'Mahalliy sozandalar ishtirokida ochiq havoda milliy musiqa kechasi.',
    'Вечер национальной музыки под открытым небом с участием местных музыкантов.',
    'An open-air evening of national music featuring local musicians.',
    '2026-08-20', null, 'Sentob amfiteatri', false
  )
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, content, author_name, is_published, published_at)
values
  (
    'sentob-best-tourism-village-2023',
    'Sentob nega "Best Tourism Villages 2023" deb topildi?',
    'UN Tourism ekspertlari Sentobni qanday mezonlar asosida baholaganini bilib oling.',
    'Sentob qishlog''i 2023-yilda Birlashgan Millatlar Tashkilotining Butunjahon Turizm Tashkiloti (UN Tourism) tomonidan "Best Tourism Villages" ro''yxatiga kiritildi. Bu tanlov qishloqning tabiiy boyliklari, madaniy merosi, barqaror turizm yondashuvi va mahalliy jamoaning turizmga qo''shgan hissasi asosida amalga oshirildi. Sentob aholisi asrlar davomida shakllangan turmush tarzini saqlab, mehmonlarni o''z uylariga taklif qilib, haqiqiy o''zbek mehmondo''stligini namoyish etadi.',
    'Sentob jamoasi', true, now()
  ),
  (
    'nurota-mountains-trekking-guide',
    'Nurota tog''larida trekking: qayerdan boshlash kerak?',
    'Birinchi marta Nurota tog''lariga boradiganlar uchun qisqacha yo''riqnoma.',
    'Nurota tog'' tizmasi turli darajadagi sayohatchilar uchun mos marshrutlarga ega. Tajribasi kam bo''lganlar uchun qishloq atrofidagi qisqa yo''lakchalar, tajribali alpinistlar uchun esa cho''qqigacha bo''lgan uzoq marshrutlar mavjud. Har doim mahalliy yo''lboshchi bilan borish tavsiya etiladi.',
    'Sentob jamoasi', true, now()
  )
on conflict (slug) do nothing;

insert into public.reviews (source, author_name, rating, comment, review_date)
values
  ('google', 'Aziz Rahimov', 5.0, 'Ajoyib tabiat va samimiy mehmondo''stlik! Albatta yana boraman.', current_date - 20),
  ('tripadvisor', 'Sarah Johnson', 5.0, 'One of the most authentic village experiences in Central Asia. Highly recommend the horse riding tour.', current_date - 35),
  ('google', 'Dilnoza Yusupova', 4.5, 'Mehmon uylari juda toza va qulay, taomlar mazali edi.', current_date - 12),
  ('local', 'Bekzod Tursunov', 5.0, 'Bolalarim bilan bordik, hammaga juda yoqdi. Tog'' havosi ajoyib.', current_date - 5)
on conflict do nothing;
