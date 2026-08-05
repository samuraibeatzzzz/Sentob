-- ============================================================
-- SENTOB TOURISM PLATFORM — DATABASE SCHEMA (Milestone 3)
-- Run AFTER supabase/schema.sql
-- ============================================================

create extension if not exists "pgcrypto";

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
  title text not null,
  title_ru text,
  title_en text,
  category gallery_category not null default 'nature',
  media_type media_type not null default 'photo',
  image_url text not null,
  video_url text,
  width integer not null default 800,
  height integer not null default 600,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_category_idx on public.gallery_items (category);
create index if not exists gallery_items_published_idx on public.gallery_items (is_published);

-- ------------------------------------------------------------
-- 360 VIRTUAL TOUR SCENES
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

-- ------------------------------------------------------------
-- EVENTS
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
  location text,
  start_date date not null,
  end_date date not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_end_after_start check (end_date >= start_date)
);

create index if not exists events_start_date_idx on public.events (start_date);
create index if not exists events_published_idx on public.events (is_published);

-- ------------------------------------------------------------
-- BLOG
-- ------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ru text,
  title_en text,
  excerpt text not null,
  excerpt_ru text,
  excerpt_en text,
  content text not null,
  content_ru text,
  content_en text,
  cover_image text,
  author_name text not null default 'Sentob jamoasi',
  meta_title text,
  meta_description text,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);

-- ------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  guest_house_id uuid references public.guest_houses (id) on delete cascade,
  guest_name text not null,
  avatar_url text,
  rating numeric(2, 1) not null check (rating >= 1 and rating <= 5),
  comment text not null,
  source review_source not null default 'local',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reviews_guest_house_idx on public.reviews (guest_house_id);
create index if not exists reviews_published_idx on public.reviews (is_published);

-- ------------------------------------------------------------
-- updated_at triggers
-- ------------------------------------------------------------
drop trigger if exists set_updated_at on public.events;
create trigger set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.blog_posts;
create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.gallery_items enable row level security;
alter table public.tour_scenes enable row level security;
alter table public.events enable row level security;
alter table public.blog_posts enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "gallery_public_read" on public.gallery_items;
create policy "gallery_public_read" on public.gallery_items
  for select using (is_published = true);

drop policy if exists "tour_scenes_public_read" on public.tour_scenes;
create policy "tour_scenes_public_read" on public.tour_scenes
  for select using (is_published = true);

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (is_published = true);

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read" on public.blog_posts
  for select using (is_published = true);

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (is_published = true);

