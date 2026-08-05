import { getAllBookings } from "@/lib/admin/bookings-queries";
import { BookingActions } from "@/components/admin/BookingActions";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types/database";

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-forest-900/[0.06] text-forest-800",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();
  const numberFormat = new Intl.NumberFormat("uz-UZ");

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Bookings</h1>
      <p className="mt-1 text-sm text-ink-600">Barcha band qilishlarni ko&apos;rish va boshqarish.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-cream-50 ring-1 ring-forest-900/5">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest-900/10 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-5 py-3 font-medium">Mehmon</th>
              <th className="px-5 py-3 font-medium">Mehmon uyi</th>
              <th className="px-5 py-3 font-medium">Sanalar</th>
              <th className="px-5 py-3 font-medium">Narx</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-600">
                  Hozircha band qilishlar yo&apos;q.
                </td>
              </tr>
            )}
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-forest-900/5 last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium text-forest-950">{booking.guest_name}</p>
                  <p className="text-xs text-ink-600">{booking.guest_phone}</p>
                </td>
                <td className="px-5 py-4 text-ink-600">{booking.guest_houses?.name ?? "—"}</td>
                <td className="px-5 py-4 text-ink-600">
                  {new Date(booking.check_in).toLocaleDateString("uz-UZ")} –{" "}
                  {new Date(booking.check_out).toLocaleDateString("uz-UZ")}
                  <span className="ml-1 text-xs">({booking.nights} kecha)</span>
                </td>
                <td className="px-5 py-4 font-medium text-forest-800">
                  {numberFormat.format(booking.total_price)} so&apos;m
                </td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLE[booking.status])}>
                    {STATUS_LABEL[booking.status]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <BookingActions bookingId={booking.id} status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
