"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BookingStatus } from "@/types/database";

export async function updateBookingStatusAction(bookingId: string, status: BookingStatus) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { success: true };
}
