import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export type RateLimitStatus =
  | { locked: false; attemptCount?: number }
  | { locked: true; remainingMinutes: number };

/** Normalizes an email so "Admin@Sentob.uz" and "admin@sentob.uz" share one counter. */
export function normalizeIdentifier(email: string): string {
  return email.trim().toLowerCase();
}

export async function checkRateLimit(identifier: string): Promise<RateLimitStatus> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("login_attempts")
    .select("*")
    .eq("identifier", identifier)
    .maybeSingle();

  if (!data?.locked_until) return { locked: false };

  const lockedUntil = new Date(data.locked_until).getTime();
  const now = Date.now();

  if (lockedUntil <= now) return { locked: false };

  return { locked: true, remainingMinutes: Math.ceil((lockedUntil - now) / 60000) };
}

export async function recordFailedAttempt(identifier: string): Promise<RateLimitStatus> {
  const supabase = createSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("login_attempts")
    .select("*")
    .eq("identifier", identifier)
    .maybeSingle();

  const attemptCount = (existing?.attempt_count ?? 0) + 1;
  const shouldLock = attemptCount >= MAX_ATTEMPTS;
  const lockedUntil = shouldLock
    ? new Date(Date.now() + LOCKOUT_MINUTES * 60000).toISOString()
    : null;

  await supabase.from("login_attempts").upsert({
    identifier,
    attempt_count: shouldLock ? 0 : attemptCount, // reset counter once locked, fresh window after
    locked_until: lockedUntil,
    last_attempt_at: new Date().toISOString(),
  });

  return shouldLock
    ? { locked: true, remainingMinutes: LOCKOUT_MINUTES }
    : { locked: false, attemptCount };
}

export async function resetAttempts(identifier: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  await supabase.from("login_attempts").delete().eq("identifier", identifier);
}
