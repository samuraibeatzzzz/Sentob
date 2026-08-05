import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReviewRow } from "@/types/database";

export async function getPublishedReviews(): Promise<ReviewRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("review_date", { ascending: false });

  if (error) {
    console.error("getPublishedReviews error:", error.message);
    return [];
  }

  return data ?? [];
}
