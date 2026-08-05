"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function toggleReviewPublishedAction(id: string, isPublished: boolean) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("reviews").update({ is_published: isPublished }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { success: true };
}

export async function deleteReviewAction(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { success: true };
}
