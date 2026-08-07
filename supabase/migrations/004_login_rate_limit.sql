-- ============================================================
-- SENTOB TOURISM PLATFORM — MIGRATION 004 (Admin rebuild)
-- Login rate limiting (5 failed attempts -> 15 minute lock)
-- ============================================================

create table if not exists public.login_attempts (
  identifier text primary key,
  attempt_count integer not null default 0,
  locked_until timestamptz,
  last_attempt_at timestamptz not null default now()
);

alter table public.login_attempts enable row level security;

-- No public policies: this table is only ever touched by the
-- service-role admin client from server-only code (the login
-- Server Action), never from the browser or an anon session.
