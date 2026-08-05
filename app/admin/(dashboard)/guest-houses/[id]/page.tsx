import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GuestHouseForm } from "@/components/admin/GuestHouseForm";
import { getGuestHouseByIdAdmin } from "@/lib/admin/queries";
import { updateGuestHouseAction } from "@/lib/admin/actions/guest-houses";

export default async function EditGuestHousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guestHouse = await getGuestHouseByIdAdmin(id);

  if (!guestHouse) notFound();

  const boundAction = updateGuestHouseAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/guest-houses" className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-forest-800">
        <ArrowLeft size={15} /> Guest Houses
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-forest-950">{guestHouse.name}</h1>
      <GuestHouseForm action={boundAction} defaultValues={guestHouse} />
    </div>
  );
}
