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
 * user's role (re-read from `profiles` on every call, never trusted from
 * a client-supplied claim or cached session) is admin or manager.
 * Redirects to the login page otherwise.
 */
export async function requireAdmin(allowedRoles: AppRole[] = ["admin", "manager"]): Promise<AuthedAdmin> {
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
    redirect("/admin/login?error=forbidden");
  }

  return { userId: user.id, email: user.email ?? null, profile };
}
