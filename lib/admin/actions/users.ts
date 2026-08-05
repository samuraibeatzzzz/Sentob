"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AppRole } from "@/types/database";

export async function updateUserRoleAction(userId: string, role: AppRole) {
  // Only a full admin (not a manager) may change roles.
  const { userId: actingUserId } = await requireAdmin(["admin"]);

  if (userId === actingUserId && role !== "admin") {
    return { error: "O'zingizning admin rolingizni pasaytira olmaysiz" };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}
