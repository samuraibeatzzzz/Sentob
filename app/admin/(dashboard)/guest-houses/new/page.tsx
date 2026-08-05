import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GuestHouseForm } from "@/components/admin/GuestHouseForm";
import { createGuestHouseAction } from "@/lib/admin/actions/guest-houses";

export default function NewGuestHousePage() {
  return (
    <div>
      <Link href="/admin/guest-houses" className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-forest-800">
        <ArrowLeft size={15} /> Guest Houses
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-forest-950">Yangi mehmon uyi</h1>
      <GuestHouseForm action={createGuestHouseAction} />
    </div>
  );
}
