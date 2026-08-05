import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllGuestHousesAdmin } from "@/lib/admin/queries";
import { GuestHouseRowActions } from "@/components/admin/GuestHouseRowActions";
import { buttonVariants } from "@/components/ui/Button";

export default async function AdminGuestHousesPage() {
  const guestHouses = await getAllGuestHousesAdmin();
  const numberFormat = new Intl.NumberFormat("uz-UZ");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-forest-950">Guest Houses</h1>
          <p className="mt-1 text-sm text-ink-600">Mehmon uylarini qo&apos;shish va tahrirlash.</p>
        </div>
        <Link href="/admin/guest-houses/new" className={buttonVariants({ size: "sm" })}>
          <Plus size={15} /> Yangi qo&apos;shish
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-cream-50 ring-1 ring-forest-900/5">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest-900/10 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-5 py-3 font-medium">Nomi</th>
              <th className="px-5 py-3 font-medium">Narx / kecha</th>
              <th className="px-5 py-3 font-medium">Reyting</th>
              <th className="px-5 py-3 font-medium">Holat</th>
              <th className="px-5 py-3 font-medium"></th>
              <th className="px-5 py-3 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {guestHouses.map((house) => (
              <tr key={house.id} className="border-b border-forest-900/5 last:border-0">
                <td className="px-5 py-4">
                  <Link href={`/admin/guest-houses/${house.id}`} className="font-medium text-forest-950 hover:text-forest-700">
                    {house.name}
                  </Link>
                  <p className="text-xs text-ink-600">/{house.slug}</p>
                </td>
                <td className="px-5 py-4 text-ink-600">
                  {numberFormat.format(house.price_per_night)} so&apos;m
                </td>
                <td className="px-5 py-4 text-ink-600">
                  {house.rating} ({house.review_count})
                </td>
                <td className="px-5 py-4">
                  <GuestHouseRowActions id={house.id} isActive={house.is_active} />
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/guest-houses/${house.id}`} className="text-forest-700 hover:text-forest-900">
                    Tahrirlash
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
