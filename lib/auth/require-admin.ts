import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole, ProfileRow } from "@/types/database";

export type AuthedAdmin = {
  userId: string;
  email: string | null;
  profile: ProfileRow;
};

/**
 * Verifies the current session belongs to a signed-in user AND that the
 * user's role (re-read from `profiles` on every call — never trusted
 * from a cached session or client-supplied claim) is one of the allowed
 * roles. Redirects to the login page otherwise.
 *
 * The proxy (see /proxy.ts) already performs this same check before the
 * request reaches here, so in normal operation this never redirects.
 * It exists as a second, independent layer: if it ever disagrees with
 * the proxy, it always resolves by signing the session out first, so a
 * bad session can never bounce between /admin and /admin/login.
 */
export async function requireAdmin(
  allowedRoles: AppRole[] = ["admin", "manager"]
): Promise<AuthedAdmin> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || !allowedRoles.includes(profile.role)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  return { userId: user.id, email: user.email ?? null, profile };
}
