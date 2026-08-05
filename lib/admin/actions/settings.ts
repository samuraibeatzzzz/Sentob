"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SETTINGS_KEYS } from "@/lib/admin/settings-constants";

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    console.error("getSiteSettings error:", error.message);
    return {};
  }

  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
}

export async function updateSiteSettingsAction(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const updates = SETTINGS_KEYS.map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
  }));

  const { error } = await supabase.from("site_settings").upsert(updates, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  return { success: true };
}