-- ------------------------------------------------------------
-- SEED DATA
-- ------------------------------------------------------------
insert into public.gallery_items (title, title_ru, title_en, category, image_url, width, height, sort_order)
values
  ('Nurota tog''lari', 'Горы Нуратау', 'Nuratau Mountains', 'mountains', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', 1200, 1500, 1),
  ('Aydarko''l sohili', 'Побережье Айдаркуль', 'Aydarkul shore', 'nature', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop', 1200, 800, 2),
  ('Mahalliy taomlar', 'Местная кухня', 'Local cuisine', 'food', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop', 1200, 900, 3),
  ('Hunarmandchilik', 'Ремёсла', 'Handicrafts', 'culture', 'https://images.unsplash.com/photo-1528283648649-33347faa5d9e?q=80&w=1200&auto=format&fit=crop', 1200, 1400, 4),
  ('Navruz bayrami', 'Праздник Навруз', 'Navruz festival', 'events', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop', 1200, 800, 5),
  ('Tog'' sharsharasi', 'Горный водопад', 'Mountain waterfall', 'nature', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop', 1200, 1600, 6),
  ('Qishloq ko''chalari', 'Улицы села', 'Village streets', 'culture', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200&auto=format&fit=crop', 1200, 900, 7),
  ('Non yopish', 'Выпечка хлеба', 'Bread baking', 'food', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop', 1200, 1200, 8)
on conflict do nothing;

insert into public.tour_scenes (slug, title, title_ru, title_en, panorama_url, sort_order)
values
  ('village-square', 'Qishloq markazi', 'Центр села', 'Village square', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3000&auto=format&fit=crop', 1),
  ('mountain-viewpoint', 'Tog'' manzarasi', 'Горная панорама', 'Mountain viewpoint', 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=3000&auto=format&fit=crop', 2)
on conflict (slug) do nothing;

insert into public.events (slug, title, title_ru, title_en, description, description_ru, description_en, cover_image, location, start_date, end_date)
values
  (
    'navruz-2027', 'Navruz bayrami', 'Праздник Навруз', 'Navruz Festival',
    'Sentobda an''anaviy Navruz bayrami — milliy taomlar, o''yinlar va konsert dasturi.',
    'Традиционный праздник Навруз в Сентобе — национальные блюда, игры и концерт.',
    'Traditional Navruz celebration in Sentob — national food, games and a concert.',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    'Sentob qishlog'' markazi', '2027-03-21', '2027-03-21'
  ),
  (
    'harvest-festival-2026', 'Hosil bayrami', 'Праздник урожая', 'Harvest Festival',
    'Kuzgi hosil bayrami — mahalliy fermerlar bozori va milliy taomlar festivali.',
    'Осенний праздник урожая — фермерский рынок и фестиваль национальной кухни.',
    'Autumn harvest festival — local farmers market and traditional food festival.',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    'Sentob qishlog''i', '2026-09-25', '2026-09-27'
  ),
  (
    'traditional-music-night', 'Milliy musiqa kechasi', 'Вечер национальной музыки', 'Traditional Music Night',
    'Mahalliy ijrochilar ishtirokida ochiq havoda milliy musiqa kechasi.',
    'Вечер национальной музыки на открытом воздухе с участием местных исполнителей.',
    'An open-air evening of traditional music featuring local performers.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    'Sentob qishlog'' markazi', '2026-08-15', '2026-08-15'
  )
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, title_ru, title_en, excerpt, excerpt_ru, excerpt_en, content, content_ru, content_en, cover_image, meta_title, meta_description)
values
  (
    'sentob-best-tourism-village-2023',
    'Sentob — UN Tourism ro''yxatidagi eng yaxshi turizm qishlog''i',
    'Сентоб — лучшая туристическая деревня по версии UN Tourism',
    'Sentob — a Best Tourism Village recognised by UN Tourism',
    'Sentob 2023-yilda Birlashgan Millatlar Tashkilotining Butunjahon Turizm Tashkiloti tomonidan dunyodagi eng yaxshi turizm qishloqlaridan biri deb topildi.',
    'В 2023 году Сентоб был признан Всемирной туристской организацией ООН одной из лучших туристических деревень мира.',
    'In 2023, Sentob was recognised by UN Tourism as one of the world''s Best Tourism Villages.',
    'Sentob qishlog''i Nurota tog''lari bag''rida joylashgan bo''lib, asrlar davomida saqlanib kelgan turmush tarzi, hunarmandchilik va mehmondo''stlik an''analari bilan mashhur. 2023-yilda UN Tourism tomonidan o''tkazilgan tanlovda Sentob dunyoning eng yaxshi turizm qishloqlaridan biri sifatida tan olindi. Bu yutuq nafaqat qishloq aholisi, balki butun Navoiy viloyati uchun katta mag''rurlik manbai bo''ldi.',
    'Село Сентоб расположено у подножия гор Нуратау и славится образом жизни, ремёслами и традициями гостеприимства, сохранившимися на протяжении веков. В 2023 году по итогам конкурса UN Tourism Сентоб был признан одной из лучших туристических деревень мира. Это достижение стало источником гордости не только для жителей села, но и для всей Навоийской области.',
    'Sentob village sits at the foot of the Nuratau mountains and is known for a way of life, crafts, and hospitality traditions preserved for centuries. In 2023, following a UN Tourism competition, Sentob was recognised as one of the world''s Best Tourism Villages — an achievement that brought pride not only to the village but to the entire Navoi region.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    'Sentob — UN Tourism Best Tourism Village 2023',
    'Sentob qishlog''ining UN Tourism tomonidan eng yaxshi turizm qishlog''i deb topilishi haqida.'
  )
on conflict (slug) do nothing;

insert into public.reviews (guest_name, rating, comment, source)
values
  ('Dilnoza A.', 5, 'Ajoyib tabiat va mehmondo''stlik! Sentobga albatta qaytamiz.', 'local'),
  ('James Carter', 5, 'One of the most authentic mountain village experiences in Central Asia.', 'google'),
  ('Elena Petrova', 4.5, 'Прекрасное место для отдыха от городской суеты. Очень рекомендую.', 'tripadvisor'),
  ('Aziz Karimov', 5, 'Ot minib sayohat qilish unutilmas taassurot qoldirdi.', 'local')
on conflict do nothing;
