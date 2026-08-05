import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BookingRow } from "@/types/database";

export type BookingWithGuestHouse = BookingRow & {
  guest_houses: { name: string; slug: string } | null;
};

export async function getAllBookings(): Promise<BookingWithGuestHouse[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guest_houses(name, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBookings error:", error.message);
    return [];
  }

  return (data ?? []) as unknown as BookingWithGuestHouse[];
}
