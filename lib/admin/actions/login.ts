"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
  normalizeIdentifier,
  MAX_ATTEMPTS,
} from "@/lib/admin/rate-limit";

export type LoginState = {
  error?: string;
  attemptsRemaining?: number;
};

export async function signInAction(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const emailRaw = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "") || "/admin";

  if (!emailRaw || !password) {
    return { error: "Email va parolni kiriting" };
  }

  const identifier = normalizeIdentifier(emailRaw);

  const rate = await checkRateLimit(identifier);
  if (rate.locked) {
    return {
      error: `Juda ko'p noto'g'ri urinish. ${rate.remainingMinutes} daqiqadan so'ng qayta urinib ko'ring.`,
    };
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Server sozlamalarida xatolik. Administratorga murojaat qiling." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailRaw,
    password,
  });

  if (error || !data.user) {
    const status = await recordFailedAttempt(identifier);
    if (status.locked) {
      return {
        error: `Ko'p marta noto'g'ri urinildi. Hisob ${status.remainingMinutes} daqiqaga bloklandi.`,
      };
    }
    const remaining = Math.max(0, MAX_ATTEMPTS - (status.attemptCount ?? 0));
    return {
      error: "Email yoki parol noto'g'ri",
      attemptsRemaining: remaining,
    };
  }

  // Valid credentials — this identifier is not a brute-force risk anymore.
  await resetAttempts(identifier);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const isAuthorized = !!profile && (profile.role === "admin" || profile.role === "manager");

  if (!isAuthorized) {
    // Valid login, but no admin access: never leave an authorized-looking
    // session lying around on the login screen.
    await supabase.auth.signOut();
    return { error: "Bu hisobda admin panelga kirish huquqi yo'q." };
  }

  redirect(redirectTo);
}
