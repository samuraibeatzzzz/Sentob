import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllEventsAdmin } from "@/lib/admin/queries";
import { EventRowActions } from "@/components/admin/EventRowActions";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default async function AdminEventsPage() {
  const events = await getAllEventsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-forest-950">Events</h1>
          <p className="mt-1 text-sm text-ink-600">Tadbirlar va festivallarni boshqarish.</p>
        </div>
        <Link href="/admin/events/new" className={buttonVariants({ size: "sm" })}>
          <Plus size={15} /> Yangi tadbir
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-cream-50 ring-1 ring-forest-900/5">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest-900/10 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-5 py-3 font-medium">Nomi</th>
              <th className="px-5 py-3 font-medium">Sana</th>
              <th className="px-5 py-3 font-medium">Holat</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-forest-900/5 last:border-0">
                <td className="px-5 py-4">
                  <Link href={`/admin/events/${event.id}`} className="font-medium text-forest-950 hover:text-forest-700">
                    {event.title}
                  </Link>
                </td>
                <td className="px-5 py-4 text-ink-600">
                  {new Date(event.start_date).toLocaleDateString("uz-UZ")}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      event.is_published ? "bg-forest-900/[0.06] text-forest-800" : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {event.is_published ? "Chop etilgan" : "Qoralama"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <EventRowActions id={event.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
