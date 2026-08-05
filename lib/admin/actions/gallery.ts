"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { GalleryCategory } from "@/types/database";

export async function addGalleryItemAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();

  const url = String(formData.get("url") ?? "").trim();
  const category = String(formData.get("category") ?? "") as GalleryCategory;
  const title = String(formData.get("title") ?? "").trim();

  if (!url || !/^https?:\/\//.test(url)) {
    return { error: "To'g'ri URL kiriting" };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("gallery_items").insert({
    url,
    category,
    title: title || null,
    media_type: "photo",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function toggleGalleryPublishedAction(id: string, isPublished: boolean) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryItemAction(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}
