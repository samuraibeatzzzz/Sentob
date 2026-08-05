import { CalendarCheck, Home, Star, Newspaper, PartyPopper, Wallet } from "lucide-react";
import { getDashboardStats } from "@/lib/admin/queries";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-2xl bg-cream-50 p-6 ring-1 ring-forest-900/5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-600">{label}</p>
        <Icon size={18} className="text-forest-600" />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-forest-950">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const numberFormat = new Intl.NumberFormat("uz-UZ");

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-600">Sentob platformasining umumiy holati.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Jami bandlar" value={stats.totalBookings} icon={CalendarCheck} />
        <StatCard label="Kutilayotgan bandlar" value={stats.pendingBookings} icon={CalendarCheck} />
        <StatCard label="Faol mehmon uylari" value={stats.activeGuestHouses} icon={Home} />
        <StatCard label="Tasdiqlangan daromad" value={`${numberFormat.format(stats.confirmedRevenue)} so'm`} icon={Wallet} />
        <StatCard label="Sharhlar" value={stats.totalReviews} icon={Star} />
        <StatCard label="Chop etilgan maqolalar" value={stats.publishedPosts} icon={Newspaper} />
        <StatCard label="Tadbirlar" value={stats.publishedEvents} icon={PartyPopper} />
      </div>
    </div>
  );
}
