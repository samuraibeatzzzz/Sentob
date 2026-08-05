import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getBookingAnalytics() {
  const supabase = createSupabaseAdminClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("status, total_price, created_at, guest_house_id, guest_houses(name)");

  const rows = (bookings ?? []) as unknown as {
    status: string;
    total_price: number;
    created_at: string;
    guest_house_id: string;
    guest_houses: { name: string } | null;
  }[];

  const byStatus: Record<string, number> = {};
  rows.forEach((b) => {
    byStatus[b.status] = (byStatus[b.status] ?? 0) + 1;
  });

  const byGuestHouse = new Map<string, { name: string; count: number; revenue: number }>();
  rows.forEach((b) => {
    const key = b.guest_house_id;
    const existing = byGuestHouse.get(key) ?? {
      name: b.guest_houses?.name ?? "—",
      count: 0,
      revenue: 0,
    };
    existing.count += 1;
    if (b.status === "confirmed" || b.status === "completed") {
      existing.revenue += Number(b.total_price);
    }
    byGuestHouse.set(key, existing);
  });

  const topGuestHouses = Array.from(byGuestHouse.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Last 6 months booking counts
  const monthBuckets: { label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("uz-UZ", { month: "short", year: "2-digit" });
    const count = rows.filter((b) => {
      const created = new Date(b.created_at);
      return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
    }).length;
    monthBuckets.push({ label, count });
  }

  return {
    total: rows.length,
    byStatus,
    topGuestHouses,
    monthly: monthBuckets,
  };
}
