import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { GuestHouseRow } from "@/types/database";

export async function getActiveGuestHouses(): Promise<GuestHouseRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("guest_houses")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  if (error) {
    console.error("getActiveGuestHouses error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getGuestHouseBySlug(slug: string): Promise<GuestHouseRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("guest_houses")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getGuestHouseBySlug error:", error.message);
    return null;
  }

  return data;
}
