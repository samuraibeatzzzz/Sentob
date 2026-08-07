-- ============================================================
-- SENTOB TOURISM PLATFORM — MIGRATION 003 (Milestone 4)
-- Site settings (key-value store for admin-managed contact info)
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.site_settings;
create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);

insert into public.site_settings (key, value) values
  ('site_name', 'Sentob Turizm Qishlog''i'),
  ('contact_phone', '+998 91 123 45 67'),
  ('contact_email', 'info@sentob.uz'),
  ('contact_telegram', 'https://t.me/sentob'),
  ('contact_instagram', 'https://instagram.com/sentob'),
  ('contact_facebook', 'https://facebook.com/sentob'),
  ('contact_youtube', 'https://youtube.com/@sentob'),
  ('contact_address', 'Sentob qishlog''i, Nurota tumani, Navoiy viloyati')
on conflict (key) do nothing;
