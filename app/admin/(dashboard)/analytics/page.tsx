import { getBookingAnalytics } from "@/lib/admin/analytics-queries";

const STATUS_LABEL: Record<string, string> = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};

export default async function AdminAnalyticsPage() {
  const analytics = await getBookingAnalytics();
  const numberFormat = new Intl.NumberFormat("uz-UZ");
  const maxMonthly = Math.max(1, ...analytics.monthly.map((m) => m.count));
  const maxGuestHouse = Math.max(1, ...analytics.topGuestHouses.map((g) => g.count));

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Analytics</h1>
      <p className="mt-1 text-sm text-ink-600">Bandlar bo&apos;yicha statistik ko&apos;rsatkichlar.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-cream-50 p-6 ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-medium text-forest-950">Oxirgi 6 oy — bandlar soni</h2>
          <div className="mt-6 flex items-end gap-3">
            {analytics.monthly.map((m) => (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-forest-600"
                    style={{ height: `${(m.count / maxMonthly) * 100}%`, minHeight: m.count > 0 ? "4px" : "0" }}
                  />
                </div>
                <span className="text-[10px] text-ink-600">{m.label}</span>
                <span className="text-xs font-medium text-forest-950">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-cream-50 p-6 ring-1 ring-forest-900/5">
          <h2 className="font-display text-lg font-medium text-forest-950">Status bo&apos;yicha</h2>
          <div className="mt-6 space-y-4">
            {Object.entries(analytics.byStatus).length === 0 && (
              <p className="text-sm text-ink-600">Ma&apos;lumot yo&apos;q.</p>
            )}
            {Object.entries(analytics.byStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-xs text-ink-600">
                  <span>{STATUS_LABEL[status] ?? status}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-forest-900/[0.06]">
                  <div
                    className="h-full rounded-full bg-forest-600"
                    style={{ width: `${(count / analytics.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-cream-50 p-6 ring-1 ring-forest-900/5 lg:col-span-2">
          <h2 className="font-display text-lg font-medium text-forest-950">Eng ko&apos;p band qilingan mehmon uylari</h2>
          <div className="mt-6 space-y-4">
            {analytics.topGuestHouses.length === 0 && (
              <p className="text-sm text-ink-600">Ma&apos;lumot yo&apos;q.</p>
            )}
            {analytics.topGuestHouses.map((g) => (
              <div key={g.name}>
                <div className="flex justify-between text-xs text-ink-600">
                  <span className="font-medium text-forest-950">{g.name}</span>
                  <span>
                    {g.count} band · {numberFormat.format(g.revenue)} so&apos;m
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-forest-900/[0.06]">
                  <div
                    className="h-full rounded-full bg-gold-500"
                    style={{ width: `${(g.count / maxGuestHouse) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
