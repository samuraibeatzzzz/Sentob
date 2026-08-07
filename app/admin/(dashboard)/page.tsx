import Link from "next/link";
import { ExternalLink, CalendarCheck, Home, Star, Newspaper, PartyPopper, Wallet, Clock } from "lucide-react";
import { getDashboardStats } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-forest-600",
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-cream-50 p-6 ring-1 ring-forest-900/5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-600">{label}</p>
        <Icon size={18} className={accent} />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-forest-950">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [{ profile }, stats] = await Promise.all([requireAdmin(), getDashboardStats()]);
  const numberFormat = new Intl.NumberFormat("uz-UZ");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-forest-950">
            Xush kelibsiz{profile.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-ink-600">Sentob platformasining umumiy holati.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-medium text-forest-800 hover:bg-forest-900/5"
        >
          Saytni ko&apos;rish <ExternalLink size={13} />
        </Link>
      </div>

      {stats.pendingBookings > 0 && (
        <Link
          href="/admin/bookings"
          className="mt-6 flex items-center gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-800 ring-1 ring-amber-200 transition-colors hover:bg-amber-100"
        >
          <Clock size={17} className="shrink-0" />
          <span>
            <strong>{stats.pendingBookings}</strong> ta band qilish tasdiqlanishini kutmoqda —
            ko&apos;rish uchun bosing.
          </span>
        </Link>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Jami bandlar" value={stats.totalBookings} icon={CalendarCheck} />
        <StatCard
          label="Kutilayotgan bandlar"
          value={stats.pendingBookings}
          icon={CalendarCheck}
          accent="text-amber-600"
        />
        <StatCard label="Faol mehmon uylari" value={stats.activeGuestHouses} icon={Home} />
        <StatCard
          label="Tasdiqlangan daromad"
          value={`${numberFormat.format(stats.confirmedRevenue)} so'm`}
          icon={Wallet}
          accent="text-gold-500"
        />
        <StatCard label="Sharhlar" value={stats.totalReviews} icon={Star} />
        <StatCard label="Chop etilgan maqolalar" value={stats.publishedPosts} icon={Newspaper} />
        <StatCard label="Tadbirlar" value={stats.publishedEvents} icon={PartyPopper} />
      </div>
    </div>
  );
}
