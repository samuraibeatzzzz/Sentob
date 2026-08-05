import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EventRow } from "@/types/database";

export async function getUpcomingEvents(): Promise<EventRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("getUpcomingEvents error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("getEventBySlug error:", error.message);
    return null;
  }

  return data;
}
