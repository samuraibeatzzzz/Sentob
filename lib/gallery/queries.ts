import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { GalleryItemRow, GalleryCategory, TourSceneRow } from "@/types/database";

export async function getGalleryItems(category?: GalleryCategory): Promise<GalleryItemRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("gallery_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getGalleryItems error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getTourScenes(): Promise<TourSceneRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tour_scenes")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getTourScenes error:", error.message);
    return [];
  }

  return data ?? [];
}
